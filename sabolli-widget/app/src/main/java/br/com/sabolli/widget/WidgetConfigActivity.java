package br.com.sabolli.widget;

import android.appwidget.AppWidgetManager;
import android.content.Intent;
import android.os.Bundle;
import android.app.Activity;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class WidgetConfigActivity extends Activity {

    private int widgetId = AppWidgetManager.INVALID_APPWIDGET_ID;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Resultado padrão = cancelado (se o usuário fechar sem confirmar)
        setResult(RESULT_CANCELED);

        // Pegar o widgetId do intent
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            widgetId = extras.getInt(AppWidgetManager.EXTRA_APPWIDGET_ID,
                    AppWidgetManager.INVALID_APPWIDGET_ID);
        }
        if (widgetId == AppWidgetManager.INVALID_APPWIDGET_ID) {
            finish();
            return;
        }

        setContentView(R.layout.config_activity);

        EditText etCode = findViewById(R.id.et_code);
        TextView tvError = findViewById(R.id.tv_error);
        Button btnConfirm = findViewById(R.id.btn_confirm);

        // Se já tem um UID salvo, preenche
        String existing = WidgetProvider.getUid(this, widgetId);
        if (existing != null && !existing.isEmpty()) {
            etCode.setText(existing);
        }

        btnConfirm.setOnClickListener(v -> {
            String code = etCode.getText().toString().trim();

            if (code.length() < 10) {
                tvError.setText("Código inválido. Copie do app Sabolli → Temas → Widget.");
                return;
            }

            tvError.setText("");
            WidgetProvider.saveUid(this, widgetId, code);

            // Carregar o widget pela primeira vez
            AppWidgetManager mgr = AppWidgetManager.getInstance(this);
            WidgetProvider.refreshWidget(this, mgr, widgetId);

            // Confirmar criação do widget
            Intent result = new Intent();
            result.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, widgetId);
            setResult(RESULT_OK, result);
            finish();
        });
    }
}
