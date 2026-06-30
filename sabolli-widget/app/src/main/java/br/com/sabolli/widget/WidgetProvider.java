package br.com.sabolli.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.widget.RemoteViews;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.NumberFormat;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class WidgetProvider extends AppWidgetProvider {

    static final String ACTION_REFRESH = "br.com.sabolli.widget.REFRESH";
    static final String PREFS_NAME = "SabolliWidgetPrefs";
    static final String PREF_UID = "widget_uid";

    private static final String API_KEY = "AIzaSyBTJmv-CaNSyYL1mA9HAO-vjL5fUL4vpPc";
    private static final String PROJECT = "sabolli-financas";
    private static final String APP_URL = "https://sabolli-financas.web.app";

    private static final NumberFormat BRL = NumberFormat.getCurrencyInstance(new Locale("pt", "BR"));

    @Override
    public void onUpdate(Context ctx, AppWidgetManager mgr, int[] ids) {
        for (int id : ids) refreshWidget(ctx, mgr, id);
    }

    @Override
    public void onReceive(Context ctx, Intent intent) {
        super.onReceive(ctx, intent);
        if (ACTION_REFRESH.equals(intent.getAction())) {
            AppWidgetManager mgr = AppWidgetManager.getInstance(ctx);
            int[] ids = mgr.getAppWidgetIds(new ComponentName(ctx, WidgetProvider.class));
            for (int id : ids) refreshWidget(ctx, mgr, id);
        }
    }

    static void refreshWidget(Context ctx, AppWidgetManager mgr, int widgetId) {
        RemoteViews views = buildLoadingViews(ctx);
        mgr.updateAppWidget(widgetId, views);

        String uid = getUid(ctx, widgetId);
        if (uid == null || uid.isEmpty()) {
            RemoteViews err = buildViews(ctx, widgetId, null, null, null, null, "Configure o widget →");
            mgr.updateAppWidget(widgetId, err);
            return;
        }

        ExecutorService exec = Executors.newSingleThreadExecutor();
        Handler handler = new Handler(Looper.getMainLooper());

        exec.execute(() -> {
            WidgetData data = fetchData(uid);
            handler.post(() -> {
                RemoteViews updated = buildViews(ctx, widgetId,
                        data != null ? data.total : null,
                        data != null ? data.names : null,
                        data != null ? data.balances : null,
                        data != null ? data.updatedAt : null,
                        data == null ? "Sem conexão" : null);
                mgr.updateAppWidget(widgetId, updated);
            });
        });
        exec.shutdown();
    }

    private static RemoteViews buildLoadingViews(Context ctx) {
        RemoteViews v = new RemoteViews(ctx.getPackageName(), R.layout.widget_layout);
        v.setTextViewText(R.id.tv_total, "R$ ...");
        v.setTextViewText(R.id.tv_status, "Atualizando...");
        v.setTextViewText(R.id.tv_n0, "");
        v.setTextViewText(R.id.tv_b0, "");
        v.setTextViewText(R.id.tv_n1, "");
        v.setTextViewText(R.id.tv_b1, "");
        v.setTextViewText(R.id.tv_n2, "");
        v.setTextViewText(R.id.tv_b2, "");
        return v;
    }

    private static RemoteViews buildViews(Context ctx, int widgetId,
                                           Double total, String[] names, Double[] balances,
                                           String updatedAt, String errorMsg) {
        RemoteViews v = new RemoteViews(ctx.getPackageName(), R.layout.widget_layout);

        // Saldo total
        v.setTextViewText(R.id.tv_total, total != null ? BRL.format(total) : "R$ —");

        // Contas (máx 3)
        int[] nameIds = {R.id.tv_n0, R.id.tv_n1, R.id.tv_n2};
        int[] balIds = {R.id.tv_b0, R.id.tv_b1, R.id.tv_b2};
        for (int i = 0; i < 3; i++) {
            if (names != null && i < names.length && names[i] != null) {
                v.setTextViewText(nameIds[i], names[i]);
                v.setTextViewText(balIds[i], balances != null && i < balances.length && balances[i] != null
                        ? BRL.format(balances[i]) : "");
            } else {
                v.setTextViewText(nameIds[i], "");
                v.setTextViewText(balIds[i], "");
            }
        }

        // Status
        String status = errorMsg != null ? errorMsg
                : (updatedAt != null ? "Atualizado às " + updatedAt : "Toque ↻ para atualizar");
        v.setTextViewText(R.id.tv_status, status);

        // Botão refresh
        Intent refreshIntent = new Intent(ctx, WidgetProvider.class);
        refreshIntent.setAction(ACTION_REFRESH);
        PendingIntent refreshPi = PendingIntent.getBroadcast(ctx, widgetId, refreshIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        v.setOnClickPendingIntent(R.id.btn_refresh, refreshPi);

        // Botão abrir app
        Intent openIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(APP_URL));
        openIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        PendingIntent openPi = PendingIntent.getActivity(ctx, widgetId + 1000, openIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        v.setOnClickPendingIntent(R.id.btn_open, openPi);

        return v;
    }

    private static WidgetData fetchData(String uid) {
        try {
            String urlStr = "https://firestore.googleapis.com/v1/projects/" + PROJECT
                    + "/databases/(default)/documents/widget_data/" + uid
                    + "?key=" + API_KEY;

            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(8000);
            conn.setReadTimeout(8000);

            int code = conn.getResponseCode();
            if (code != 200) return null;

            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) sb.append(line);
            conn.disconnect();

            return parseFirestore(sb.toString());

        } catch (Exception e) {
            Log.w("SabolliWidget", "fetch error: " + e.getMessage());
            return null;
        }
    }

    private static WidgetData parseFirestore(String json) {
        try {
            JSONObject root = new JSONObject(json);
            JSONObject fields = root.getJSONObject("fields");

            WidgetData d = new WidgetData();

            if (fields.has("total")) {
                JSONObject tf = fields.getJSONObject("total");
                d.total = tf.has("doubleValue") ? tf.getDouble("doubleValue")
                        : tf.has("integerValue") ? tf.getDouble("integerValue") : null;
            }

            // Contas: a0n/a0b, a1n/a1b, a2n/a2b
            d.names = new String[3];
            d.balances = new Double[3];
            for (int i = 0; i < 3; i++) {
                String nk = "a" + i + "n";
                String bk = "a" + i + "b";
                if (fields.has(nk)) d.names[i] = fields.getJSONObject(nk).optString("stringValue", "");
                if (fields.has(bk)) {
                    JSONObject bf = fields.getJSONObject(bk);
                    d.balances[i] = bf.has("doubleValue") ? bf.getDouble("doubleValue")
                            : bf.has("integerValue") ? bf.getDouble("integerValue") : null;
                }
            }

            // Timestamp simplificado
            if (fields.has("ts")) {
                String ts = fields.getJSONObject("ts").optString("stringValue", "");
                if (ts.length() >= 16) {
                    String time = ts.substring(11, 16); // HH:mm
                    d.updatedAt = time;
                }
            }

            return d;
        } catch (Exception e) {
            Log.w("SabolliWidget", "parse error: " + e.getMessage());
            return null;
        }
    }

    static String getUid(Context ctx, int widgetId) {
        SharedPreferences prefs = ctx.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String uid = prefs.getString(PREF_UID + "_" + widgetId, null);
        if (uid == null) uid = prefs.getString(PREF_UID, null); // fallback global
        return uid;
    }

    static void saveUid(Context ctx, int widgetId, String uid) {
        ctx.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .edit()
                .putString(PREF_UID + "_" + widgetId, uid)
                .putString(PREF_UID, uid)
                .apply();
    }

    static class WidgetData {
        Double total;
        String[] names;
        Double[] balances;
        String updatedAt;
    }
}
