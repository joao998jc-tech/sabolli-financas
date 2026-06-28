// SABOLLI FINANÇAS v2.7

// ===== TEMAS =====
const APP_THEMES = {
  azul:    { name:'Azul Claro',    emoji:'💙', dark:false, accent:'#1E3A8A', accentV:'#2563EB', accentL:'#3B82F6', bg:'#F0F6FF', card:'#FFFFFF', border:'#E8EEF8', text:'#1E293B', textS:'#64748B', topbar:'#FFFFFF', inputBg:'#FFFFFF', hover:'#FAFBFF', secBg:'#FFFFFF' },
  noite:   { name:'Noite Azul',    emoji:'🌙', dark:true,  accent:'#1E3A8A', accentV:'#3B82F6', accentL:'#60A5FA', bg:'#0B1120', card:'#131C2E', border:'#1E2D45', text:'#E8F0FE', textS:'#7B92B3', topbar:'#0F1929', inputBg:'#162033', hover:'#1A2840', secBg:'#131C2E' },
  verde:   { name:'Verde Natura',  emoji:'🌿', dark:false, accent:'#065F46', accentV:'#10B981', accentL:'#34D399', bg:'#F0FDF4', card:'#FFFFFF', border:'#D1FAE5', text:'#064E3B', textS:'#047857', topbar:'#FFFFFF', inputBg:'#FFFFFF', hover:'#F0FDF4', secBg:'#FFFFFF' },
  verdeN:  { name:'Floresta',      emoji:'🌲', dark:true,  accent:'#022C22', accentV:'#059669', accentL:'#34D399', bg:'#041C14', card:'#052E1C', border:'#064E3B', text:'#D1FAE5', textS:'#6EE7B7', topbar:'#041C14', inputBg:'#052E1C', hover:'#063324', secBg:'#052E1C' },
  roxo:    { name:'Roxo Galaxy',   emoji:'🔮', dark:true,  accent:'#4C1D95', accentV:'#7C3AED', accentL:'#A78BFA', bg:'#0F0720', card:'#1A0B35', border:'#2D1654', text:'#F3E8FF', textS:'#C4B5FD', topbar:'#130926', inputBg:'#1F0D3F', hover:'#220F45', secBg:'#1A0B35' },
  laranja: { name:'Pôr do Sol',    emoji:'🌅', dark:false, accent:'#9A3412', accentV:'#EA580C', accentL:'#FB923C', bg:'#FFF7ED', card:'#FFFFFF', border:'#FED7AA', text:'#431407', textS:'#9A3412', topbar:'#FFFFFF', inputBg:'#FFFFFF', hover:'#FFF7ED', secBg:'#FFFFFF' },
  rosa:    { name:'Rosa Coral',    emoji:'🌸', dark:false, accent:'#9D174D', accentV:'#DB2777', accentL:'#F472B6', bg:'#FDF2F8', card:'#FFFFFF', border:'#FBCFE8', text:'#500724', textS:'#9D174D', topbar:'#FFFFFF', inputBg:'#FFFFFF', hover:'#FDF2F8', secBg:'#FFFFFF' },
  grafite: { name:'Grafite',       emoji:'🖤', dark:true,  accent:'#374151', accentV:'#6B7280', accentL:'#9CA3AF', bg:'#111827', card:'#1F2937', border:'#374151', text:'#F9FAFB', textS:'#9CA3AF', topbar:'#1F2937', inputBg:'#111827', hover:'#252F3E', secBg:'#1F2937' },
  dourado: { name:'Dourado',       emoji:'✨', dark:false, accent:'#78350F', accentV:'#D97706', accentL:'#F59E0B', bg:'#FFFBEB', card:'#FFFFFF', border:'#FDE68A', text:'#451A03', textS:'#92400E', topbar:'#FFFFFF', inputBg:'#FFFFFF', hover:'#FFFBEB', secBg:'#FFFFFF' },
};

function initTheme() {
  const savedTheme = localStorage.getItem('sabolli_app_theme') || 'azul';
  applyAppTheme(savedTheme);
}

function applyAppTheme(themeId) {
  const t = APP_THEMES[themeId] || APP_THEMES.azul;
  const r = document.documentElement;
  r.style.setProperty('--blue-dark',  t.accent);
  r.style.setProperty('--blue-darker',t.accent);
  r.style.setProperty('--blue-vivid', t.accentV);
  r.style.setProperty('--blue-light', t.accentL);
  r.style.setProperty('--bg',         t.bg);
  r.style.setProperty('--card',       t.card);
  r.style.setProperty('--border',     t.border);
  r.style.setProperty('--text',       t.text);
  r.style.setProperty('--text-sec',   t.textS);
  r.style.setProperty('--topbar-bg',  t.topbar);
  r.style.setProperty('--input-bg',   t.inputBg);
  r.style.setProperty('--table-hover',t.hover);
  r.style.setProperty('--section-bg', t.secBg);
  r.style.setProperty('--chip-bg',    t.inputBg);
  if (t.dark) document.body.classList.add('dark');
  else document.body.classList.remove('dark');
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = t.dark ? '☀️' : '🌙';
  localStorage.setItem('sabolli_app_theme', themeId);
}

function applyTheme(mode) {
  // compatibilidade: light/dark toggle usa o tema salvo como base
  const cur = localStorage.getItem('sabolli_app_theme') || 'azul';
  const t = APP_THEMES[cur];
  if (mode === 'dark' && !t?.dark) {
    applyAppTheme('noite');
  } else if (mode === 'light' && t?.dark) {
    applyAppTheme('azul');
  }
  localStorage.setItem('sabolli_theme', mode);
}

function toggleTheme() {
  const isDark = document.body.classList.contains('dark');
  applyTheme(isDark ? 'light' : 'dark');
}


// ===== BANDEIRAS DE CARTÃO =====
const CARD_BRANDS = {
  visa:      { label:'Visa',          bg:'#1A1F71', logo:'<span style="color:#fff;font-size:13px;font-weight:900;font-style:italic;letter-spacing:-0.5px">VISA</span>' },
  mastercard:{ label:'Mastercard',    bg:'#1A1A2E', logo:'<span style="display:inline-flex;align-items:center"><span style="width:18px;height:18px;background:#EB001B;border-radius:50%;display:inline-block"></span><span style="width:18px;height:18px;background:#F79E1B;border-radius:50%;display:inline-block;margin-left:-8px;opacity:0.9"></span></span>' },
  elo:       { label:'Elo',           bg:'#00426B', logo:'<span style="color:#FFD700;font-size:13px;font-weight:900;letter-spacing:1px">ELO</span>' },
  amex:      { label:'Amex',          bg:'#007BBF', logo:'<span style="color:#fff;font-size:11px;font-weight:900;letter-spacing:0.5px">AMEX</span>' },
  hipercard: { label:'Hipercard',     bg:'#B60000', logo:'<span style="color:#fff;font-size:10px;font-weight:900">HIPER</span>' },
  nubank:    { label:'Nubank',        bg:'#820AD1', logo:'<span style="color:#fff;font-size:14px;font-weight:900">Nu</span>' },
  inter:     { label:'Inter',         bg:'#FF7F00', logo:'<span style="color:#fff;font-size:11px;font-weight:900">inter</span>' },
  c6:        { label:'C6 Bank',       bg:'#17181A', logo:'<span style="color:#DAFF00;font-size:12px;font-weight:900">C6</span>' },
  itau:      { label:'Itaú',          bg:'#003399', logo:'<span style="color:#FFB000;font-size:12px;font-weight:900">itaú</span>' },
  bradesco:  { label:'Bradesco',      bg:'#CC0000', logo:'<span style="color:#fff;font-size:10px;font-weight:900">bradesco</span>' },
  santander: { label:'Santander',     bg:'#EC0000', logo:'<span style="color:#fff;font-size:10px;font-weight:900">Santander</span>' },
  bb:        { label:'Banco do Brasil',bg:'#003F8A',logo:'<span style="color:#FFE600;font-size:13px;font-weight:900">BB</span>' },
  caixa:     { label:'Caixa',         bg:'#005CA9', logo:'<span style="color:#FFE600;font-size:10px;font-weight:900">CAIXA</span>' },
  outro:     { label:'Outro',         bg:'#334155', logo:'<span style="font-size:16px">💳</span>' },
};

// ===== ESTADO =====
let currentSection = 'dashboard';
let currentTab = 'personal';
let currentPeriod = 'month';
let orderCart = [];
let currentBillCardId = null;
let currentBillMonth = null;
let currentPersonalMonth = null;
let currentExtractTab = 'negocio';

// ===== HELPERS =====
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function localDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

function filterByPeriod(items, dateField) {
  const now = new Date();
  const today = todayStr();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-01`;
  const yearStart = `${now.getFullYear()}-01-01`;
  const weekAgo = localDateStr(new Date(now.getTime()-7*864e5));
  return items.filter(item => {
    const d = item[dateField]; if (!d) return false;
    if (currentPeriod==='today') return d===today;
    if (currentPeriod==='week') return d>=weekAgo;
    if (currentPeriod==='month') return d>=monthStart;
    if (currentPeriod==='year') return d>=yearStart;
    return true;
  });
}

function nextId(arr) {
  if (!arr || !arr.length) return 1;
  return Math.max(...arr.map(d => Number(d.id)||0)) + 1;
}

function fmt(v) { return 'R$ ' + Number(v||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}); }
function fmtDate(d) { if (!d) return ''; const [y,m,day]=d.split('-'); return `${day}/${m}/${y}`; }
function currentMonthStr() { const n=new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}`; }
function fmtMonth(ms) { const names=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']; const [y,m]=ms.split('-'); return `${names[Number(m)-1]}/${y}`; }
function addMonths(ms, n) { let [y,m]=ms.split('-').map(Number); m+=n; while(m>12){m-=12;y++;} while(m<1){m+=12;y--;} return `${y}-${String(m).padStart(2,'0')}`; }

// ===== CATEGORIAS =====
function loadCategories() {
  const stored = loadData('sabolli_categories');
  const defaults = {
    transactions: ['Vendas','Compras','Aluguel','Salários','Contas','Transporte','Outros'],
    card: ['Alimentação','Supermercado','Transporte','Saúde','Lazer','Vestuário','Serviços','Assinaturas','Outros'],
    personal: ['Alimentação','Mercado','Transporte','Saúde','Lazer','Educação','Vestuário','Serviços','Outros']
  };
  if (!stored) return defaults;
  if (!stored.transactions || !stored.transactions.length) stored.transactions = defaults.transactions;
  if (!stored.card || !stored.card.length) stored.card = defaults.card;
  if (!stored.personal || !stored.personal.length) stored.personal = defaults.personal;
  return stored;
}

// ===== STORAGE =====
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  if (window.syncSaveData) window.syncSaveData(key, data);
}
function loadData(key) { try { const d=localStorage.getItem(key); return d?JSON.parse(d):null; } catch(e){return null;} }

// ===== MENUS =====
const personalMenu = [
  { group:'INÍCIO', items:[
    { id:'dashboard', label:'Dashboard Pessoal', icon:'🏠' }
  ]},
  { group:'FINANCEIRO', items:[
    { id:'transactions', label:'Lançamentos', icon:'💰' },
    { id:'extract', label:'Extrato', icon:'📄' },
    { id:'accounts', label:'Contas e Cartões', icon:'💳' },
    { id:'planning', label:'Planejamento', icon:'📐' }
  ]},
  { group:'CONFIGURAÇÕES', items:[
    { id:'company', label:'Dados da Empresa', icon:'🏢' },
    { id:'categories', label:'Categorias', icon:'🏷️' },
    { id:'temas', label:'Temas do App', icon:'🎨' }
  ]}
];

const businessMenu = [
  { group:'VISÃO GERAL', items:[
    { id:'dashboard', label:'Dashboard Negócios', icon:'📊' }
  ]},
  { group:'VENDAS', items:[
    { id:'new-order', label:'Novo Pedido', icon:'🛒' },
    { id:'orders-list', label:'Lista de Pedidos', icon:'📋' },
    { id:'daily-sales', label:'Vendas Diárias', icon:'📅' }
  ]},
  { group:'CLIENTES', items:[
    { id:'customers', label:'Clientes', icon:'👥' },
    { id:'resellers', label:'Pontos de Revenda', icon:'🏪' }
  ]},
  { group:'PRODUTOS & ESTOQUE', items:[
    { id:'products', label:'Produtos', icon:'🍽️' },
    { id:'stock-mgmt', label:'Estoque', icon:'📦' },
    { id:'stock-moves', label:'Movimentação', icon:'🔄' }
  ]},
  { group:'COMPRAS', items:[
    { id:'new-purchase', label:'Nova Compra', icon:'🛍️' },
    { id:'purchases', label:'Histórico de Compras', icon:'🗂️' },
    { id:'inputs', label:'Insumos', icon:'🧂' },
    { id:'suppliers', label:'Fornecedores', icon:'🤝' }
  ]},
  { group:'RELATÓRIOS', items:[
    { id:'cmv', label:'CMV', icon:'📉' },
    { id:'ticket', label:'Ticket Médio', icon:'🎫' },
    { id:'goals', label:'Metas', icon:'🎯' }
  ]},
  { group:'OPERACIONAL', items:[
    { id:'delivery', label:'Taxa de Entrega', icon:'🚴' },
    { id:'company', label:'Dados da Empresa', icon:'🏢' }
  ]}
];

// ===== SEED DATA =====
function seedDemoDataIfEmpty() {
  if (localStorage.getItem('sabolli_seeded')) return;
  const t = todayStr();
  const d1 = new Date(Date.now()-1*864e5).toISOString().split('T')[0];
  const d2 = new Date(Date.now()-2*864e5).toISOString().split('T')[0];
  const d3 = new Date(Date.now()-3*864e5).toISOString().split('T')[0];
  const d7 = new Date(Date.now()-7*864e5).toISOString().split('T')[0];
  const d10 = new Date(Date.now()-10*864e5).toISOString().split('T')[0];
  const d15 = new Date(Date.now()-15*864e5).toISOString().split('T')[0];
  const d20 = new Date(Date.now()-20*864e5).toISOString().split('T')[0];

  saveData('sabolli_products', [
    { id:1, name:'Crepe Frango c/ Catupiry', category:'Crepes Salgados', price:32.90, cost:12.50 },
    { id:2, name:'Crepe Especial de Carne', category:'Crepes Salgados', price:29.90, cost:11.20 },
    { id:3, name:'Crepe Nutella c/ Morango', category:'Crepes Doces', price:34.90, cost:14.80 },
    { id:4, name:'Churros Gourmet', category:'Sobremesas', price:18.90, cost:6.50 },
    { id:5, name:'Geladão Gourmet', category:'Sobremesas', price:24.90, cost:9.20 },
    { id:6, name:'Sorvete de Massa', category:'Sobremesas', price:16.90, cost:5.80 }
  ]);

  saveData('sabolli_orders', [
    { id:1258, date:t, customer:'Maria Silva', items:[{id:1,name:'Crepe Frango c/ Catupiry',price:32.90,qty:2}], canal:'Loja Física', payment:'PIX', status:'Pago', total:71.80, delivery:0 },
    { id:1257, date:t, customer:'João Santos', items:[{id:2,name:'Crepe Especial de Carne',price:29.90,qty:1}], canal:'Delivery', payment:'Dinheiro', status:'Pago', total:35.90, delivery:6 },
    { id:1256, date:d1, customer:'Ana Costa', items:[{id:3,name:'Crepe Nutella c/ Morango',price:34.90,qty:2},{id:4,name:'Churros Gourmet',price:18.90,qty:1}], canal:'Delivery', payment:'PIX', status:'Pendente', total:94.70, delivery:6 },
    { id:1255, date:d1, customer:'Carlos Lima', items:[{id:5,name:'Geladão Gourmet',price:24.90,qty:3}], canal:'Loja Física', payment:'Cartão', status:'Pago', total:74.70, delivery:0 },
    { id:1254, date:d2, customer:'Fernanda Rocha', items:[{id:1,name:'Crepe Frango c/ Catupiry',price:32.90,qty:2},{id:2,name:'Crepe Especial de Carne',price:29.90,qty:2}], canal:'Revenda', payment:'Fiado', status:'Pendente', total:125.60, delivery:0 },
    { id:1253, date:d2, customer:'Roberto Alves', items:[{id:6,name:'Sorvete de Massa',price:16.90,qty:2}], canal:'Loja Física', payment:'PIX', status:'Pago', total:33.80, delivery:0 },
    { id:1252, date:d3, customer:'Patricia Souza', items:[{id:4,name:'Churros Gourmet',price:18.90,qty:3},{id:5,name:'Geladão Gourmet',price:24.90,qty:2}], canal:'Delivery', payment:'Cartão', status:'Pago', total:106.50, delivery:6 },
    { id:1251, date:d7, customer:'Lucas Ferreira', items:[{id:3,name:'Crepe Nutella c/ Morango',price:34.90,qty:2}], canal:'Loja Física', payment:'Dinheiro', status:'Pago', total:69.80, delivery:0 },
    { id:1250, date:d10, customer:'Amanda Castro', items:[{id:2,name:'Crepe Especial de Carne',price:29.90,qty:2}], canal:'Revenda', payment:'PIX', status:'Pago', total:59.80, delivery:0 },
    { id:1249, date:d15, customer:'Diego Santos', items:[{id:1,name:'Crepe Frango c/ Catupiry',price:32.90,qty:3},{id:4,name:'Churros Gourmet',price:18.90,qty:2}], canal:'Delivery', payment:'Cartão', status:'Pago', total:136.50, delivery:6 }
  ]);

  saveData('sabolli_customers', [
    { id:1, name:'Maria Silva', phone:'(11) 99999-1111', city:'Santo André', orders:12, total:890.00 },
    { id:2, name:'João Santos', phone:'(11) 99999-2222', city:'São Paulo', orders:8, total:540.00 },
    { id:3, name:'Ana Costa', phone:'(11) 99999-3333', city:'Santo André', orders:15, total:1200.00 },
    { id:4, name:'Carlos Lima', phone:'(11) 99999-4444', city:'São Paulo', orders:5, total:320.00 },
    { id:5, name:'Fernanda Rocha', phone:'(11) 99999-5555', city:'São Bernardo', orders:20, total:1680.00 }
  ]);

  saveData('sabolli_stock', [
    { id:1, name:'Farinha de Trigo', unit:'kg', qty:45, min:20, cost:4.50, category:'Farináceos' },
    { id:2, name:'Leite Integral', unit:'L', qty:38, min:15, cost:4.20, category:'Laticínios' },
    { id:3, name:'Ovos', unit:'un', qty:210, min:100, cost:0.65, category:'Proteínas' },
    { id:4, name:'Manteiga', unit:'kg', qty:12, min:5, cost:28.00, category:'Laticínios' },
    { id:5, name:'Catupiry', unit:'kg', qty:8, min:4, cost:32.00, category:'Laticínios' },
    { id:6, name:'Frango Desfiado', unit:'kg', qty:15, min:8, cost:18.50, category:'Carnes' },
    { id:7, name:'Acém Moído', unit:'kg', qty:12, min:6, cost:22.00, category:'Carnes' },
    { id:8, name:'Mussarela', unit:'kg', qty:10, min:5, cost:38.00, category:'Laticínios' },
    { id:9, name:'Nutella', unit:'kg', qty:2, min:5, cost:45.00, category:'Doces' },
    { id:10, name:'Morango', unit:'kg', qty:1, min:3, cost:12.00, category:'Frutas' },
    { id:11, name:'Doce de Leite', unit:'kg', qty:6, min:4, cost:18.00, category:'Doces' },
    { id:12, name:'Embalagem', unit:'un', qty:45, min:100, cost:0.80, category:'Embalagens' }
  ]);

  saveData('sabolli_purchases', [
    { id:1, date:d7, supplier:'Fornecedor ABC', items:'Farinha, Ovos, Manteiga', total:380.00, status:'Pago' },
    { id:2, date:d10, supplier:'Laticínios São Paulo', items:'Leite, Mussarela, Catupiry', total:520.00, status:'Pago' },
    { id:3, date:d15, supplier:'Frigorífico Santos', items:'Frango, Acém', total:445.00, status:'Pago' },
    { id:4, date:d20, supplier:'Doces e Cia', items:'Nutella, Doce de Leite, Morango', total:310.00, status:'Pago' }
  ]);

  saveData('sabolli_financial_transactions', [
    { id:1, date:t, desc:'Vendas do dia', type:'entrada', value:107.70, category:'Vendas' },
    { id:2, date:d1, desc:'Vendas do dia', type:'entrada', value:169.40, category:'Vendas' },
    { id:3, date:d2, desc:'Vendas do dia', type:'entrada', value:33.80, category:'Vendas' },
    { id:4, date:d3, desc:'Vendas do dia', type:'entrada', value:106.50, category:'Vendas' },
    { id:5, date:d7, desc:'Compra insumos — Fornecedor ABC', type:'saída', value:380.00, category:'Compras' },
    { id:6, date:d10, desc:'Compra laticínios — Laticínios SP', type:'saída', value:520.00, category:'Compras' },
    { id:7, date:d15, desc:'Aluguel do ponto', type:'saída', value:1500.00, category:'Aluguel' },
    { id:8, date:d15, desc:'Vendas do dia', type:'entrada', value:206.30, category:'Vendas' },
    { id:9, date:d20, desc:'Energia elétrica', type:'saída', value:220.00, category:'Contas' }
  ]);

  saveData('sabolli_goals', [
    { id:1, name:'Faturamento Mensal', current:0, target:8000.00, type:'business', color:'#10B981' },
    { id:2, name:'Lucro Bruto', current:0, target:4500.00, type:'business', color:'#7C3AED' },
    { id:3, name:'Reserva de Emergência', current:2250.00, target:5000.00, type:'personal', color:'#2563EB' }
  ]);

  saveData('sabolli_accounts', [
    { id:1, name:'Conta Corrente', bank:'Banco do Brasil', type:'conta', balance:3200.00, color:'#1E3A8A' },
    { id:2, name:'Poupança', bank:'Caixa Econômica', type:'poupança', balance:1620.75, color:'#1a6b3c' },
    { id:3, name:'Nubank', bank:'Nubank', type:'cartão', balance:-850.40, color:'#6B21A8' }
  ]);

  saveData('sabolli_stock_moves', []);
  saveData('sabolli_settings', { delivery_fee:6.00, company_name:'Sabolli', delivery_area:'Santo André e região' });
  saveData('sabolli_seeded', '1');
}

// ===== CONFIRM MODAL =====
function customConfirm(msg, onConfirm) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';
  overlay.innerHTML = `<div style="background:#fff;border-radius:18px;padding:26px 22px;max-width:320px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
    <div style="font-size:15px;font-weight:700;color:#1E293B;margin-bottom:20px;line-height:1.4">${msg}</div>
    <div style="display:flex;gap:10px">
      <button id="cc-cancel" style="flex:1;padding:12px;border-radius:12px;border:1.5px solid #E2E8F0;background:#fff;font-size:14px;font-weight:600;cursor:pointer;color:#64748B">Cancelar</button>
      <button id="cc-ok" style="flex:1;padding:12px;border-radius:12px;border:none;background:#EF4444;color:#fff;font-size:14px;font-weight:700;cursor:pointer">Confirmar</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#cc-cancel').onclick = () => overlay.remove();
  overlay.querySelector('#cc-ok').onclick = () => { overlay.remove(); onConfirm(); };
}

// ===== TOAST =====
function toast(msg, type) {
  const color = type==='error'?'#EF4444':type==='warning'?'#F59E0B':'#10B981';
  const el = document.createElement('div');
  el.style.cssText = `background:${color};color:#fff;padding:12px 18px;border-radius:12px;font-size:14px;font-weight:600;box-shadow:0 4px 16px rgba(0,0,0,0.25);pointer-events:auto;max-width:320px;`;
  el.textContent = msg;
  const c = document.getElementById('toast-container');
  c.appendChild(el);
  setTimeout(() => { el.style.opacity='0'; el.style.transition='opacity .4s'; setTimeout(()=>el.remove(),400); }, 2500);
}

// ===== BALÃO DE SALDO =====
function getSaldoData() {
  const accounts = loadData('sabolli_accounts')||[];
  const cardExpenses = loadData('sabolli_card_expenses')||[];
  const today = todayStr();
  const moneyAccounts = accounts.filter(a=>a.type!=='cartão');
  const cards = accounts.filter(a=>a.type==='cartão');
  const totalMoney = moneyAccounts.reduce((s,a)=>s+(a.balance||0),0);
  const totalLimit = cards.reduce((s,a)=>s+(a.limite||0),0);
  const monthExpenses = {};
  const cardRefMonths = {};
  cards.forEach(card=>{
    const cardCm = getCardReferenceMonth(card.id, today);
    cardRefMonths[card.id] = cardCm;
    monthExpenses[card.id] = cardExpenses.filter(e=>e.cardId===card.id&&e.referenceMonth===cardCm).reduce((s,e)=>s+(e.value||0),0);
  });
  const totalUsed = Object.values(monthExpenses).reduce((s,v)=>s+v,0);
  return {moneyAccounts,cards,totalMoney,totalLimit,totalUsed,availableCredit:totalLimit-totalUsed,monthExpenses,cardRefMonths};
}

function toggleSaldoPanel() {
  const panel = document.getElementById('saldoPanel');
  if (!panel) return;
  if (panel.classList.contains('open')) { panel.classList.remove('open'); return; }
  const d = getSaldoData();
  const usePct = d.totalLimit>0?Math.min(100,d.totalUsed/d.totalLimit*100):0;
  const barColor = usePct>80?'#EF4444':usePct>50?'#F59E0B':'#10B981';
  const typeIcon = {conta:'🏦',poupança:'💰',dinheiro:'💵'};
  const moneyHtml = d.moneyAccounts.length>0
    ? d.moneyAccounts.map(a=>`<div class="saldo-item">
        <div class="saldo-item-icon" style="background:${(a.color||'#1E3A8A')}22">${typeIcon[a.type]||'🏦'}</div>
        <div class="saldo-item-info"><div class="saldo-item-name">${a.name}</div><div class="saldo-item-sub">${a.bank||a.type}</div></div>
        <div class="saldo-item-value" style="color:#2563EB">${fmt(a.balance||0)}</div>
      </div>`).join('')
    : '<div style="font-size:12px;color:var(--text-sec);padding:6px 0">Nenhuma conta cadastrada</div>';
  const cardsHtml = d.cards.map(card=>{
    const brand = CARD_BRANDS[card.cardBrand]||CARD_BRANDS.outro;
    const used = d.monthExpenses[card.id]||0;
    const avail = (card.limite||0)-used;
    const pct = card.limite>0?Math.min(100,used/card.limite*100):0;
    const bc = pct>80?'#EF4444':pct>50?'#F59E0B':'#10B981';
    const cardCmLabel = d.cardRefMonths&&d.cardRefMonths[card.id] ? fmtMonth(d.cardRefMonths[card.id]) : '';
    return `<div class="saldo-item" style="flex-direction:column;align-items:stretch;gap:5px">
      <div style="display:flex;align-items:center;gap:10px">
        <div class="saldo-item-icon" style="background:${brand.bg}22">${brand.logo}</div>
        <div class="saldo-item-info">
          <div class="saldo-item-name">${card.name}</div>
          <div class="saldo-item-sub">Fatura ${cardCmLabel}: ${fmt(used)} · Disp: ${fmt(avail)}</div>
        </div>
      </div>
      <div class="credit-bar-wrap" style="padding-left:44px"><div class="credit-bar"><div class="credit-bar-fill" style="width:${pct}%;background:${bc}"></div></div></div>
    </div>`;
  }).join('');
  panel.innerHTML = `
    <div class="saldo-panel-header">
      <div class="saldo-panel-title">Dinheiro disponível</div>
      <div class="saldo-panel-total">${fmt(d.totalMoney)}</div>
      <div class="saldo-panel-sub">em contas e dinheiro em espécie</div>
    </div>
    <div class="saldo-panel-body">
      <div class="saldo-section">
        <div class="saldo-section-title">💵 Contas e Dinheiro</div>
        ${moneyHtml}
      </div>
      ${d.cards.length>0?`<div class="saldo-section">
        <div class="saldo-section-title">💳 Crédito — Fatura Atual</div>
        ${cardsHtml}
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#F0FDF4;border-radius:10px;margin-top:8px">
          <span style="font-size:12px;color:#065F46;font-weight:600">Crédito disponível</span>
          <span style="font-size:14px;font-weight:800;color:#10B981">${fmt(d.availableCredit)}</span>
        </div>
        ${d.totalLimit>0?`<div style="margin-top:6px"><div class="credit-bar" style="height:9px"><div class="credit-bar-fill" style="width:${usePct}%;background:${barColor}"></div></div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-sec);margin-top:4px"><span>Usado: ${fmt(d.totalUsed)}</span><span>Limite: ${fmt(d.totalLimit)}</span></div></div>`:''}
      </div>`:''}
      <button onclick="navigateTo('accounts');toggleSaldoPanel()" style="width:100%;margin-top:6px;padding:10px;border-radius:10px;border:1.5px solid var(--border);background:#fff;font-size:13px;font-weight:600;cursor:pointer;color:var(--blue-vivid)">Ver todas as contas →</button>
    </div>`;
  panel.classList.add('open');
}

// ===== SIDEBAR =====
function buildNavHTML(menu, activeId) {
  return menu.map(g => `
    <div class="nav-group">
      <span class="nav-group-label">${g.group}</span>
      ${g.items.map(i => `<button class="nav-item${i.id===activeId?' active':''}" onclick="navigateTo('${i.id}')"><span class="nav-icon">${i.icon}</span><span>${i.label}</span></button>`).join('')}
    </div>`).join('');
}

function renderSidebar() {
  const pEl = document.getElementById('sidebarNavPersonal');
  if (pEl) pEl.innerHTML = buildNavHTML(personalMenu, currentSection);
  const bEl = document.getElementById('sidebarNavBusiness');
  if (bEl) bEl.innerHTML = buildNavHTML(businessMenu, currentSection);
}

// ===== HEADER =====
const pageTitles = {
  dashboard:'Dashboard','new-order':'Novo Pedido','orders-list':'Lista de Pedidos','daily-sales':'Vendas Diárias',
  customers:'Clientes',resellers:'Pontos de Revenda',products:'Produtos','stock-mgmt':'Estoque',
  'stock-moves':'Movimentação de Estoque','new-purchase':'Nova Compra',purchases:'Histórico de Compras',
  inputs:'Insumos',transactions:'Lançamentos Financeiros',extract:'Extrato',accounts:'Contas e Cartões',
  cmv:'CMV',ticket:'Ticket Médio',goals:'Metas',categories:'Categorias',delivery:'Taxa de Entrega',
  company:'Dados da Empresa',suppliers:'Fornecedores',planning:'Planejamento Financeiro',
  'ficha-tecnica':'Ficha Técnica', temas:'Temas do App'
};

function updateHeader() {
  const el = document.getElementById('topbarTitle');
  if (el) el.textContent = pageTitles[currentSection] || 'Dashboard';
  const pf = document.getElementById('periodFilters');
  if (pf) pf.style.display = currentSection==='dashboard'?'flex':'none';
}

// ===== NAVEGAÇÃO =====
function navigateTo(section) {
  currentSection = section;
  window._currentSection = section;
  renderSidebar();
  updateHeader();
  const content = document.getElementById('content');
  renderPage(content, section);
  closeAllSidebars();
  content.scrollTop = 0;
}

function renderPage(c, s) {
  if (s==='dashboard') return renderDashboard(c);
  if (s==='new-order') return renderNewOrder(c);
  if (s==='orders-list') return renderOrdersList(c);
  if (s==='daily-sales') return renderDailySales(c);
  if (s==='customers') return renderCustomers(c);
  if (s==='products') return renderProducts(c);
  if (s==='stock-mgmt') return renderStockMgmt(c);
  if (s==='stock-moves') return renderStockMoves(c);
  if (s==='new-purchase') return renderNewPurchase(c);
  if (s==='purchases') return renderPurchases(c);
  if (s==='inputs') return renderInputs(c);
  if (s==='transactions') return renderTransactions(c);
  if (s==='extract') return renderExtract(c);
  if (s==='accounts') return renderAccounts(c);
  if (s==='cmv') return renderCmv(c);
  if (s==='ticket') return renderTicket(c);
  if (s==='goals') return renderGoals(c);
  if (s==='categories') return renderCategories(c);
  if (s==='temas') return renderTemas(c);
  if (s==='delivery') return renderDelivery(c);
  if (s==='company') return renderCompany(c);
  if (s==='resellers') return renderResellers(c);
  if (s==='suppliers') return renderSuppliers(c);
  if (s==='planning') return renderPlanning(c);
  if (s==='ficha-tecnica') return renderFichaTecnica(c);
  c.innerHTML = '<div style="padding:40px;text-align:center;color:#94A3B8">Em desenvolvimento...</div>';
}

// ===== SIDEBAR CONTROLS =====
function closeAllSidebars() {
  document.getElementById('sidebar-personal').classList.remove('open');
  document.getElementById('sidebar-business').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}
function togglePersonalSidebar() {
  const isOpen = document.getElementById('sidebar-personal').classList.contains('open');
  closeAllSidebars();
  if (!isOpen) {
    document.getElementById('sidebar-personal').classList.add('open');
    document.getElementById('sidebarOverlay').classList.add('open');
  }
}
function toggleBusinessSidebar() {
  const isOpen = document.getElementById('sidebar-business').classList.contains('open');
  closeAllSidebars();
  if (!isOpen) {
    document.getElementById('sidebar-business').classList.add('open');
    document.getElementById('sidebarOverlay').classList.add('open');
  }
}
function toggleSidebar() { togglePersonalSidebar(); }
function closeSidebar() { closeAllSidebars(); }

// ===== PERÍODO =====
function setPeriod(p) {
  currentPeriod = p;
  document.querySelectorAll('.pf-btn').forEach((b,i) => b.classList.toggle('active', ['today','week','month','year'][i]===p));
  renderPage(document.getElementById('content'), currentSection);
}

// ===== DASHBOARD =====
function renderDashboard(c) {
  const tabsHtml = `<div class="tabs-row">
    ${[['personal','1','Gestão Pessoal','Finanças pessoais'],['business','2','Negócios','Vendas e financeiro'],['stock','3','Estoque','Controle de insumos']].map(([id,n,t,s])=>`
    <div class="tab-card${currentTab===id?' active':''}" onclick="switchTab('${id}')">
      <div class="tab-num">${n}</div><div class="tab-text"><span class="tab-title">${t}</span><span class="tab-sub">${s}</span></div>
    </div>`).join('')}
  </div>`;
  let body = '';
  if (currentTab==='business') body = renderBusinessDash();
  else if (currentTab==='personal') body = renderPersonalDash();
  else body = renderStockDash();
  c.innerHTML = tabsHtml + `<div id="dash-body">${body}</div>`;
}

function switchTab(t) { currentTab=t; renderPage(document.getElementById('content'),'dashboard'); }

function renderBusinessDash() {
  const orders = loadData('sabolli_orders')||[];
  const txs = loadData('sabolli_financial_transactions')||[];
  const filtered = filterByPeriod(orders,'date');
  const filteredTxs = filterByPeriod(txs,'date');

  const fatBruto = filtered.reduce((s,o)=>s+(o.total||0),0);
  const totalPedidos = filtered.length;
  const ticketMedio = totalPedidos>0 ? fatBruto/totalPedidos : 0;
  const aReceberPedidos = filtered.filter(o=>o.status==='Pendente').reduce((s,o)=>s+(o.total||0),0);
  const aReceberTxs = filteredTxs.filter(t=>t.status==='a_receber').reduce((s,t)=>s+(t.value||0),0);
  const aReceber = aReceberPedidos + aReceberTxs;
  const aPagar = filteredTxs.filter(t=>t.status==='a_pagar').reduce((s,t)=>s+(t.value||0),0);
  const entradas = filteredTxs.filter(t=>t.type==='entrada'&&(!t.status||t.status==='realizado')).reduce((s,t)=>s+(t.value||0),0);
  const saidas = filteredTxs.filter(t=>t.type==='saída'&&(!t.status||t.status==='realizado')).reduce((s,t)=>s+(t.value||0),0);
  const cmv = fatBruto*0.438;
  const lucroBruto = fatBruto - cmv;

  // Canal breakdown
  const byCanalMap = {};
  filtered.forEach(o=>{ byCanalMap[o.canal]=(byCanalMap[o.canal]||0)+(o.total||0); });
  const totalCanal = Object.values(byCanalMap).reduce((a,b)=>a+b,0)||1;
  const canalColors = {'Loja Física':'#00D4FF','Delivery':'#FF6B00','Revenda':'#BF00FF','WhatsApp':'#00FF9F','Outros':'#A0AEC0'};
  const canalSegs = Object.entries(byCanalMap).map(([k,v])=>({label:k,pct:Math.round(v/totalCanal*100),color:canalColors[k]||'#94A3B8'}));

  // Últimos pedidos
  const recentes = [...orders].sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id).slice(0,5);

  // Stock alerts
  const stock = loadData('sabolli_stock')||[];
  const alertCount = stock.filter(s=>s.qty<s.min).length;

  return `
  <div class="kpi-row">
    ${kpiCard('Faturamento',fmt(fatBruto),'💲','#EFF6FF','#2563EB',`${totalPedidos} pedidos`)}
    ${kpiCard('Ticket Médio',fmt(ticketMedio),'🎫','#FFF7ED','#F97316',`${totalPedidos} pedidos`)}
    ${kpiCard('A Receber',fmt(aReceber),'⏳','#FFFBEB','#B45309','Pendente')}
    ${kpiCard('A Pagar',fmt(aPagar),'⚠️','#FEF2F2','#EF4444','Futuras saídas')}
  </div>
  <div class="sec-indicators">
    <div class="sec-block"><div class="sec-label">Lucro Bruto Est.</div><div class="sec-value" style="color:#10B981">${fmt(lucroBruto)}</div><div class="sec-sub">56,2% do faturamento</div></div>
    <div class="sec-block"><div class="sec-label">Entradas</div><div class="sec-value" style="color:#2563EB">${fmt(entradas)}</div><div class="sec-sub">Realizadas</div></div>
    <div class="sec-block"><div class="sec-label">Saídas</div><div class="sec-value" style="color:#EF4444">${fmt(saidas)}</div><div class="sec-sub">Realizadas</div></div>
    <div class="sec-block"><div class="sec-label">Estoque Alerta</div><div class="sec-value" style="color:#F97316">${alertCount} itens</div><div class="sec-sub">Abaixo do mínimo</div></div>
  </div>
  <div class="charts-row">
    <div class="card">
      <div class="card-header"><div><div class="card-title">Últimos Pedidos</div></div><button class="card-link" onclick="navigateTo('orders-list')">Ver todos →</button></div>
      <div style="overflow-x:auto">
        <table class="mini-table"><thead><tr><th>Pedido</th><th>Cliente</th><th>Canal</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>${recentes.map(o=>`<tr>
          <td><strong>#${o.id}</strong></td><td>${o.customer}</td><td>${o.canal}</td>
          <td>${fmt(o.total)}</td>
          <td><span class="status-badge status-${(o.status||'').toLowerCase()}">${o.status}</span></td>
        </tr>`).join('')}</tbody></table>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div><div class="card-title">Vendas por Canal</div><div class="card-sub">% do faturamento</div></div></div>
      ${canalSegs.length>0 ? renderDonutChart(canalSegs) : '<div style="padding:20px;text-align:center;color:#94A3B8">Sem dados no período</div>'}
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Ações Rápidas</div></div>
      <div class="action-btns">
        <button class="action-btn blue" onclick="navigateTo('new-order')"><span class="action-icon">🛒</span> Novo Pedido</button>
        <button class="action-btn green" onclick="navigateTo('new-purchase')"><span class="action-icon">🛍️</span> Nova Compra</button>
        <button class="action-btn purple" onclick="navigateTo('customers')"><span class="action-icon">👤</span> Clientes</button>
        <button class="action-btn orange" onclick="navigateTo('transactions')"><span class="action-icon">💰</span> Lançamento</button>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Resumo Financeiro</div></div>
      <div class="fin-label">Total Recebido</div><div class="fin-value green">${fmt(entradas)}</div>
      <div class="fin-label">⏳ A Receber</div><div class="fin-value yellow">${fmt(aReceber)}</div>
      <div class="fin-label">Total de Saídas</div><div class="fin-value red">${fmt(saidas)}</div>
      <div class="fin-label">⚠️ A Pagar</div><div class="fin-value red">${fmt(aPagar)}</div>
    </div>
  </div>`;
}

function renderPersonalDash() {
  if (!currentPersonalMonth) currentPersonalMonth = currentMonthStr();
  const txs = loadData('sabolli_financial_transactions')||[];
  const monthTxs = txs.filter(t=>t.date&&t.date.startsWith(currentPersonalMonth));
  const ent = monthTxs.filter(t=>t.type==='entrada'&&(!t.status||t.status==='realizado')).reduce((s,t)=>s+(t.value||0),0);
  const sai = monthTxs.filter(t=>t.type==='saída'&&(!t.status||t.status==='realizado')).reduce((s,t)=>s+(t.value||0),0);
  const persAReceber = monthTxs.filter(t=>t.status==='a_receber').reduce((s,t)=>s+(t.value||0),0);
  const persAPagar = monthTxs.filter(t=>t.status==='a_pagar').reduce((s,t)=>s+(t.value||0),0);
  const saldo = ent-sai;
  const accs = loadData('sabolli_accounts')||[];
  const totalAcc = accs.filter(a=>a.type!=='cartão').reduce((s,a)=>s+(a.balance||0),0);

  // Gastos por categoria
  const catSpend = {};
  monthTxs.filter(t=>t.type==='saída').forEach(t=>{
    const cat = t.category||'Outros';
    catSpend[cat] = (catSpend[cat]||0)+(t.value||0);
  });
  const totalSai2 = Object.values(catSpend).reduce((a,b)=>a+b,0)||1;
  const catColors = ['#FF073A','#FF6B00','#FFD700','#00FF9F','#00D4FF','#BF00FF','#FF10F0','#00FFFF'];
  const catSegs = Object.entries(catSpend).sort((a,b)=>b[1]-a[1]).map(([k,v],i)=>({
    label:`${k}`, pct:Math.round(v/totalSai2*100), color:catColors[i%catColors.length]
  }));

  return `
  <div style="display:flex;align-items:center;justify-content:space-between;background:#fff;border-radius:12px;border:1px solid var(--border);padding:10px 18px;margin-bottom:14px;gap:10px">
    <button onclick="setPersonalMonth(-1)" class="month-nav-btn">‹</button>
    <div style="font-size:15px;font-weight:700;color:var(--blue-vivid)">${fmtMonth(currentPersonalMonth)}</div>
    <button onclick="setPersonalMonth(1)" class="month-nav-btn">›</button>
  </div>
  <div class="kpi-row">
    ${kpiCard('Saldo em Contas',fmt(totalAcc),'💳','#EFF6FF','#2563EB','Contas e dinheiro')}
    ${kpiCard('Entradas',fmt(ent),'📈','#F0FDF4','#10B981','Realizadas')}
    ${kpiCard('Saídas',fmt(sai),'📉','#FEF2F2','#EF4444','Realizadas')}
    ${kpiCard('Resultado',fmt(saldo),saldo>=0?'📊':'⚠️','#F5F3FF','#7C3AED','Entradas − Saídas')}
  </div>
  ${(persAReceber>0||persAPagar>0)?`<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
    <div style="background:#FFFBEB;border:1.5px solid #FDE68A;border-radius:12px;padding:12px 16px">
      <div style="font-size:11px;font-weight:700;color:#92400E;margin-bottom:2px">⏳ A Receber</div>
      <div style="font-size:20px;font-weight:800;color:#B45309">${fmt(persAReceber)}</div>
      <div style="font-size:11px;color:#92400E">${fmtMonth(currentPersonalMonth)}</div>
    </div>
    <div style="background:#FEF2F2;border:1.5px solid #FECACA;border-radius:12px;padding:12px 16px">
      <div style="font-size:11px;font-weight:700;color:#991B1B;margin-bottom:2px">⚠️ A Pagar</div>
      <div style="font-size:20px;font-weight:800;color:#DC2626">${fmt(persAPagar)}</div>
      <div style="font-size:11px;color:#991B1B">${fmtMonth(currentPersonalMonth)}</div>
    </div>
  </div>`:''}
  <div class="charts-row">
    <div class="card">
      <div class="card-header"><div class="card-title">Contas e Cartões</div><button class="card-link" onclick="navigateTo('accounts')">Ver todas →</button></div>
      ${accs.length>0?accs.map(a=>`<div class="account-item">
        <div class="account-icon" style="background:${(a.color||'#1E3A8A')}22">${a.type==='cartão'?'💳':a.type==='poupança'?'💰':'🏦'}</div>
        <div class="account-info"><div class="account-name">${a.name}</div><div class="account-type">${a.bank||a.type}</div></div>
        <div class="account-value ${(a.balance||0)>=0?'positive':'negative'}">${fmt(Math.abs(a.balance||0))}${(a.balance||0)<0?' (débito)':''}</div>
      </div>`).join('') : '<div class="empty-state"><div class="empty-icon">💳</div><p>Nenhuma conta</p></div>'}
    </div>
    <div class="card">
      <div class="card-header"><div><div class="card-title">Gastos por Categoria</div><div class="card-sub">${fmtMonth(currentPersonalMonth)}</div></div></div>
      ${catSegs.length>0 ? renderDonutChart(catSegs) : '<div style="padding:20px;text-align:center;color:#94A3B8;font-size:13px">Sem gastos neste mês</div>'}
    </div>
    <div class="card" style="grid-column:span 2">
      <div class="card-header"><div class="card-title">Transações de ${fmtMonth(currentPersonalMonth)}</div><button class="card-link" onclick="navigateTo('extract')">Ver extrato →</button></div>
      ${monthTxs.length>0?[...monthTxs].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,8).map(t=>`
        <div class="tx-item">
          <div class="tx-ico-wrap" style="background:${t.type==='entrada'?'#F0FDF4':'#FEF2F2'}">${t.type==='entrada'?'📈':'📤'}</div>
          <div class="tx-info" style="flex:1"><div class="tx-desc">${t.desc}</div><div class="tx-date">${fmtDate(t.date)} · ${t.category||''}</div></div>
          <div class="tx-amount ${t.type==='entrada'?'inc':'exp'}">${t.type==='entrada'?'+':'-'}${fmt(t.value)}</div>
        </div>`).join('') : '<div class="empty-state"><div class="empty-icon">💰</div><p>Sem transações neste mês</p></div>'}
    </div>
  </div>`;
}

function setPersonalMonth(dir) {
  if (!currentPersonalMonth) currentPersonalMonth = currentMonthStr();
  currentPersonalMonth = addMonths(currentPersonalMonth, dir);
  renderPage(document.getElementById('content'), 'dashboard');
}

function renderStockDash() {
  const stock = loadData('sabolli_stock')||[];
  const alerts = stock.filter(s=>s.qty<s.min);
  const totalVal = stock.reduce((s,i)=>s+(i.qty*i.cost),0);
  return `
  <div class="kpi-row">
    ${kpiCard('Itens Cadastrados',stock.length.toString(),'🧂','#EFF6FF','#2563EB','Insumos')}
    ${kpiCard('Em Alerta',alerts.length.toString(),'⚠️','#FEF2F2','#EF4444','Abaixo do mínimo')}
    ${kpiCard('Valor em Estoque',fmt(totalVal),'💰','#FFF7ED','#F97316','Custo total')}
  </div>
  <div class="charts-row">
    <div class="card">
      <div class="card-header"><div class="card-title">⚠️ Produtos em Alerta</div><button class="card-link" onclick="navigateTo('stock-mgmt')">Ver estoque →</button></div>
      ${alerts.length>0?alerts.map(s=>`<div class="alert-item"><div><div class="alert-name">${s.name}</div><div class="alert-stock">Atual: ${s.qty} ${s.unit} | Mín: ${s.min} ${s.unit}</div></div><span class="alert-badge">⚠ Alerta</span></div>`).join(''):'<div class="empty-state"><div class="empty-icon">✅</div><p>Todos os itens em níveis adequados</p></div>'}
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Todos os Insumos</div><button class="card-link" onclick="navigateTo('stock-mgmt')">Gerenciar →</button></div>
      <div style="overflow-x:auto"><table class="mini-table">
        <thead><tr><th>Insumo</th><th>Qtd.</th><th>Mín.</th><th>Status</th></tr></thead>
        <tbody>${stock.slice(0,8).map(s=>`<tr>
          <td>${s.name}</td><td><strong>${s.qty} ${s.unit}</strong></td><td>${s.min} ${s.unit}</td>
          <td><span class="status-badge ${s.qty<s.min?'status-pendente':'status-pago'}">${s.qty<s.min?'⚠ Alerta':'OK'}</span></td>
        </tr>`).join('')}</tbody>
      </table></div>
    </div>
  </div>`;
}

// ===== COMPONENTES =====
function kpiCard(label, value, icon, bg, color, sub) {
  return `<div class="kpi-card">
    <div class="kpi-top"><div class="kpi-label">${label}</div><div class="kpi-icon" style="background:${bg};color:${color}">${icon}</div></div>
    <div class="kpi-value">${value}</div>
    <div class="kpi-bottom"><span class="kpi-sub">${sub}</span></div>
  </div>`;
}

function renderDonutChart(segs) {
  const size=110, r=40, cx=55, cy=55, circ=2*Math.PI*r;
  let off=0;
  const defs = `<defs>
    <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;
  const paths = segs.map(s=>{
    const dash=(s.pct/100)*circ, gap=circ-dash;
    const p=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="16" stroke-linecap="round" stroke-dasharray="${dash} ${gap}" stroke-dashoffset="${-off}" transform="rotate(-90 ${cx} ${cy})" filter="url(#neonGlow)"/>`;
    off+=dash; return p;
  }).join('');
  const legend = segs.map(s=>`<div class="legend-item"><div class="legend-dot" style="background:${s.color};box-shadow:0 0 6px ${s.color}"></div><span class="legend-name">${s.label}</span><span class="legend-pct">${s.pct}%</span></div>`).join('');
  return `<div class="donut-wrap"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${defs}${paths}</svg><div class="donut-legend">${legend}</div></div>`;
}

// ===== NOVO PEDIDO =====
function renderNewOrder(c) {
  orderCart = [];
  const products = loadData('sabolli_products')||[];
  const settings = loadData('sabolli_settings')||{delivery_fee:6};
  c.innerHTML = `
  <div class="form-page">
    <div class="section-card">
      <div class="section-title">🍽️ Selecionar Produtos</div>
      <div class="product-grid">
        ${products.map(p=>`<div class="prod-sel-card" onclick="cartAdd(${p.id})">
          <div><div class="prod-sel-name">${p.name}</div><div class="prod-sel-price">${fmt(p.price)}</div></div>
          <button class="prod-add-btn" onclick="event.stopPropagation();cartAdd(${p.id})">+</button>
        </div>`).join('')}
      </div>
    </div>
    <div class="section-card" id="cart-box">
      <div class="section-title">🛒 Carrinho</div>
      <div id="cart-items"><div class="empty-state"><div class="empty-icon">🛒</div><p>Nenhum item adicionado</p></div></div>
      <div class="cart-total-row" id="cart-total-row" style="display:none">
        <span class="cart-total-label">Total do Pedido</span>
        <span class="cart-total-value" id="cart-total-val">R$ 0,00</span>
      </div>
    </div>
    <div class="section-card">
      <div class="section-title">📋 Detalhes do Pedido</div>
      <div class="form-group"><label class="form-label">Cliente</label><input id="ord-customer" class="form-input" type="text" placeholder="Nome do cliente..." autocomplete="off"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Canal de Venda</label>
          <select id="ord-canal" class="form-select">
            <option>Loja Física</option><option>Delivery</option><option>Revenda</option><option>WhatsApp</option><option>Outros</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Pagamento</label>
          <select id="ord-payment" class="form-select">
            <option>PIX</option><option>Dinheiro</option><option>Cartão</option><option>Fiado</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Data</label><input id="ord-date" class="form-input" type="date" value="${todayStr()}"></div>
        <div class="form-group"><label class="form-label">Frete</label>
          <select id="ord-delivery" class="form-select">
            <option value="0">Sem frete</option>
            <option value="${settings.delivery_fee||6}">Cobrar ${fmt(settings.delivery_fee||6)}</option>
          </select>
        </div>
      </div>
      <div class="form-group"><label class="form-label">Observações</label><textarea id="ord-obs" class="form-textarea" rows="2" placeholder="Observações do pedido..."></textarea></div>
      <button class="btn-primary" onclick="saveOrder()">💾 Salvar Pedido</button>
    </div>
  </div>`;
}

function cartAdd(productId) {
  const products = loadData('sabolli_products')||[];
  const p = products.find(x=>x.id===productId);
  if (!p) return;
  const ex = orderCart.find(x=>x.id===productId);
  if (ex) ex.qty++;
  else orderCart.push({...p, qty:1});
  renderCart();
}

function cartRemove(productId) {
  const idx = orderCart.findIndex(x=>x.id===productId);
  if (idx<0) return;
  if (orderCart[idx].qty>1) orderCart[idx].qty--;
  else orderCart.splice(idx,1);
  renderCart();
}

function renderCart() {
  const box = document.getElementById('cart-items');
  const totalRow = document.getElementById('cart-total-row');
  const totalVal = document.getElementById('cart-total-val');
  if (!box) return;
  if (orderCart.length===0) {
    box.innerHTML='<div class="empty-state"><div class="empty-icon">🛒</div><p>Nenhum item adicionado</p></div>';
    if(totalRow) totalRow.style.display='none';
    return;
  }
  const total = orderCart.reduce((s,i)=>s+(i.price*i.qty),0);
  box.innerHTML = orderCart.map(i=>`<div class="cart-row">
    <div><div class="cart-item-name">${i.name}</div><div class="cart-item-price">${fmt(i.price)} × ${i.qty} = ${fmt(i.price*i.qty)}</div></div>
    <div class="qty-ctrl">
      <button class="qty-btn" onclick="cartRemove(${i.id})">−</button>
      <span class="qty-num">${i.qty}</span>
      <button class="qty-btn" onclick="cartAdd(${i.id})">+</button>
    </div>
  </div>`).join('');
  if(totalRow) { totalRow.style.display='flex'; totalVal.textContent=fmt(total); }
}

function saveOrder() {
  if (orderCart.length===0) { toast('Adicione ao menos 1 produto','error'); return; }
  const customer = (document.getElementById('ord-customer').value.trim())||'Cliente Avulso';
  const canal = document.getElementById('ord-canal').value;
  const payment = document.getElementById('ord-payment').value;
  const date = document.getElementById('ord-date').value||todayStr();
  const delivery = Number(document.getElementById('ord-delivery').value)||0;
  const obs = document.getElementById('ord-obs').value;
  const subtotal = orderCart.reduce((s,i)=>s+(i.price*i.qty),0);
  const total = subtotal+delivery;
  const orders = loadData('sabolli_orders')||[];
  const lastId = orders.length>0 ? Math.max(...orders.map(o=>Number(o.id)||0)) : 1248;
  const newOrder = {
    id: lastId+1,
    date, customer,
    items: orderCart.map(i=>({id:i.id,name:i.name,price:i.price,qty:i.qty})),
    canal, payment,
    status: payment==='Fiado'?'Pendente':'Pago',
    total, delivery, obs
  };
  orders.unshift(newOrder);
  saveData('sabolli_orders', orders);
  // Auto financial entry for paid orders
  if (newOrder.status==='Pago') {
    const txs = loadData('sabolli_financial_transactions')||[];
    txs.unshift({ id:nextId(txs), date, desc:`Venda #${newOrder.id} — ${customer}`, type:'entrada', value:total, category:'Vendas' });
    saveData('sabolli_financial_transactions', txs);
  }
  orderCart = [];
  toast('Pedido #'+newOrder.id+' salvo!');
  navigateTo('orders-list');
}

// ===== LISTA DE PEDIDOS =====
function renderOrdersList(c) {
  const orders = loadData('sabolli_orders')||[];
  const sorted = [...orders].sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id);
  c.innerHTML = `
  <div class="section-card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px">
      <div class="section-title" style="margin:0">📋 ${orders.length} pedidos</div>
      <button class="btn-outline" onclick="navigateTo('new-order')">+ Novo Pedido</button>
    </div>
    <div class="filter-bar">
      <input class="filter-input" id="ord-search" type="text" placeholder="Buscar cliente..." oninput="filterOrders()">
      <select class="filter-select" id="ord-status-filter" onchange="filterOrders()">
        <option value="">Todos</option><option value="Pago">Pago</option><option value="Pendente">Pendente</option><option value="Cancelado">Cancelado</option>
      </select>
    </div>
    <div style="overflow-x:auto">
      <table class="mini-table" id="orders-table">
        <thead><tr><th>#</th><th>Data</th><th>Cliente</th><th>Canal</th><th>Pagamento</th><th>Total</th><th>Status</th><th></th></tr></thead>
        <tbody id="orders-body">
          ${sorted.map(o=>orderRow(o)).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function orderRow(o) {
  const items = Array.isArray(o.items) ? o.items.map(i=>typeof i==='string'?i:`${i.name}${i.qty>1?' ×'+i.qty:''}`).join(', ') : '';
  return `<tr id="orow-${o.id}">
    <td><strong>#${o.id}</strong></td>
    <td>${fmtDate(o.date)}</td>
    <td>${o.customer}<br><small style="color:#94A3B8;font-size:11px">${items.substring(0,40)}${items.length>40?'...':''}</small></td>
    <td>${o.canal}</td>
    <td>${o.payment}</td>
    <td>${fmt(o.total)}</td>
    <td><span class="status-badge status-${(o.status||'').toLowerCase()}">${o.status}</span></td>
    <td style="white-space:nowrap">
      ${o.status==='Pendente'?`<button class="btn-success" onclick="markOrderPaid(${o.id})" style="margin-right:4px">✓ Pago</button>`:''}
      <button class="btn-danger" onclick="deleteOrder(${o.id})">🗑</button>
    </td>
  </tr>`;
}

function filterOrders() {
  const q = (document.getElementById('ord-search').value||'').toLowerCase();
  const st = document.getElementById('ord-status-filter').value;
  const orders = loadData('sabolli_orders')||[];
  const filtered = orders.filter(o=>
    (!q||o.customer.toLowerCase().includes(q)) &&
    (!st||o.status===st)
  ).sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id);
  const body = document.getElementById('orders-body');
  if (body) body.innerHTML = filtered.map(o=>orderRow(o)).join('');
}

function markOrderPaid(id) {
  const orders = loadData('sabolli_orders')||[];
  const o = orders.find(x=>Number(x.id)===Number(id));
  if (!o) return;
  o.status = 'Pago';
  saveData('sabolli_orders', orders);
  const txs = loadData('sabolli_financial_transactions')||[];
  txs.unshift({ id:nextId(txs), date:o.date, desc:`Venda #${o.id} — ${o.customer} (recebido)`, type:'entrada', value:o.total, category:'Vendas' });
  saveData('sabolli_financial_transactions', txs);
  toast('Pedido #'+id+' marcado como Pago!');
  navigateTo('orders-list');
}

function deleteOrder(id) {
  customConfirm('Excluir pedido #'+id+'?', () => {
    const orders = (loadData('sabolli_orders')||[]).filter(o=>Number(o.id)!==Number(id));
    saveData('sabolli_orders', orders);
    toast('Pedido excluído');
    navigateTo('orders-list');
  });
}

// ===== VENDAS DIÁRIAS =====
function renderDailySales(c) {
  const orders = loadData('sabolli_orders')||[];
  const byDay = {};
  orders.forEach(o=>{ if(!byDay[o.date])byDay[o.date]=[]; byDay[o.date].push(o); });
  const days = Object.keys(byDay).sort((a,b)=>b.localeCompare(a));
  const totalFat = orders.reduce((s,o)=>s+(o.total||0),0);
  const totalPed = orders.length;
  c.innerHTML = `
  <div class="kpi-mini-row">
    <div class="kpi-mini"><div class="kpi-mini-label">Total Geral</div><div class="kpi-mini-value">${fmt(totalFat)}</div></div>
    <div class="kpi-mini"><div class="kpi-mini-label">Pedidos</div><div class="kpi-mini-value">${totalPed}</div></div>
    <div class="kpi-mini"><div class="kpi-mini-label">Dias ativos</div><div class="kpi-mini-value">${days.length}</div></div>
  </div>
  <div class="section-card">
    <div class="section-title">📅 Vendas por Dia</div>
    ${days.map(day=>{
      const dayOrders = byDay[day];
      const dayTotal = dayOrders.reduce((s,o)=>s+(o.total||0),0);
      const dayPaid = dayOrders.filter(o=>o.status==='Pago').reduce((s,o)=>s+(o.total||0),0);
      return `<div class="day-group">
        <div class="day-header">
          <div><div class="day-date">${fmtDate(day)}</div><div style="font-size:11px;color:#94A3B8">${dayOrders.length} pedido${dayOrders.length!==1?'s':''}</div></div>
          <div style="text-align:right"><div class="day-total">${fmt(dayTotal)}</div><div style="font-size:11px;color:#10B981">Recebido: ${fmt(dayPaid)}</div></div>
        </div>
        <div style="overflow-x:auto"><table class="mini-table">
          <thead><tr><th>#</th><th>Cliente</th><th>Pagamento</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>${dayOrders.map(o=>`<tr>
            <td>#${o.id}</td><td>${o.customer}</td><td>${o.payment}</td>
            <td>${fmt(o.total)}</td>
            <td><span class="status-badge status-${(o.status||'').toLowerCase()}">${o.status}</span></td>
          </tr>`).join('')}</tbody>
        </table></div>
      </div>`;
    }).join('') || '<div class="empty-state"><div class="empty-icon">📅</div><p>Nenhuma venda registrada</p></div>'}
  </div>`;
}

// ===== CLIENTES =====
function renderCustomers(c) {
  const customers = loadData('sabolli_customers')||[];
  c.innerHTML = `
  <div class="section-card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px">
      <div class="section-title" style="margin:0">👥 ${customers.length} clientes</div>
      <button class="btn-outline" onclick="toggleAddCustomer()">+ Novo Cliente</button>
    </div>
    <div id="add-customer-form" style="display:none;background:#F8FAFF;border-radius:12px;padding:14px;margin-bottom:14px;border:1.5px solid #DBEAFE">
      <div class="section-title">Novo Cliente</div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Nome</label><input id="cust-name" class="form-input" type="text" placeholder="Nome completo"></div>
        <div class="form-group"><label class="form-label">Telefone</label><input id="cust-phone" class="form-input" type="tel" placeholder="(11) 99999-9999"></div>
      </div>
      <div class="form-group"><label class="form-label">Bairro</label><input id="cust-city" class="form-input" type="text" placeholder="Bairro"></div>
      <div style="display:flex;gap:8px"><button class="btn-primary" style="flex:1" onclick="saveCustomer()">Salvar</button><button class="btn-secondary" onclick="toggleAddCustomer()">Cancelar</button></div>
    </div>
    <input class="input-search" type="text" placeholder="🔍 Buscar cliente..." oninput="filterCustomers(this.value)">
    <div style="overflow-x:auto"><table class="mini-table" id="customers-table">
      <thead><tr><th>#</th><th>Nome</th><th>Telefone</th><th>Bairro</th><th>Pedidos</th><th></th></tr></thead>
      <tbody id="customers-body">${customers.map(custRow).join('')}</tbody>
    </table></div>
  </div>`;
}

function custRow(c) {
  return `<tr><td>${c.id}</td><td><strong>${c.name}</strong></td><td>${c.phone||'—'}</td><td>${c.city||'—'}</td><td>${c.orders||0}</td>
    <td><button class="btn-danger" onclick="deleteCustomer(${c.id})">🗑</button></td></tr>`;
}

function toggleAddCustomer() {
  const f = document.getElementById('add-customer-form');
  if (f) f.style.display = f.style.display==='none'?'block':'none';
}

function saveCustomer() {
  const name = (document.getElementById('cust-name').value||'').trim();
  if (!name) { toast('Informe o nome','error'); return; }
  const customers = loadData('sabolli_customers')||[];
  customers.push({ id:nextId(customers), name, phone:document.getElementById('cust-phone').value, city:document.getElementById('cust-city').value, orders:0, total:0 });
  saveData('sabolli_customers', customers);
  toast('Cliente salvo!');
  navigateTo('customers');
}

function deleteCustomer(id) {
  customConfirm('Excluir este cliente?', () => {
    saveData('sabolli_customers', (loadData('sabolli_customers')||[]).filter(c=>c.id!==id));
    toast('Cliente excluído');
    navigateTo('customers');
  });
}

function filterCustomers(q) {
  const customers = loadData('sabolli_customers')||[];
  const filtered = customers.filter(c=>c.name.toLowerCase().includes(q.toLowerCase()));
  const body = document.getElementById('customers-body');
  if (body) body.innerHTML = filtered.map(custRow).join('');
}

// ===== PRODUTOS =====
function renderProducts(c) {
  const products = loadData('sabolli_products')||[];
  c.innerHTML = `
  <div class="section-card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px">
      <div class="section-title" style="margin:0">🍽️ ${products.length} produtos</div>
      <button class="btn-outline" onclick="toggleAddProduct()">+ Novo Produto</button>
    </div>
    <div id="add-product-form" style="display:none;background:#F8FAFF;border-radius:12px;padding:14px;margin-bottom:14px;border:1.5px solid #DBEAFE">
      <div class="section-title">Novo Produto</div>
      <div class="form-group"><label class="form-label">Nome</label><input id="prod-name" class="form-input" type="text" placeholder="Ex: Crepe Especial"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Categoria</label>
          <select id="prod-cat" class="form-select"><option>Crepes Salgados</option><option>Crepes Doces</option><option>Sobremesas</option><option>Bebidas</option><option>Outros</option></select>
        </div>
        <div class="form-group"><label class="form-label">Preço de Venda (R$)</label><input id="prod-price" class="form-input" type="number" step="0.01" placeholder="0,00"></div>
      </div>
      <div class="form-group"><label class="form-label">Custo (R$)</label><input id="prod-cost" class="form-input" type="number" step="0.01" placeholder="0,00"></div>
      <div style="display:flex;gap:8px"><button class="btn-primary" style="flex:1" onclick="saveProduct()">Salvar</button><button class="btn-secondary" onclick="toggleAddProduct()">Cancelar</button></div>
    </div>
    <div style="overflow-x:auto"><table class="mini-table">
      <thead><tr><th>#</th><th>Nome</th><th>Categoria</th><th>Preço</th><th>Custo</th><th>Margem</th><th></th></tr></thead>
      <tbody>${products.map(p=>{
        const margem = p.price>0 ? ((p.price-p.cost)/p.price*100).toFixed(1) : 0;
        const fichas = loadData('sabolli_fichas')||{};
        const hasFicha = !!fichas[p.id];
        return `<tr><td>${p.id}</td><td><strong>${p.name}</strong></td><td>${p.category}</td><td>${fmt(p.price)}</td><td>${fmt(p.cost)}</td>
          <td><span style="color:${margem>40?'#10B981':'#F97316'};font-weight:700">${margem}%</span></td>
          <td style="white-space:nowrap;display:flex;gap:4px">
            <button onclick="openFicha(${p.id})" style="padding:4px 8px;border-radius:8px;border:1.5px solid ${hasFicha?'#10B981':'#DBEAFE'};background:${hasFicha?'#F0FDF4':'#EFF6FF'};color:${hasFicha?'#065F46':'#2563EB'};font-size:11px;font-weight:700;cursor:pointer" title="Ficha Técnica">📋 Ficha</button>
            <button class="btn-danger" onclick="deleteProduct(${p.id})">🗑</button>
          </td></tr>`;
      }).join('')}</tbody>
    </table></div>
  </div>`;
}

function toggleAddProduct() {
  const f = document.getElementById('add-product-form');
  if (f) f.style.display = f.style.display==='none'?'block':'none';
}

function saveProduct() {
  const name = (document.getElementById('prod-name').value||'').trim();
  if (!name) { toast('Informe o nome','error'); return; }
  const products = loadData('sabolli_products')||[];
  products.push({ id:nextId(products), name, category:document.getElementById('prod-cat').value, price:Number(document.getElementById('prod-price').value)||0, cost:Number(document.getElementById('prod-cost').value)||0 });
  saveData('sabolli_products', products);
  toast('Produto salvo!');
  navigateTo('products');
}

function deleteProduct(id) {
  customConfirm('Excluir este produto?', () => {
    saveData('sabolli_products', (loadData('sabolli_products')||[]).filter(p=>p.id!==id));
    toast('Produto excluído');
    navigateTo('products');
  });
}

function openFicha(productId) {
  window._fichaProdId = productId;
  navigateTo('ficha-tecnica');
}

// ===== ESTOQUE =====
function renderStockMgmt(c) {
  const stock = loadData('sabolli_stock')||[];
  c.innerHTML = `
  <div class="section-card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px">
      <div class="section-title" style="margin:0">📦 Gestão de Estoque</div>
      <button class="btn-outline" onclick="navigateTo('stock-moves')">+ Movimentação</button>
    </div>
    <div style="overflow-x:auto"><table class="mini-table">
      <thead><tr><th>#</th><th>Insumo</th><th>Categoria</th><th>Qtd.</th><th>Un.</th><th>Mín.</th><th>Custo/Un.</th><th>Status</th><th></th></tr></thead>
      <tbody>${stock.map(s=>`<tr>
        <td>${s.id}</td><td><strong>${s.name}</strong></td><td>${s.category}</td>
        <td style="color:${s.qty<s.min?'#EF4444':'#1E293B'};font-weight:700">${s.qty}</td>
        <td>${s.unit}</td><td>${s.min}</td><td>${fmt(s.cost)}</td>
        <td><span class="status-badge ${s.qty<s.min?'status-pendente':'status-pago'}">${s.qty<s.min?'⚠ Alerta':'OK'}</span></td>
        <td><button class="btn-danger" onclick="quickRemoveStock(${s.id},'${s.name.replace(/'/g,"\\'")}','${s.unit}')" style="padding:4px 9px;font-size:12px;white-space:nowrap">− Remover</button></td>
      </tr>`).join('')}</tbody>
    </table></div>
  </div>`;
}

function quickRemoveStock(id, name, unit) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';
  overlay.innerHTML = `<div style="background:#fff;border-radius:18px;padding:26px 22px;max-width:320px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
    <div style="font-size:15px;font-weight:700;color:#1E293B;margin-bottom:16px">Remover de: <strong>${name}</strong></div>
    <div style="margin-bottom:10px">
      <label style="font-size:12px;font-weight:600;color:#64748B;display:block;margin-bottom:4px">Quantidade (${unit})</label>
      <input id="qr-qty" type="number" step="0.01" min="0.01" placeholder="0" style="width:100%;padding:10px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:15px;font-weight:700;box-sizing:border-box">
    </div>
    <div style="margin-bottom:16px">
      <label style="font-size:12px;font-weight:600;color:#64748B;display:block;margin-bottom:4px">Motivo</label>
      <input id="qr-reason" type="text" placeholder="Ex: Uso, Perda, Vencimento..." style="width:100%;padding:10px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:14px;box-sizing:border-box">
    </div>
    <div style="display:flex;gap:10px">
      <button id="qr-cancel" style="flex:1;padding:12px;border-radius:12px;border:1.5px solid #E2E8F0;background:#fff;font-size:14px;font-weight:600;cursor:pointer;color:#64748B">Cancelar</button>
      <button id="qr-ok" style="flex:1;padding:12px;border-radius:12px;border:none;background:#EF4444;color:#fff;font-size:14px;font-weight:700;cursor:pointer">Remover</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#qr-cancel').onclick = () => overlay.remove();
  overlay.querySelector('#qr-ok').onclick = () => {
    const qty = Number(overlay.querySelector('#qr-qty').value);
    const reason = overlay.querySelector('#qr-reason').value;
    if (!qty||qty<=0) { toast('Informe a quantidade','error'); return; }
    const stock = loadData('sabolli_stock')||[];
    const item = stock.find(s=>s.id===id);
    if (!item) { overlay.remove(); return; }
    if (item.qty < qty) { toast('Estoque insuficiente ('+item.qty+' '+unit+')','error'); return; }
    item.qty = Math.round((item.qty - qty)*1000)/1000;
    saveData('sabolli_stock', stock);
    const moves = loadData('sabolli_stock_moves')||[];
    moves.unshift({ id:nextId(moves), date:todayStr(), itemId:id, itemName:name, type:'saída', qty, unit, reason:reason||'Remoção manual' });
    saveData('sabolli_stock_moves', moves);
    overlay.remove();
    toast(`${qty} ${unit} removido(s) de ${name}`);
    navigateTo('stock-mgmt');
  };
}

// ===== MOVIMENTAÇÃO DE ESTOQUE =====
function renderStockMoves(c) {
  const stock = loadData('sabolli_stock')||[];
  const moves = loadData('sabolli_stock_moves')||[];
  c.innerHTML = `
  <div class="section-card">
    <div class="section-title">🔄 Nova Movimentação</div>
    <div class="form-group"><label class="form-label">Insumo</label>
      <select id="move-item" class="form-select">${stock.map(s=>`<option value="${s.id}">${s.name} (${s.qty} ${s.unit})</option>`).join('')}</select>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Tipo</label>
        <select id="move-type" class="form-select"><option value="entrada">Entrada</option><option value="saída">Saída</option></select>
      </div>
      <div class="form-group"><label class="form-label">Quantidade</label><input id="move-qty" class="form-input" type="number" min="0.1" step="0.1" placeholder="0"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Data</label><input id="move-date" class="form-input" type="date" value="${todayStr()}"></div>
      <div class="form-group"><label class="form-label">Motivo</label><input id="move-reason" class="form-input" type="text" placeholder="Ex: Compra, Uso, Perda"></div>
    </div>
    <button class="btn-primary" onclick="saveStockMove()">💾 Salvar Movimentação</button>
  </div>
  <div class="section-card">
    <div class="section-title">Histórico de Movimentações</div>
    ${moves.length===0?'<div class="empty-state"><div class="empty-icon">🔄</div><p>Nenhuma movimentação registrada</p></div>':
    `<div style="overflow-x:auto"><table class="mini-table">
      <thead><tr><th>Data</th><th>Insumo</th><th>Tipo</th><th>Qtd.</th><th>Motivo</th></tr></thead>
      <tbody>${[...moves].sort((a,b)=>b.date.localeCompare(a.date)).map(m=>`<tr>
        <td>${fmtDate(m.date)}</td><td>${m.itemName}</td>
        <td><span class="tx-type-badge tx-type-${m.type==='entrada'?'entrada':'saida'}">${m.type==='entrada'?'↑ Entrada':'↓ Saída'}</span></td>
        <td>${m.qty} ${m.unit}</td><td>${m.reason||'—'}</td>
      </tr>`).join('')}</tbody>
    </table></div>`}
  </div>`;
}

function saveStockMove() {
  const itemId = Number(document.getElementById('move-item').value);
  const type = document.getElementById('move-type').value;
  const qty = Number(document.getElementById('move-qty').value);
  const date = document.getElementById('move-date').value||todayStr();
  const reason = document.getElementById('move-reason').value;
  if (!qty||qty<=0) { toast('Informe a quantidade','error'); return; }
  const stock = loadData('sabolli_stock')||[];
  const item = stock.find(s=>s.id===itemId);
  if (!item) return;
  if (type==='saída' && item.qty<qty) { toast('Estoque insuficiente','error'); return; }
  item.qty = type==='entrada' ? item.qty+qty : item.qty-qty;
  saveData('sabolli_stock', stock);
  const moves = loadData('sabolli_stock_moves')||[];
  moves.unshift({ id:nextId(moves), date, itemId, itemName:item.name, type, qty, unit:item.unit, reason });
  saveData('sabolli_stock_moves', moves);
  toast('Movimentação salva!');
  navigateTo('stock-moves');
}

// ===== INSUMOS =====
function renderInputs(c) {
  const stock = loadData('sabolli_stock')||[];
  c.innerHTML = `
  <div class="section-card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px">
      <div class="section-title" style="margin:0">🧂 ${stock.length} insumos</div>
      <button class="btn-outline" onclick="toggleAddInput()">+ Novo Insumo</button>
    </div>
    <div id="add-input-form" style="display:none;background:#F8FAFF;border-radius:12px;padding:14px;margin-bottom:14px;border:1.5px solid #DBEAFE">
      <div class="section-title">Novo Insumo</div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Nome</label><input id="inp-name" class="form-input" type="text" placeholder="Ex: Farinha de Trigo"></div>
        <div class="form-group"><label class="form-label">Categoria</label>
          <select id="inp-cat" class="form-select"><option>Farináceos</option><option>Laticínios</option><option>Carnes</option><option>Doces</option><option>Frutas</option><option>Embalagens</option><option>Outros</option></select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Unidade</label>
          <select id="inp-unit" class="form-select"><option>kg</option><option>L</option><option>un</option><option>g</option><option>mL</option><option>cx</option></select>
        </div>
        <div class="form-group"><label class="form-label">Custo (R$/un)</label><input id="inp-cost" class="form-input" type="number" step="0.01" placeholder="0,00"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Qtd. Inicial</label><input id="inp-qty" class="form-input" type="number" step="0.1" placeholder="0"></div>
        <div class="form-group"><label class="form-label">Estoque Mínimo</label><input id="inp-min" class="form-input" type="number" step="0.1" placeholder="0"></div>
      </div>
      <div style="display:flex;gap:8px"><button class="btn-primary" style="flex:1" onclick="saveInput()">Salvar</button><button class="btn-secondary" onclick="toggleAddInput()">Cancelar</button></div>
    </div>
    <div style="overflow-x:auto"><table class="mini-table">
      <thead><tr><th>Nome</th><th>Cat.</th><th>Qtd.</th><th>Mín.</th><th>Custo</th><th>Status</th><th></th></tr></thead>
      <tbody>${stock.map(s=>`<tr>
        <td><strong>${s.name}</strong></td><td>${s.category}</td>
        <td style="font-weight:700;color:${s.qty<s.min?'#EF4444':'#1E293B'}">${s.qty} ${s.unit}</td>
        <td>${s.min} ${s.unit}</td><td>${fmt(s.cost)}</td>
        <td><span class="status-badge ${s.qty<s.min?'status-pendente':'status-pago'}">${s.qty<s.min?'⚠ Alerta':'OK'}</span></td>
        <td><button class="btn-danger" onclick="deleteInput(${s.id})">🗑</button></td>
      </tr>`).join('')}</tbody>
    </table></div>
  </div>`;
}

function toggleAddInput() {
  const f = document.getElementById('add-input-form');
  if (f) f.style.display = f.style.display==='none'?'block':'none';
}

function saveInput() {
  const name = (document.getElementById('inp-name').value||'').trim();
  if (!name) { toast('Informe o nome','error'); return; }
  const stock = loadData('sabolli_stock')||[];
  stock.push({ id:nextId(stock), name, category:document.getElementById('inp-cat').value, unit:document.getElementById('inp-unit').value, cost:Number(document.getElementById('inp-cost').value)||0, qty:Number(document.getElementById('inp-qty').value)||0, min:Number(document.getElementById('inp-min').value)||0 });
  saveData('sabolli_stock', stock);
  toast('Insumo cadastrado!');
  navigateTo('inputs');
}

function deleteInput(id) {
  customConfirm('Excluir este insumo?', () => {
    saveData('sabolli_stock', (loadData('sabolli_stock')||[]).filter(s=>s.id!==id));
    toast('Insumo excluído');
    navigateTo('inputs');
  });
}

// ===== NOVA COMPRA =====
let purchaseItems = [];

function renderNewPurchase(c) {
  purchaseItems = [];
  const suppliers = loadData('sabolli_suppliers')||[];
  const stock = loadData('sabolli_stock')||[];
  const supOptions = suppliers.length>0
    ? suppliers.map(s=>`<option value="${s.name}">${s.name}</option>`).join('')
    : '';
  c.innerHTML = `
  <div class="form-page">
    <div class="section-card">
      <div class="section-title">🛍️ Nova Compra</div>
      <div class="form-group"><label class="form-label">Fornecedor</label>
        ${suppliers.length>0
          ? `<select id="pur-supplier" class="form-select"><option value="">— Selecionar fornecedor —</option>${supOptions}</select>
             <input id="pur-supplier-manual" class="form-input" type="text" placeholder="Ou digitar manualmente..." style="margin-top:6px">`
          : `<input id="pur-supplier" class="form-input" type="text" placeholder="Nome do fornecedor">
             <div style="font-size:11px;color:#94A3B8;margin-top:4px">Cadastre fornecedores em <button onclick="navigateTo('suppliers')" style="background:none;border:none;color:#2563EB;cursor:pointer;font-size:11px;font-weight:600">Fornecedores →</button></div>`}
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Data</label><input id="pur-date" class="form-input" type="date" value="${todayStr()}"></div>
        <div class="form-group"><label class="form-label">Status</label>
          <select id="pur-status" class="form-select"><option>Pago</option><option>Pendente</option></select>
        </div>
      </div>
      <div class="form-group"><label class="form-label">Observações</label><textarea id="pur-obs" class="form-textarea" rows="2" placeholder="Observações..."></textarea></div>
    </div>

    <div class="section-card">
      <div class="section-title">📦 Adicionar Itens da Compra</div>
      <div class="form-group"><label class="form-label">Insumo</label>
        <select id="pur-item-sel" class="form-select" onchange="onPurItemChange()">
          <option value="">— Selecionar insumo —</option>
          ${stock.map(s=>`<option value="${s.id}" data-unit="${s.unit}" data-cost="${s.cost}">${s.name} (${s.unit})</option>`).join('')}
        </select>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label" id="pur-item-qty-label">Qtd. comprada</label><input id="pur-item-qty" class="form-input" type="number" step="0.001" min="0" placeholder="0" oninput="calcPurItemCost()"></div>
        <div class="form-group"><label class="form-label">Total pago (R$)</label><input id="pur-item-total" class="form-input" type="number" step="0.01" min="0" placeholder="0,00" oninput="calcPurItemCost()"></div>
      </div>
      <div id="pur-item-unit-cost" style="font-size:13px;color:#2563EB;font-weight:700;margin-bottom:10px;min-height:20px;padding:6px 10px;background:#EFF6FF;border-radius:8px;display:none"></div>
      <button class="btn-outline" onclick="addPurchaseItem()" style="width:100%;margin-bottom:14px">+ Adicionar Item à Compra</button>

      <div id="pur-items-list"></div>

      <div id="pur-grand-total-row" style="display:none;justify-content:space-between;align-items:center;padding:12px 4px;border-top:2px solid var(--border);margin-top:4px">
        <span style="font-weight:700;font-size:15px">Total da Compra</span>
        <span style="font-weight:900;font-size:18px;color:#2563EB" id="pur-grand-total">R$ 0,00</span>
      </div>
    </div>

    <div class="section-card">
      <div style="font-size:12px;color:#64748B;margin-bottom:12px;padding:10px;background:#F0FDF4;border-radius:10px;border:1.5px solid #BBF7D0">
        ✅ Ao salvar, os <strong>custos por unidade</strong> dos insumos serão atualizados automaticamente e as quantidades serão somadas ao estoque.
      </div>
      <button class="btn-primary" onclick="savePurchase()">💾 Salvar Compra</button>
    </div>
  </div>`;
}

function onPurItemChange() {
  const sel = document.getElementById('pur-item-sel');
  const opt = sel && sel.selectedOptions[0];
  const unit = opt ? (opt.dataset.unit||'un') : 'un';
  const label = document.getElementById('pur-item-qty-label');
  if (label) label.textContent = `Qtd. comprada (${unit})`;
  calcPurItemCost();
}

function calcPurItemCost() {
  const qty = Number(document.getElementById('pur-item-qty').value)||0;
  const total = Number(document.getElementById('pur-item-total').value)||0;
  const display = document.getElementById('pur-item-unit-cost');
  if (!display) return;
  if (qty>0 && total>0) {
    const sel = document.getElementById('pur-item-sel');
    const opt = sel && sel.selectedOptions[0];
    const unit = opt ? (opt.dataset.unit||'un') : 'un';
    const unitCost = total/qty;
    display.style.display = 'block';
    display.textContent = `Custo por ${unit}: R$ ${unitCost.toLocaleString('pt-BR',{minimumFractionDigits:4,maximumFractionDigits:4})}`;
  } else {
    display.style.display = 'none';
    display.textContent = '';
  }
}

function addPurchaseItem() {
  const sel = document.getElementById('pur-item-sel');
  const stockId = Number(sel && sel.value);
  const qty = Number(document.getElementById('pur-item-qty').value)||0;
  const total = Number(document.getElementById('pur-item-total').value)||0;
  if (!stockId) { toast('Selecione um insumo','error'); return; }
  if (qty<=0) { toast('Informe a quantidade','error'); return; }
  if (total<=0) { toast('Informe o valor pago','error'); return; }
  const stock = loadData('sabolli_stock')||[];
  const item = stock.find(s=>s.id===stockId);
  if (!item) return;
  const unitCost = total/qty;
  if (purchaseItems.find(i=>i.stockId===stockId)) { toast('Insumo já adicionado','warning'); return; }
  purchaseItems.push({ stockId, name:item.name, unit:item.unit, qty, total, unitCost });
  sel.value='';
  document.getElementById('pur-item-qty').value='';
  document.getElementById('pur-item-total').value='';
  document.getElementById('pur-item-unit-cost').style.display='none';
  document.getElementById('pur-item-unit-cost').textContent='';
  const label = document.getElementById('pur-item-qty-label');
  if (label) label.textContent='Qtd. comprada';
  renderPurchaseItems();
}

function removePurchaseItem(idx) {
  purchaseItems.splice(idx,1);
  renderPurchaseItems();
}

function renderPurchaseItems() {
  const list = document.getElementById('pur-items-list');
  const totalEl = document.getElementById('pur-grand-total');
  const totalRow = document.getElementById('pur-grand-total-row');
  if (!list) return;
  const grandTotal = purchaseItems.reduce((s,i)=>s+i.total,0);
  if (totalEl) totalEl.textContent = fmt(grandTotal);
  if (totalRow) totalRow.style.display = purchaseItems.length>0 ? 'flex' : 'none';
  if (purchaseItems.length===0) { list.innerHTML=''; return; }
  list.innerHTML = `<div style="overflow-x:auto"><table class="mini-table" style="margin-bottom:0">
    <thead><tr><th>Insumo</th><th>Qtd.</th><th>Total Pago</th><th>Custo/Un.</th><th></th></tr></thead>
    <tbody>${purchaseItems.map((item,i)=>`<tr>
      <td><strong>${item.name}</strong></td>
      <td>${item.qty} ${item.unit}</td>
      <td>${fmt(item.total)}</td>
      <td style="color:#2563EB;font-weight:700">R$ ${item.unitCost.toLocaleString('pt-BR',{minimumFractionDigits:4,maximumFractionDigits:4})}</td>
      <td><button class="btn-danger" onclick="removePurchaseItem(${i})" style="padding:3px 8px">×</button></td>
    </tr>`).join('')}</tbody>
  </table></div>`;
}

function savePurchase() {
  const supSel = document.getElementById('pur-supplier');
  const supMan = document.getElementById('pur-supplier-manual');
  const supplier = ((supSel&&supSel.tagName==='SELECT' ? (supMan&&supMan.value?supMan.value:supSel.value) : supSel&&supSel.value)||'').trim();
  if (!supplier) { toast('Informe o fornecedor','error'); return; }
  if (purchaseItems.length===0) { toast('Adicione ao menos 1 item','error'); return; }
  const total = purchaseItems.reduce((s,i)=>s+i.total,0);
  const date = document.getElementById('pur-date').value||todayStr();
  const status = document.getElementById('pur-status').value;
  const obs = (document.getElementById('pur-obs')||{}).value||'';
  const itemsDesc = purchaseItems.map(i=>`${i.name} ${i.qty}${i.unit}`).join(', ');

  // Atualiza custo e qty dos insumos no estoque
  const stock = loadData('sabolli_stock')||[];
  const moves = loadData('sabolli_stock_moves')||[];
  purchaseItems.forEach(pi=>{
    const s = stock.find(x=>x.id===pi.stockId);
    if (!s) return;
    s.cost = pi.unitCost;
    s.qty = Math.round(((s.qty||0) + pi.qty)*1000)/1000;
    moves.unshift({ id:nextId(moves), date, itemId:s.id, itemName:s.name, type:'entrada', qty:pi.qty, unit:s.unit, reason:`Compra — ${supplier}` });
  });
  saveData('sabolli_stock', stock);
  saveData('sabolli_stock_moves', moves);

  const purchases = loadData('sabolli_purchases')||[];
  purchases.unshift({ id:nextId(purchases), date, supplier, items:itemsDesc, total, status, obs, purchaseItems: purchaseItems.map(i=>({...i})) });
  saveData('sabolli_purchases', purchases);

  if (status==='Pago') {
    const txs = loadData('sabolli_financial_transactions')||[];
    txs.unshift({ id:nextId(txs), date, desc:`Compra — ${supplier}`, type:'saída', value:total, category:'Compras' });
    saveData('sabolli_financial_transactions', txs);
  }
  purchaseItems = [];
  toast('Compra salva! Custos e estoque atualizados.');
  navigateTo('purchases');
}

// ===== HISTÓRICO DE COMPRAS =====
function renderPurchases(c) {
  const purchases = loadData('sabolli_purchases')||[];
  const sorted = [...purchases].sort((a,b)=>b.date.localeCompare(a.date));
  const total = purchases.reduce((s,p)=>s+(p.total||0),0);
  c.innerHTML = `
  <div class="kpi-mini-row">
    <div class="kpi-mini"><div class="kpi-mini-label">Total Compras</div><div class="kpi-mini-value">${fmt(total)}</div></div>
    <div class="kpi-mini"><div class="kpi-mini-label">Registros</div><div class="kpi-mini-value">${purchases.length}</div></div>
    <div class="kpi-mini"><div class="kpi-mini-label">Pendente</div><div class="kpi-mini-value">${fmt(purchases.filter(p=>p.status==='Pendente').reduce((s,p)=>s+p.total,0))}</div></div>
  </div>
  <div class="section-card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px">
      <div class="section-title" style="margin:0">🗂️ Histórico de Compras</div>
      <button class="btn-outline" onclick="navigateTo('new-purchase')">+ Nova Compra</button>
    </div>
    ${sorted.length===0?'<div class="empty-state"><div class="empty-icon">🛍️</div><p>Nenhuma compra registrada</p></div>':
    `<div style="overflow-x:auto"><table class="mini-table">
      <thead><tr><th>#</th><th>Data</th><th>Fornecedor</th><th>Itens</th><th>Total</th><th>Status</th><th></th></tr></thead>
      <tbody>${sorted.map(p=>`<tr>
        <td>${p.id}</td><td>${fmtDate(p.date)}</td>
        <td><button onclick="navigateTo('suppliers')" style="background:none;border:none;color:#2563EB;font-weight:700;cursor:pointer;font-size:13px;padding:0;text-decoration:underline">🏭 ${p.supplier}</button></td>
        <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.items||'—'}</td>
        <td>${fmt(p.total)}</td>
        <td><span class="status-badge status-${(p.status||'').toLowerCase()}">${p.status}</span></td>
        <td><button class="btn-danger" onclick="deletePurchase(${p.id})">🗑</button></td>
      </tr>`).join('')}</tbody>
    </table></div>`}
  </div>`;
}

function deletePurchase(id) {
  customConfirm('Excluir esta compra?', () => {
    saveData('sabolli_purchases', (loadData('sabolli_purchases')||[]).filter(p=>p.id!==id));
    toast('Compra excluída');
    navigateTo('purchases');
  });
}

// ===== LANÇAMENTOS FINANCEIROS =====
function getAccountLabel(accountId) {
  if (!accountId) return '';
  const acc = (loadData('sabolli_accounts')||[]).find(a => a.id == accountId);
  return acc ? (acc.name + (acc.bank ? ' · ' + acc.bank : '')) : '';
}

function renderTransactions(c) {
  const txs = loadData('sabolli_financial_transactions')||[];
  const allCats = loadCategories();
  const accounts = loadData('sabolli_accounts')||[];
  const moneyAccounts = accounts.filter(a => a.type !== 'cartão');
  const accOptions = moneyAccounts.map((a, i) => {
    const icon = a.type==='poupança'?'💰':a.type==='dinheiro'?'💵':'🏦';
    return `<option value="${a.id}"${i===0?' selected':''}>${icon} ${a.name}${a.bank?' · '+a.bank:''}</option>`;
  }).join('');
  const negCats = allCats.transactions.map(cat=>`<option>${cat}</option>`).join('');
  const pesCats = allCats.personal.map(cat=>`<option>${cat}</option>`).join('');
  c.innerHTML = `
  <div class="section-card">
    <div class="section-title">💰 Novo Lançamento</div>
    <div class="chip-row" style="margin-bottom:6px">
      <div class="chip active" id="tx-tipo-btn-entrada" onclick="setTxTipo('entrada')">📈 Entrada</div>
      <div class="chip" id="tx-tipo-btn-saída" onclick="setTxTipo('saída')">📤 Saída</div>
    </div>
    <div class="chip-row" style="margin-bottom:6px">
      <div class="chip active" id="tx-status-btn-realizado" onclick="setTxStatus('realizado')" style="background:#F0FDF4;color:#15803D;border-color:#BBF7D0">✅ Realizado</div>
      <div class="chip" id="tx-status-btn-a_receber" onclick="setTxStatus('a_receber')" style="">⏳ A receber</div>
      <div class="chip" id="tx-status-btn-a_pagar" onclick="setTxStatus('a_pagar')" style="">⚠️ A pagar</div>
    </div>
    <div class="chip-row">
      <div class="chip active" id="tx-ext-btn-negocio" onclick="setTxExtract('negocio')" style="background:#EFF6FF;color:#2563EB;border-color:#BFDBFE">🏢 Negócio</div>
      <div class="chip" id="tx-ext-btn-pessoal" onclick="setTxExtract('pessoal')" style="">👤 Pessoal</div>
    </div>
    <input type="hidden" id="tx-tipo" value="entrada">
    <input type="hidden" id="tx-status" value="realizado">
    <input type="hidden" id="tx-extract" value="negocio">
    <div class="form-group"><label class="form-label">Descrição</label><input id="tx-desc" class="form-input" type="text" placeholder="Ex: Vendas do dia, Mercado, Aluguel..."></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Valor (R$)</label><input id="tx-value" class="form-input" type="number" step="0.01" placeholder="0,00"></div>
      <div class="form-group"><label class="form-label">Data</label><input id="tx-date" class="form-input" type="date" value="${todayStr()}"></div>
    </div>
    <div class="form-group"><label class="form-label">Categoria</label>
      <select id="tx-cat" class="form-select" id="tx-cat">${negCats}</select>
    </div>
    <div id="tx-cat-neg" style="display:none">${negCats}</div>
    <div id="tx-cat-pes" style="display:none">${pesCats}</div>
    <div class="form-group">
      <label class="form-label">🏦 Conta / Dinheiro</label>
      <select id="tx-account" class="form-select">
        ${moneyAccounts.length===0?'<option value="">— Nenhuma conta cadastrada —</option>':''}
        ${accOptions}
        ${moneyAccounts.length>0?'<option value="">— Sem conta —</option>':''}
      </select>
    </div>
    <div id="tx-delivery-check-group" class="form-group" style="background:#F0FDF4;border:1.5px solid #BBF7D0;border-radius:12px;padding:12px 14px;margin-bottom:0">
      <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-weight:600;font-size:14px;color:#15803D">
        <input type="checkbox" id="tx-has-delivery" onchange="toggleDeliveryFee()" style="width:18px;height:18px;cursor:pointer;accent-color:#16A34A">
        🚴 Incluir Taxa de Entrega
      </label>
      <div id="tx-delivery-fee-group" style="display:none;margin-top:10px">
        <label class="form-label" style="color:#166534">Valor da Taxa de Entrega (R$)</label>
        <input id="tx-delivery-fee" class="form-input" type="number" step="0.01" placeholder="0,00" min="0">
        <div style="font-size:11px;color:#16A34A;margin-top:4px;font-weight:600">💡 Será somado ao total acumulado de taxas</div>
      </div>
    </div>
    <div style="padding:8px 12px;background:#ECFDF5;border-radius:10px;font-size:12px;font-weight:700;color:#065F46;display:flex;justify-content:space-between;align-items:center">
      <span>🚴 Total acumulado de taxas de entrega:</span>
      <span id="tx-delivery-total-display">${fmt(loadData('sabolli_delivery_total')||0)}</span>
    </div>
    <div id="tx-pending-hint" style="display:none;background:#FFFBEB;border:1.5px solid #FDE68A;border-radius:10px;padding:10px 14px;font-size:12px;font-weight:600;color:#92400E;margin-bottom:0">
      ⚠️ Lançamentos pendentes <strong>não atualizam</strong> o saldo das contas até serem marcados como realizados.
    </div>
    <button class="btn-primary" onclick="saveTransaction()">💾 Salvar Lançamento</button>
  </div>
  <div class="section-card">
    <div class="section-title">Lançamentos Recentes</div>
    ${txs.length===0?'<div class="empty-state"><div class="empty-icon">💰</div><p>Nenhum lançamento</p></div>':
    [...txs].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,20).map(t=>{
      const accLabel = getAccountLabel(t.accountId);
      const isPending = t.status==='a_receber'||t.status==='a_pagar';
      const icoWrapBg = t.status==='a_receber'?'#FFFBEB':t.status==='a_pagar'?'#FEF2F2':(t.type==='entrada'?'#F0FDF4':'#FEF2F2');
      const ico = t.status==='a_receber'?'⏳':t.status==='a_pagar'?'⚠️':(t.type==='entrada'?'📈':'📤');
      const statusTag = isPending ? txStatusBadge(t) : (accLabel?`<span style="color:#7C3AED;font-size:11px">${accLabel}</span>`:`<span style="color:#F59E0B;font-size:10px">⚠ sem conta</span>`);
      return `
      <div class="tx-item" style="${isPending?'border-left:3px solid '+(t.status==='a_receber'?'#F59E0B':'#EF4444')+';padding-left:10px;opacity:0.88':''}">
        <div class="tx-ico-wrap" style="background:${icoWrapBg}">${ico}</div>
        <div class="tx-info" style="flex:1"><div class="tx-desc">${t.desc}${t.deliveryFee?` <span style="font-size:10px;background:#D1FAE5;color:#065F46;border-radius:4px;padding:1px 5px;font-weight:700">🚴 +${fmt(t.deliveryFee)}</span>`:''}</div><div class="tx-date" style="display:flex;gap:5px;flex-wrap:wrap;align-items:center">${fmtDate(t.date)} · ${t.category||''} ${statusTag}</div></div>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="tx-amount ${t.type==='entrada'?'inc':'exp'}">${t.type==='entrada'?'+':'-'}${fmt(t.value)}</div>
          <button class="btn-danger" onclick="deleteTx(${t.id})" style="padding:4px 8px">🗑</button>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

function setTxTipo(tipo) {
  document.getElementById('tx-tipo').value = tipo;
  ['entrada','saída'].forEach(t=>{
    const btn = document.getElementById('tx-tipo-btn-'+t);
    if (btn) btn.classList.toggle('active', t===tipo);
  });
}

function setTxExtract(ext) {
  document.getElementById('tx-extract').value = ext;
  const allCats = loadCategories();
  const catSel = document.getElementById('tx-cat');
  const cats = ext==='pessoal' ? allCats.personal : allCats.transactions;
  if (catSel) catSel.innerHTML = cats.map(c=>`<option>${c}</option>`).join('');
  ['negocio','pessoal'].forEach(e=>{
    const btn = document.getElementById('tx-ext-btn-'+e);
    if (btn) {
      btn.classList.toggle('active', e===ext);
      if (e===ext) { btn.style.background='#EFF6FF'; btn.style.color='#2563EB'; btn.style.borderColor='#BFDBFE'; }
      else { btn.style.background=''; btn.style.color=''; btn.style.borderColor=''; }
    }
  });
}

function setTxStatus(status) {
  document.getElementById('tx-status').value = status;
  const styles = {
    realizado: { bg:'#F0FDF4', color:'#15803D', border:'#BBF7D0' },
    a_receber: { bg:'#FFFBEB', color:'#B45309', border:'#FDE68A' },
    a_pagar:   { bg:'#FEF2F2', color:'#DC2626', border:'#FECACA' },
  };
  ['realizado','a_receber','a_pagar'].forEach(s=>{
    const btn = document.getElementById('tx-status-btn-'+s);
    if (!btn) return;
    if (s===status) {
      btn.classList.add('active');
      btn.style.background=styles[s].bg; btn.style.color=styles[s].color; btn.style.borderColor=styles[s].border;
    } else {
      btn.classList.remove('active');
      btn.style.background=''; btn.style.color=''; btn.style.borderColor='';
    }
  });
  // Conta só disponível se realizado
  const accGroup = document.getElementById('tx-account') ? document.getElementById('tx-account').closest('.form-group') : null;
  if (accGroup) accGroup.style.opacity = status==='realizado' ? '1' : '0.4';
  const hint = document.getElementById('tx-pending-hint');
  if (hint) hint.style.display = status!=='realizado' ? 'block' : 'none';
}

function toggleDeliveryFee() {
  const cb = document.getElementById('tx-has-delivery');
  const grp = document.getElementById('tx-delivery-fee-group');
  if (grp) grp.style.display = cb && cb.checked ? 'block' : 'none';
  if (cb && cb.checked) {
    const inp = document.getElementById('tx-delivery-fee');
    if (inp) inp.focus();
  }
}

function saveTransaction() {
  const desc = (document.getElementById('tx-desc').value||'').trim();
  const value = Number(document.getElementById('tx-value').value);
  if (!desc) { toast('Informe a descrição','error'); return; }
  if (!value||value<=0) { toast('Informe o valor','error'); return; }
  const tipo = document.getElementById('tx-tipo').value;
  const txStatus = (document.getElementById('tx-status')||{}).value || 'realizado';
  const accEl = document.getElementById('tx-account');
  const accountId = accEl && accEl.value ? Number(accEl.value) : null;
  let accName = '';
  if (accountId && txStatus === 'realizado') {
    const accs = loadData('sabolli_accounts')||[];
    const acc = accs.find(a => a.id === accountId);
    if (acc) {
      acc.balance = (acc.balance||0) + (tipo==='entrada' ? value : -value);
      saveData('sabolli_accounts', accs);
      accName = acc.name;
    }
  }
  // Taxa de entrega
  const hasDelivery = document.getElementById('tx-has-delivery');
  const deliveryFeeEl = document.getElementById('tx-delivery-fee');
  let deliveryFeeAdded = 0;
  if (hasDelivery && hasDelivery.checked) {
    deliveryFeeAdded = Number(deliveryFeeEl && deliveryFeeEl.value) || 0;
    if (deliveryFeeAdded > 0) {
      const currentTotal = loadData('sabolli_delivery_total') || 0;
      saveData('sabolli_delivery_total', currentTotal + deliveryFeeAdded);
    }
  }
  const extractType = (document.getElementById('tx-extract')||{}).value || 'negocio';
  const txs = loadData('sabolli_financial_transactions')||[];
  txs.unshift({ id:nextId(txs), date:document.getElementById('tx-date').value||todayStr(), desc, type:tipo, value, category:document.getElementById('tx-cat').value, accountId: txStatus==='realizado'?(accountId||null):null, extractType, deliveryFee: deliveryFeeAdded||null, status: txStatus });
  saveData('sabolli_financial_transactions', txs);
  let msg = txStatus==='realizado' ? 'Lançamento salvo!' : (txStatus==='a_receber' ? 'A Receber salvo!' : 'A Pagar salvo!');
  if (accName) msg += ` · ${accName} atualizada`;
  if (deliveryFeeAdded > 0) msg += ` · Taxa +${fmt(deliveryFeeAdded)}`;
  toast(msg);
  navigateTo('transactions');
}

function deleteTx(id) {
  customConfirm('Excluir este lançamento?', () => {
    const txs = loadData('sabolli_financial_transactions')||[];
    const tx = txs.find(t => t.id === id);
    if (tx && tx.accountId) {
      const accs = loadData('sabolli_accounts')||[];
      const acc = accs.find(a => a.id === tx.accountId);
      if (acc) {
        acc.balance = (acc.balance||0) + (tx.type==='entrada' ? -tx.value : tx.value);
        saveData('sabolli_accounts', accs);
      }
    }
    saveData('sabolli_financial_transactions', txs.filter(t=>t.id!==id));
    toast('Lançamento excluído');
    navigateTo('transactions');
  });
}

// ===== EXTRATO =====
function txStatusBadge(t) {
  if (!t.status || t.status==='realizado') return '';
  if (t.status==='a_receber') return `<span style="font-size:10px;font-weight:700;background:#FFFBEB;color:#B45309;border:1px solid #FDE68A;padding:1px 6px;border-radius:4px">⏳ A receber</span>`;
  if (t.status==='a_pagar') return `<span style="font-size:10px;font-weight:700;background:#FEF2F2;color:#DC2626;border:1px solid #FECACA;padding:1px 6px;border-radius:4px">⚠️ A pagar</span>`;
  return '';
}

function txItemHtml(t, showDelete) {
  const accLabel = getAccountLabel(t.accountId);
  const isPending = t.status==='a_receber'||t.status==='a_pagar';
  const accTag = isPending
    ? txStatusBadge(t)
    : t.accountId
      ? `<span style="color:#7C3AED;font-size:10px;font-weight:600;background:#F5F3FF;padding:1px 5px;border-radius:4px">${accLabel}</span>`
      : `<span style="color:#B45309;font-size:10px;font-weight:600;background:#FFFBEB;padding:1px 5px;border-radius:4px">⚠ sem conta</span>`;
  const icoWrapBg = t.status==='a_receber'?'#FFFBEB':t.status==='a_pagar'?'#FEF2F2':(t.type==='entrada'?'#F0FDF4':'#FEF2F2');
  const ico = t.status==='a_receber'?'⏳':t.status==='a_pagar'?'⚠️':(t.type==='entrada'?'📈':'📤');
  return `<div class="tx-item" style="${isPending?'opacity:0.85;border-left:3px solid '+(t.status==='a_receber'?'#F59E0B':'#EF4444')+';padding-left:10px':''}">
    <div class="tx-ico-wrap" style="background:${icoWrapBg}">${ico}</div>
    <div class="tx-info" style="flex:1">
      <div class="tx-desc">${t.desc}</div>
      <div class="tx-date" style="display:flex;gap:5px;flex-wrap:wrap;align-items:center">${fmtDate(t.date)} · ${t.category||''} ${accTag}</div>
    </div>
    <div style="display:flex;align-items:center;gap:6px">
      <div class="tx-amount ${t.type==='entrada'?'inc':'exp'}">${t.type==='entrada'?'+':'-'}${fmt(t.value)}</div>
      ${showDelete?`<button class="btn-danger" onclick="deleteTxExtract(${t.id})" style="padding:4px 8px">🗑</button>`:''}
    </div>
  </div>`;
}

function renderExtract(c) {
  const tab = currentExtractTab;
  const allTxs = loadData('sabolli_financial_transactions')||[];
  const txs = allTxs.filter(t => tab==='pessoal' ? t.extractType==='pessoal' : (t.extractType==='negocio'||!t.extractType));
  const sorted = [...txs].sort((a,b)=>b.date.localeCompare(a.date));
  const entradas = txs.filter(t=>t.type==='entrada'&&(!t.status||t.status==='realizado')).reduce((s,t)=>s+(t.value||0),0);
  const saidas = txs.filter(t=>t.type==='saída'&&(!t.status||t.status==='realizado')).reduce((s,t)=>s+(t.value||0),0);
  const extAReceber = txs.filter(t=>t.status==='a_receber').reduce((s,t)=>s+(t.value||0),0);
  const extAPagar = txs.filter(t=>t.status==='a_pagar').reduce((s,t)=>s+(t.value||0),0);
  const saldo = entradas-saidas;
  const unlinked = txs.filter(t=>!t.accountId&&(!t.status||t.status==='realizado'));
  c.innerHTML = `
  <div class="form-tab-row" style="margin-bottom:14px">
    <button class="form-tab-btn${tab==='negocio'?' active':''}" onclick="switchExtractTab('negocio')">🏢 Negócio</button>
    <button class="form-tab-btn${tab==='pessoal'?' active':''}" onclick="switchExtractTab('pessoal')">👤 Pessoal</button>
  </div>
  <div class="kpi-mini-row">
    <div class="kpi-mini"><div class="kpi-mini-label">Entradas</div><div class="kpi-mini-value" style="color:#10B981">${fmt(entradas)}</div></div>
    <div class="kpi-mini"><div class="kpi-mini-label">Saídas</div><div class="kpi-mini-value" style="color:#EF4444">${fmt(saidas)}</div></div>
    <div class="kpi-mini"><div class="kpi-mini-label">Saldo</div><div class="kpi-mini-value" style="color:${saldo>=0?'#2563EB':'#EF4444'}">${fmt(saldo)}</div></div>
    ${extAReceber>0?`<div class="kpi-mini"><div class="kpi-mini-label">⏳ A Receber</div><div class="kpi-mini-value" style="color:#B45309">${fmt(extAReceber)}</div></div>`:''}
    ${extAPagar>0?`<div class="kpi-mini"><div class="kpi-mini-label">⚠️ A Pagar</div><div class="kpi-mini-value" style="color:#DC2626">${fmt(extAPagar)}</div></div>`:''}
  </div>
  ${unlinked.length>0?`<div style="background:#FFFBEB;border:1.5px solid #F59E0B;border-radius:12px;padding:10px 14px;margin-bottom:12px;display:flex;align-items:center;gap:10px">
    <span style="font-size:20px">⚠️</span>
    <div>
      <div style="font-size:12px;font-weight:800;color:#B45309">${unlinked.length} lançamento(s) sem conta vinculada</div>
      <div style="font-size:11px;color:#92400E">Vá em <strong>Lançamentos Financeiros</strong> e vincule à conta correta.</div>
    </div>
  </div>`:''}
  <div class="section-card">
    <div class="section-title">📄 Extrato ${tab==='pessoal'?'Pessoal':'do Negócio'}</div>
    <div class="filter-bar">
      <select class="filter-select" id="ext-type-filter" onchange="filterExtract()">
        <option value="">Todos</option><option value="entrada">Entradas</option><option value="saída">Saídas</option>
        <option value="a_receber">⏳ A receber</option><option value="a_pagar">⚠️ A pagar</option>
        <option value="unlinked">Sem conta vinculada</option>
      </select>
    </div>
    <div id="extract-list">
      ${sorted.map(t=>txItemHtml(t,true)).join('') || '<div class="empty-state"><div class="empty-icon">📄</div><p>Sem lançamentos</p></div>'}
    </div>
  </div>`;
}

function switchExtractTab(tab) {
  currentExtractTab = tab;
  renderPage(document.getElementById('content'), 'extract');
}

function deleteTxExtract(id) {
  customConfirm('Excluir este lançamento?', () => {
    const txs = loadData('sabolli_financial_transactions')||[];
    const tx = txs.find(t => t.id === id);
    if (tx && tx.accountId) {
      const accs = loadData('sabolli_accounts')||[];
      const acc = accs.find(a => a.id === tx.accountId);
      if (acc) {
        acc.balance = (acc.balance||0) + (tx.type==='entrada' ? -tx.value : tx.value);
        saveData('sabolli_accounts', accs);
      }
    }
    saveData('sabolli_financial_transactions', txs.filter(t=>t.id!==id));
    toast('Lançamento excluído');
    navigateTo('extract');
  });
}

function filterExtract() {
  const tipo = document.getElementById('ext-type-filter').value;
  const tab = currentExtractTab;
  const allTxs = loadData('sabolli_financial_transactions')||[];
  const txs = allTxs.filter(t => tab==='pessoal' ? t.extractType==='pessoal' : (t.extractType==='negocio'||!t.extractType));
  const filtered = [...txs].filter(t=>{
    if (!tipo) return true;
    if (tipo==='unlinked') return !t.accountId && (!t.status||t.status==='realizado');
    if (tipo==='a_receber') return t.status==='a_receber';
    if (tipo==='a_pagar') return t.status==='a_pagar';
    return t.type===tipo && (!t.status||t.status==='realizado');
  }).sort((a,b)=>b.date.localeCompare(a.date));
  const el = document.getElementById('extract-list');
  if (el) el.innerHTML = filtered.map(t=>txItemHtml(t,true)).join('') || '<div class="empty-state"><div class="empty-icon">📄</div><p>Sem lançamentos</p></div>';
}

// ===== CONTAS =====
function getCardBillTotal(cardId, monthStr) {
  return (loadData('sabolli_card_expenses')||[]).filter(e=>e.cardId===cardId&&e.referenceMonth===monthStr).reduce((s,e)=>s+(e.value||0),0);
}

function getCardReferenceMonth(cardId, dateStr) {
  const card = (loadData('sabolli_accounts')||[]).find(a=>a.id===cardId);
  const date = new Date(dateStr+'T00:00:00');
  const day = date.getDate();
  const closeDay = card&&card.closeDay?Number(card.closeDay):0;
  let y=date.getFullYear(), m=date.getMonth()+1;
  if (closeDay>0&&day>closeDay) { m++; if(m>12){m=1;y++;} }
  return `${y}-${String(m).padStart(2,'0')}`;
}

function renderAccounts(c) {
  const accounts = loadData('sabolli_accounts')||[];
  const today = todayStr();
  const cards = accounts.filter(a=>a.type==='cartão');
  const moneyAccts = accounts.filter(a=>a.type!=='cartão');
  const totalMoney = moneyAccts.reduce((s,a)=>s+(a.balance||0),0);
  const totalLimit = cards.reduce((s,a)=>s+(a.limite||0),0);
  const totalUsed = cards.reduce((s,card)=>s+getCardBillTotal(card.id, getCardReferenceMonth(card.id, today)),0);
  const totalAvail = totalLimit-totalUsed;
  const usePct = totalLimit>0?Math.min(100,totalUsed/totalLimit*100):0;
  const barColor = usePct>80?'#EF4444':usePct>50?'#F59E0B':'#10B981';
  const typeIcon = {conta:'🏦',poupança:'💰',dinheiro:'💵'};
  const typeColors = {conta:'#1E3A8A',poupança:'#1a6b3c',dinheiro:'#D97706'};

  const cardsHtml = cards.map(card=>{
    const brand = CARD_BRANDS[card.cardBrand]||CARD_BRANDS.outro;
    const cardColor = card.color || brand.bg;
    const cardCm = getCardReferenceMonth(card.id, today);
    const bill = getCardBillTotal(card.id, cardCm);
    const avail = (card.limite||0)-bill;
    const pct = card.limite>0?Math.min(100,bill/card.limite*100):0;
    const bc = pct>80?'#EF4444':pct>50?'#F59E0B':'#10B981';
    const walletLinked = isWalletLinked(card.id);
    return `<div class="account-card" style="background:linear-gradient(135deg,${cardColor},${cardColor}cc);min-height:170px">
      <button class="nfc-btn${walletLinked?' linked':''}" onclick="showNfcModal(${card.id})" title="${walletLinked?'Abrir Google Carteiras':'Cadastrar no Google Carteiras'}">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.5 15.5C8.5 13.015 10.515 11 13 11" stroke="white" stroke-width="2" stroke-linecap="round"/>
          <path d="M6 17.5C6 11.701 10.701 7 16.5 7" stroke="white" stroke-width="2" stroke-linecap="round"/>
          <circle cx="13" cy="15.5" r="1.5" fill="white"/>
        </svg>
      </button>
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div class="ac-bank" style="padding-left:38px">${card.bank||card.name}</div>
        <div style="display:flex;gap:4px">
          <button onclick="openAccountColorPicker(${card.id},'${cardColor}')" title="Editar cor" style="background:rgba(255,255,255,0.2);border:1.5px solid rgba(255,255,255,0.5);border-radius:6px;color:#fff;padding:3px 7px;cursor:pointer;font-size:11px">🎨</button>
          <button onclick="deleteAccount(${card.id})" style="background:rgba(255,255,255,0.15);border:none;border-radius:6px;color:#fff;padding:3px 7px;cursor:pointer;font-size:11px">🗑</button>
        </div>
      </div>
      <div class="ac-name">${card.name}</div>
      <div style="font-size:10px;opacity:0.65;margin-bottom:2px">Fatura ${fmtMonth(cardCm)}</div>
      <div style="font-size:19px;font-weight:900;color:#fff;margin-bottom:2px">${fmt(bill)}</div>
      <div class="ac-limit">Limite: ${fmt(card.limite||0)} · Disp: ${fmt(avail)}</div>
      ${card.closeDay?`<div class="ac-closedue">Fecha dia ${card.closeDay}${card.dueDay?` · Vence dia ${card.dueDay}`:''}</div>`:''}
      <div style="margin:7px 0;height:4px;background:rgba(255,255,255,0.2);border-radius:2px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${bc};border-radius:2px"></div>
      </div>
      <div style="display:flex;gap:5px">
        <button onclick="showCardExpenseForm(${card.id})" style="flex:1;padding:6px;border-radius:8px;background:rgba(255,255,255,0.22);border:1px solid rgba(255,255,255,0.4);color:#fff;font-size:11px;font-weight:700;cursor:pointer">+ Lançar</button>
        <button onclick="showCardBill(${card.id})" style="flex:1;padding:6px;border-radius:8px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.25);color:#fff;font-size:11px;cursor:pointer">📄 Fatura</button>
      </div>
      <div class="card-brand-logo">${brand.logo}</div>
    </div>`;
  }).join('');

  // Divergence calculations
  const allTxs2 = loadData('sabolli_financial_transactions')||[];
  const linkedTxs = allTxs2.filter(t => t.accountId);
  const unlinkedTxs = allTxs2.filter(t => !t.accountId);
  const unlinkedIn = unlinkedTxs.filter(t=>t.type==='entrada').reduce((s,t)=>s+(t.value||0),0);
  const unlinkedOut = unlinkedTxs.filter(t=>t.type==='saída').reduce((s,t)=>s+(t.value||0),0);
  const unlinkedNet = unlinkedIn - unlinkedOut;

  const accountStats = moneyAccts.map(a => {
    const initial = (a.initialBalance !== undefined) ? a.initialBalance : a.balance;
    const linked = linkedTxs.filter(t => Number(t.accountId) === a.id);
    const inAcc = linked.filter(t=>t.type==='entrada').reduce((s,t)=>s+(t.value||0),0);
    const outAcc = linked.filter(t=>t.type==='saída').reduce((s,t)=>s+(t.value||0),0);
    const computed = initial + inAcc - outAcc;
    const divergence = Math.round(((a.balance||0) - computed)*100)/100;
    return { ...a, initial, inAcc, outAcc, computed, divergence };
  });

  const moneyHtml = moneyAccts.map((a,i)=>{
    const c2 = a.color||typeColors[a.type]||'#334155';
    const st = accountStats[i];
    const hasInitial = a.initialBalance !== undefined;
    const movNet = st.inAcc - st.outAcc;
    const walletLinkedAcct = isWalletLinked(a.id);
    return `<div class="account-card" style="background:linear-gradient(135deg,${c2},${c2}bb)">
      <button class="nfc-btn${walletLinkedAcct?' linked':''}" onclick="showNfcModal(${a.id})" title="${walletLinkedAcct?'Abrir Google Carteiras':'Cadastrar no Google Carteiras'}">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.5 15.5C8.5 13.015 10.515 11 13 11" stroke="white" stroke-width="2" stroke-linecap="round"/>
          <path d="M6 17.5C6 11.701 10.701 7 16.5 7" stroke="white" stroke-width="2" stroke-linecap="round"/>
          <circle cx="13" cy="15.5" r="1.5" fill="white"/>
        </svg>
      </button>
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div class="ac-bank" style="padding-left:38px">${a.bank||a.type}</div>
        <div style="display:flex;gap:4px">
          <button onclick="openEditAccount(${a.id})" title="Editar" style="background:rgba(255,255,255,0.2);border:1.5px solid rgba(255,255,255,0.5);border-radius:6px;color:#fff;padding:3px 7px;cursor:pointer;font-size:11px">✏️</button>
          <button onclick="openAccountColorPicker(${a.id},'${c2}')" title="Editar cor" style="background:rgba(255,255,255,0.2);border:1.5px solid rgba(255,255,255,0.5);border-radius:6px;color:#fff;padding:3px 7px;cursor:pointer;font-size:11px">🎨</button>
          <button onclick="deleteAccount(${a.id})" style="background:rgba(255,255,255,0.15);border:none;border-radius:6px;color:#fff;padding:3px 7px;cursor:pointer;font-size:11px">🗑</button>
        </div>
      </div>
      <div class="ac-name">${a.name}</div>
      <div class="ac-balance">${fmt(a.balance||0)}</div>
      <div class="ac-type">${typeIcon[a.type]||'🏦'} ${a.type}</div>
      ${hasInitial?`<div style="font-size:10px;opacity:0.75;margin-top:4px">Inicial: ${fmt(st.initial)}${movNet!==0?' · Mov: '+(movNet>0?'+':'')+fmt(movNet):''}</div>`:''}
      ${Math.abs(st.divergence)>0.01?`<div style="font-size:10px;margin-top:3px;background:rgba(239,68,68,0.25);border-radius:5px;padding:2px 6px;color:#fff;font-weight:700">⚠ Divergência: ${fmt(Math.abs(st.divergence))}</div>`:''}
    </div>`;
  }).join('');

  const brandOptions = Object.entries(CARD_BRANDS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('');

  const divergencePanel = `
  <div class="section-card" style="border:2px solid ${unlinkedTxs.length>0||accountStats.some(a=>Math.abs(a.divergence)>0.01)?'#F59E0B':'#10B981'}">
    <div class="section-title" style="margin-bottom:12px">⚖️ Reconciliação de Contas</div>
    <div style="display:flex;flex-direction:column;gap:8px">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:#F8FAFC;border-radius:8px;font-size:13px">
        <span style="color:var(--text-sec);font-weight:600">Saldo total em contas</span>
        <span style="font-weight:800;color:#2563EB">${fmt(totalMoney)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:#F0FDF4;border-radius:8px;font-size:13px">
        <span style="color:var(--text-sec);font-weight:600">📈 Lançamentos vinculados (entradas)</span>
        <span style="font-weight:700;color:#10B981">+${fmt(linkedTxs.filter(t=>t.type==='entrada').reduce((s,t)=>s+(t.value||0),0))}</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:#FEF2F2;border-radius:8px;font-size:13px">
        <span style="color:var(--text-sec);font-weight:600">📤 Lançamentos vinculados (saídas)</span>
        <span style="font-weight:700;color:#EF4444">-${fmt(linkedTxs.filter(t=>t.type==='saída').reduce((s,t)=>s+(t.value||0),0))}</span>
      </div>
      ${unlinkedTxs.length>0?`
      <div style="padding:10px 12px;background:#FFFBEB;border:1.5px solid #F59E0B;border-radius:10px;margin-top:4px">
        <div style="font-size:12px;font-weight:800;color:#B45309;margin-bottom:6px">⚠️ Lançamentos SEM conta vinculada (${unlinkedTxs.length})</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <span style="font-size:12px;color:#10B981">Entradas: +${fmt(unlinkedIn)}</span>
          <span style="font-size:12px;color:#EF4444">Saídas: -${fmt(unlinkedOut)}</span>
          <span style="font-size:12px;font-weight:700;color:${unlinkedNet>=0?'#2563EB':'#EF4444'}">Líquido: ${unlinkedNet>=0?'+':''}${fmt(unlinkedNet)}</span>
        </div>
        <div style="font-size:11px;color:#92400E;margin-top:5px">Esses lançamentos não foram somados a nenhuma conta. Vá em <strong>Lançamentos Financeiros</strong> e vincule-os à conta correta.</div>
      </div>`:''}
      ${accountStats.filter(a=>Math.abs(a.divergence)>0.01).map(a=>`
      <div style="padding:10px 12px;background:#FEF2F2;border:1.5px solid #EF4444;border-radius:10px;margin-top:4px">
        <div style="font-size:12px;font-weight:800;color:#B91C1C;margin-bottom:4px">⛔ ${a.name}: divergência de ${fmt(Math.abs(a.divergence))}</div>
        <div style="font-size:11px;color:#7F1D1D">Saldo declarado: ${fmt(a.balance||0)} · Esperado (inicial + movimentações): ${fmt(a.computed)}</div>
      </div>`).join('')}
      ${unlinkedTxs.length===0&&!accountStats.some(a=>Math.abs(a.divergence)>0.01)?`
      <div style="padding:10px 12px;background:#F0FDF4;border:1.5px solid #10B981;border-radius:10px;text-align:center">
        <span style="font-size:13px;font-weight:700;color:#065F46">✅ Tudo reconciliado — sem divergências!</span>
      </div>`:''}
    </div>
  </div>`;

  c.innerHTML = `
  <div class="kpi-mini-row">
    <div class="kpi-mini"><div class="kpi-mini-label">Dinheiro Disponível</div><div class="kpi-mini-value" style="color:#2563EB">${fmt(totalMoney)}</div></div>
    <div class="kpi-mini"><div class="kpi-mini-label">Crédito em Uso</div><div class="kpi-mini-value" style="color:#EF4444">${fmt(totalUsed)}</div></div>
    <div class="kpi-mini"><div class="kpi-mini-label">Crédito Disponível</div><div class="kpi-mini-value" style="color:#10B981">${fmt(totalAvail)}</div></div>
  </div>

  ${totalLimit>0?`<div style="background:#fff;border-radius:12px;border:1px solid var(--border);padding:14px;margin-bottom:14px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <span style="font-size:11px;font-weight:700;color:var(--text-sec)">USO DE CRÉDITO — FATURA ATUAL</span>
      <span style="font-size:13px;font-weight:700">${usePct.toFixed(0)}%</span>
    </div>
    <div class="credit-bar" style="height:9px"><div class="credit-bar-fill" style="width:${usePct}%;background:${barColor}"></div></div>
    <div style="display:flex;justify-content:space-between;margin-top:5px;font-size:11px;color:var(--text-sec)"><span>Usado: ${fmt(totalUsed)}</span><span>Limite total: ${fmt(totalLimit)}</span></div>
  </div>`:''}

  ${cards.length>0?`<div class="section-card"><div class="section-title">💳 Cartões de Crédito</div><div class="accounts-grid">${cardsHtml}</div></div>`:''}
  ${moneyAccts.length>0?`<div class="section-card"><div class="section-title">🏦 Contas e Dinheiro</div><div class="accounts-grid">${moneyHtml}</div></div>`:''}

  ${divergencePanel}

  <div class="section-card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px">
      <div class="section-title" style="margin:0">+ Adicionar Conta ou Cartão</div>
      <button class="btn-outline" onclick="toggleAddAccount()">Adicionar</button>
    </div>
    <div id="add-account-form" style="display:none">
      <div class="form-tab-row">
        <button id="ftab-conta" class="form-tab-btn active" onclick="switchAccTab('conta')">🏦 Conta / Dinheiro</button>
        <button id="ftab-cartao" class="form-tab-btn" onclick="switchAccTab('cartao')">💳 Cartão de Crédito</button>
      </div>
      <div id="fform-conta">
        <div class="form-row">
          <div class="form-group"><label class="form-label">Nome</label><input id="acc-name" class="form-input" type="text" placeholder="Ex: Conta Corrente"></div>
          <div class="form-group"><label class="form-label">Banco/Instituição</label><input id="acc-bank" class="form-input" type="text" placeholder="Ex: Itaú"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Tipo</label>
            <select id="acc-type" class="form-select"><option value="conta">Conta Corrente</option><option value="poupança">Poupança</option><option value="dinheiro">Dinheiro em Espécie</option></select>
          </div>
          <div class="form-group"><label class="form-label">Saldo Atual (R$)</label><input id="acc-balance" class="form-input" type="number" step="0.01" placeholder="0,00"></div>
        </div>
        <div style="display:flex;gap:8px"><button class="btn-primary" style="flex:1" onclick="saveAccount('conta')">Salvar Conta</button><button class="btn-secondary" onclick="toggleAddAccount()">Cancelar</button></div>
      </div>
      <div id="fform-cartao" style="display:none">
        <div class="form-row">
          <div class="form-group"><label class="form-label">Nome do Cartão</label><input id="card-name" class="form-input" type="text" placeholder="Ex: Nubank Black"></div>
          <div class="form-group"><label class="form-label">Banco/Emissor</label><input id="card-bank" class="form-input" type="text" placeholder="Ex: Nubank"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Bandeira</label><select id="card-brand" class="form-select">${brandOptions}</select></div>
          <div class="form-group"><label class="form-label">Limite Total (R$)</label><input id="card-limite" class="form-input" type="number" step="0.01" placeholder="0,00"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Dia de Fechamento</label><input id="card-close" class="form-input" type="number" min="1" max="31" placeholder="Ex: 10"></div>
          <div class="form-group"><label class="form-label">Dia de Vencimento</label><input id="card-due" class="form-input" type="number" min="1" max="31" placeholder="Ex: 17"></div>
        </div>
        <div style="display:flex;gap:8px"><button class="btn-primary" style="flex:1" onclick="saveAccount('cartao')">Salvar Cartão</button><button class="btn-secondary" onclick="toggleAddAccount()">Cancelar</button></div>
      </div>
    </div>
  </div>

  <div class="section-card" id="card-expense-section" style="display:none;transition:background .3s,border-color .3s">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <div class="section-title" style="margin:0">💳 Lançar Gasto no Cartão</div>
      <button onclick="hideCardExpenseForm()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--text-sec)">✕</button>
    </div>
    <input type="hidden" id="ce-card">
    <div class="form-group">
      <label class="form-label">Selecione o Cartão</label>
      <div class="ce-card-grid">
        ${cards.length>0?cards.map(card=>{
          const brand = CARD_BRANDS[card.cardBrand]||CARD_BRANDS.outro;
          return `<div class="ce-card-opt" id="ce-card-opt-${card.id}" onclick="selectExpenseCard(${card.id})" style="background:linear-gradient(135deg,${brand.bg},${brand.bg}cc)">
            <div class="ce-card-opt-bank">${card.bank||card.name}</div>
            <div class="ce-card-opt-name">${card.name}</div>
            <div class="ce-card-opt-logo">${brand.logo}</div>
          </div>`;
        }).join(''):'<div style="color:var(--text-sec);font-size:13px;padding:8px 0">Nenhum cartão cadastrado</div>'}
      </div>
    </div>
    <div class="form-group"><label class="form-label">Data</label><input id="ce-date" class="form-input" type="date" value="${todayStr()}"></div>
    <div class="form-group"><label class="form-label">Descrição</label><input id="ce-desc" class="form-input" type="text" placeholder="Ex: Supermercado Extra"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Valor Total (R$)</label><input id="ce-value" class="form-input" type="number" step="0.01" placeholder="0,00" oninput="updateInstallPreview()"></div>
      <div class="form-group"><label class="form-label">Parcelas</label>
        <select id="ce-inst" class="form-select" onchange="updateInstallPreview()">
          <option value="1">À vista</option>${Array.from({length:11},(_,i)=>`<option value="${i+2}">${i+2}x</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-group"><label class="form-label">Categoria</label>
      <select id="ce-cat" class="form-select">${loadCategories().card.map(c=>`<option>${c}</option>`).join('')}</select>
    </div>
    <div id="install-preview" style="display:none;padding:10px 14px;background:#EFF6FF;border-radius:10px;margin-bottom:12px;font-size:13px;color:#1E3A8A;font-weight:600"></div>
    <div style="display:flex;gap:8px">
      <button class="btn-primary" style="flex:1" onclick="saveCardExpense()">✅ Confirmar Gasto</button>
      <button class="btn-secondary" onclick="hideCardExpenseForm()">Cancelar</button>
    </div>
  </div>

  <div class="section-card" id="card-bill-section" style="display:none">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <div class="section-title" style="margin:0" id="card-bill-title">Fatura</div>
      <button onclick="hideCardBill()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--text-sec)">✕</button>
    </div>
    <div id="card-bill-content"></div>
  </div>`;
}

function toggleAddAccount() {
  const f = document.getElementById('add-account-form');
  if (f) f.style.display = f.style.display==='none'?'block':'none';
}

function switchAccTab(tab) {
  document.getElementById('fform-conta').style.display = tab==='conta'?'block':'none';
  document.getElementById('fform-cartao').style.display = tab==='cartao'?'block':'none';
  document.getElementById('ftab-conta').classList.toggle('active', tab==='conta');
  document.getElementById('ftab-cartao').classList.toggle('active', tab==='cartao');
}

function saveAccount(formType) {
  const accounts = loadData('sabolli_accounts')||[];
  if (formType==='cartao') {
    const name = (document.getElementById('card-name').value||'').trim();
    if (!name) { toast('Informe o nome do cartão','error'); return; }
    const brand = document.getElementById('card-brand').value;
    accounts.push({
      id:nextId(accounts), name,
      bank: document.getElementById('card-bank').value,
      type:'cartão',
      balance:0,
      limite: Number(document.getElementById('card-limite').value)||0,
      closeDay: Number(document.getElementById('card-close').value)||0,
      dueDay: Number(document.getElementById('card-due').value)||0,
      cardBrand: brand,
      color: (CARD_BRANDS[brand]||CARD_BRANDS.outro).bg
    });
    toast('Cartão salvo!');
  } else {
    const name = (document.getElementById('acc-name').value||'').trim();
    if (!name) { toast('Informe o nome da conta','error'); return; }
    const type = document.getElementById('acc-type').value;
    const typeColors = {conta:'#1E3A8A',poupança:'#1a6b3c',dinheiro:'#D97706'};
    const initBal = Number(document.getElementById('acc-balance').value)||0;
    accounts.push({
      id:nextId(accounts), name,
      bank: document.getElementById('acc-bank').value,
      type, balance: initBal,
      initialBalance: initBal,
      color: typeColors[type]||'#334155'
    });
    toast('Conta salva!');
  }
  saveData('sabolli_accounts', accounts);
  navigateTo('accounts');
}

function deleteAccount(id) {
  customConfirm('Excluir esta conta/cartão?', () => {
    saveData('sabolli_accounts', (loadData('sabolli_accounts')||[]).filter(a=>a.id!==id));
    saveData('sabolli_card_expenses', (loadData('sabolli_card_expenses')||[]).filter(e=>e.cardId!==id));
    const links = loadData('sabolli_wallet_links')||{};
    delete links[id];
    saveData('sabolli_wallet_links', links);
    toast('Excluído!');
    navigateTo('accounts');
  });
}

/* ===== GOOGLE WALLET / NFC ===== */
const NFC_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="rgba(255,255,255,0.1)" stroke="white" stroke-width="1.2"/>
  <path d="M8.5 15.5C8.5 13.015 10.515 11 13 11" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M6.5 17.5C6.5 11.977 10.977 7.5 16.5 7.5" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="13" cy="15" r="1.5" fill="white"/>
</svg>`;

function isWalletLinked(accountId) {
  const links = loadData('sabolli_wallet_links')||{};
  return !!links[accountId];
}

function setWalletLinked(accountId, value) {
  const links = loadData('sabolli_wallet_links')||{};
  links[accountId] = value;
  saveData('sabolli_wallet_links', links);
}

function openGoogleWalletApp() {
  // Tenta abrir o app Google Carteiras no Android; fallback para web
  const intentUrl = 'intent://pay.google.com#Intent;scheme=https;package=com.google.android.apps.walletnfcrel;end';
  const webUrl = 'https://pay.google.com';
  const a = document.createElement('a');
  a.href = intentUrl;
  a.style.display = 'none';
  document.body.appendChild(a);
  try { a.click(); } catch(e) {}
  document.body.removeChild(a);
  // Fallback depois de um instante
  setTimeout(() => { if (document.visibilityState !== 'hidden') window.open(webUrl, '_blank'); }, 1200);
}

function showNfcModal(accountId) {
  const existing = document.getElementById('gw-modal-overlay');
  if (existing) existing.remove();

  const accounts = loadData('sabolli_accounts')||[];
  const acc = accounts.find(a => a.id === accountId);
  if (!acc) return;

  const linked = isWalletLinked(accountId);
  const CARD_BRANDS_REF = typeof CARD_BRANDS !== 'undefined' ? CARD_BRANDS : {};
  const brand = CARD_BRANDS_REF[acc.cardBrand]||{logo:'',bg:'#334155'};
  const cardColor = acc.color || brand.bg || '#334155';
  const displayName = acc.bank ? `${acc.bank} · ${acc.name}` : acc.name;

  if (linked) {
    // Já cadastrado → abre Google Wallet direto
    openGoogleWalletApp();
    toast('Abrindo Google Carteiras…');
    return;
  }

  const overlay = document.createElement('div');
  overlay.id = 'gw-modal-overlay';
  overlay.className = 'gw-modal-overlay';
  overlay.innerHTML = `
    <div class="gw-modal">
      <div class="gw-modal-title">📲 Pagar por Aproximação</div>
      <div class="gw-modal-sub">Para pagar por aproximação, seu cartão precisa estar cadastrado no Google Carteiras.</div>
      <div class="gw-card-preview" style="background:linear-gradient(135deg,${cardColor},${cardColor}cc)">
        ${NFC_SVG}
        <div>
          <div style="font-size:12px;opacity:0.75">${acc.bank||acc.type||''}</div>
          <div style="font-size:15px">${acc.name}</div>
        </div>
      </div>
      <button class="gw-btn-yes" onclick="confirmWalletLinked(${accountId})">
        ✅ Já está cadastrado no Google Carteiras
      </button>
      <button class="gw-btn-add" onclick="goAddToWallet(${accountId})">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M21 18v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v1"/><polyline points="15 3 21 9 15 15" stroke="white" fill="none" stroke-width="2"/><line x1="21" y1="9" x2="9" y2="9" stroke="white" stroke-width="2"/></svg>
        Adicionar ao Google Carteiras agora
      </button>
      <button class="gw-btn-cancel" onclick="closeGwModal()">Cancelar</button>
    </div>
  `;
  overlay.addEventListener('click', e => { if (e.target === overlay) closeGwModal(); });
  document.body.appendChild(overlay);
}

function confirmWalletLinked(accountId) {
  setWalletLinked(accountId, true);
  closeGwModal();
  toast('✅ Cartão vinculado! Toque no ícone NFC para abrir o Google Carteiras.');
  navigateTo('accounts');
}

function goAddToWallet(accountId) {
  closeGwModal();
  window.open('https://pay.google.com', '_blank');
  // Depois de abrir o wallet, marca como pendente de confirmação
  setTimeout(() => {
    customConfirm('Você adicionou o cartão no Google Carteiras?', () => {
      setWalletLinked(accountId, true);
      toast('✅ Vinculado! Agora toque no ícone NFC para pagar.');
      navigateTo('accounts');
    });
  }, 3000);
}

function closeGwModal() {
  const el = document.getElementById('gw-modal-overlay');
  if (el) el.remove();
}

function openEditAccount(id) {
  const accounts = loadData('sabolli_accounts')||[];
  const a = accounts.find(x => x.id === id);
  if (!a) return;
  const existing = document.getElementById('edit-account-popup');
  if (existing) existing.remove();
  const popup = document.createElement('div');
  popup.id = 'edit-account-popup';
  popup.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5)';
  popup.innerHTML = `
    <div style="background:#fff;border-radius:20px;padding:24px;width:min(340px,92vw);box-shadow:0 20px 60px rgba(0,0,0,0.3)">
      <div style="font-weight:800;font-size:16px;color:#1E293B;margin-bottom:18px">✏️ Editar Conta</div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div>
          <label style="font-size:12px;font-weight:700;color:#64748B;display:block;margin-bottom:4px">NOME</label>
          <input id="edit-acc-name" value="${a.name||''}" class="form-input" style="width:100%;box-sizing:border-box" placeholder="Nome da conta">
        </div>
        <div>
          <label style="font-size:12px;font-weight:700;color:#64748B;display:block;margin-bottom:4px">BANCO / INSTITUIÇÃO</label>
          <input id="edit-acc-bank" value="${a.bank||''}" class="form-input" style="width:100%;box-sizing:border-box" placeholder="Ex: Itaú">
        </div>
        <div>
          <label style="font-size:12px;font-weight:700;color:#64748B;display:block;margin-bottom:4px">SALDO ATUAL (R$)</label>
          <input id="edit-acc-balance" type="number" step="0.01" value="${a.balance||0}" class="form-input" style="width:100%;box-sizing:border-box" placeholder="0,00">
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:20px">
        <button onclick="saveEditAccount(${id})" class="btn-primary" style="flex:1">Salvar</button>
        <button onclick="document.getElementById('edit-account-popup').remove()" class="btn-secondary">Cancelar</button>
      </div>
    </div>`;
  popup.addEventListener('click', e => { if (e.target === popup) popup.remove(); });
  document.body.appendChild(popup);
  document.getElementById('edit-acc-name').focus();
}

function saveEditAccount(id) {
  const accounts = loadData('sabolli_accounts')||[];
  const idx = accounts.findIndex(a => a.id === id);
  if (idx === -1) return;
  const name = (document.getElementById('edit-acc-name').value||'').trim();
  if (!name) { toast('Informe o nome da conta','error'); return; }
  accounts[idx].name = name;
  accounts[idx].bank = document.getElementById('edit-acc-bank').value.trim();
  accounts[idx].balance = Number(document.getElementById('edit-acc-balance').value)||0;
  saveData('sabolli_accounts', accounts);
  document.getElementById('edit-account-popup')?.remove();
  toast('Conta atualizada!');
  navigateTo('accounts');
}

function openAccountColorPicker(id, currentColor) {
  const existing = document.getElementById('acc-color-picker-popup');
  if (existing) existing.remove();
  const presets = [
    '#1E3A8A','#2563EB','#0EA5E9','#0891B2',
    '#065F46','#1a6b3c','#10B981','#16A34A',
    '#6B21A8','#7C3AED','#DB2777','#BE185D',
    '#991B1B','#DC2626','#D97706','#EA580C',
    '#334155','#475569','#1C1917','#713F12'
  ];
  const popup = document.createElement('div');
  popup.id = 'acc-color-picker-popup';
  popup.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5)';
  popup.innerHTML = `
    <div style="background:#fff;border-radius:20px;padding:22px;width:min(320px,90vw);box-shadow:0 20px 60px rgba(0,0,0,0.3)">
      <div style="font-weight:800;font-size:15px;color:#1E293B;margin-bottom:14px">🎨 Cor do cartão</div>
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:14px">
        ${presets.map(c=>`<button onclick="changeAccountColor(${id},'${c}')" style="width:44px;height:44px;border-radius:10px;background:${c};border:${c===currentColor?'3px solid #fff':'2px solid transparent'};box-shadow:${c===currentColor?'0 0 0 2px '+c+',0 0 0 4px #fff':'0 1px 4px rgba(0,0,0,0.2)'};cursor:pointer;transition:transform .15s" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform=''"></button>`).join('')}
      </div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
        <label style="font-size:13px;font-weight:600;color:#475569;flex:1">Cor personalizada:</label>
        <input type="color" value="${currentColor}" oninput="changeAccountColor(${id},this.value)" style="width:48px;height:36px;border:none;border-radius:8px;cursor:pointer;padding:2px">
      </div>
      <button onclick="document.getElementById('acc-color-picker-popup').remove()" style="width:100%;padding:10px;border-radius:12px;background:#F1F5F9;border:none;font-size:14px;font-weight:700;color:#475569;cursor:pointer">Fechar</button>
    </div>`;
  popup.addEventListener('click', e => { if (e.target === popup) popup.remove(); });
  document.body.appendChild(popup);
}

function changeAccountColor(id, color) {
  const accounts = loadData('sabolli_accounts')||[];
  const idx = accounts.findIndex(a => a.id === id);
  if (idx === -1) return;
  accounts[idx].color = color;
  saveData('sabolli_accounts', accounts);
  document.getElementById('acc-color-picker-popup')?.remove();
  navigateTo('accounts');
}

function selectExpenseCard(cardId) {
  const hidden = document.getElementById('ce-card');
  if (hidden) hidden.value = cardId;
  document.querySelectorAll('.ce-card-opt').forEach(el=>el.classList.remove('selected'));
  const opt = document.getElementById('ce-card-opt-'+cardId);
  if (opt) opt.classList.add('selected');
  const section = document.getElementById('card-expense-section');
  if (!section) return;
  const card = (loadData('sabolli_accounts')||[]).find(a=>a.id===cardId);
  if (card) {
    const brand = CARD_BRANDS[card.cardBrand]||CARD_BRANDS.outro;
    section.style.background = `linear-gradient(135deg,${brand.bg}18,${brand.bg}08)`;
    section.style.borderColor = `${brand.bg}55`;
  }
}

function showCardExpenseForm(cardId) {
  const el = document.getElementById('card-expense-section');
  if (!el) return;
  el.style.display = 'block';
  el.scrollIntoView({behavior:'smooth'});
  if (cardId) setTimeout(()=>selectExpenseCard(cardId), 50);
}

function hideCardExpenseForm() {
  const el = document.getElementById('card-expense-section');
  if (el) el.style.display = 'none';
}

function updateInstallPreview() {
  const value = Number(document.getElementById('ce-value').value)||0;
  const n = Number(document.getElementById('ce-inst').value)||1;
  const prev = document.getElementById('install-preview');
  if (!prev) return;
  if (n>1&&value>0) {
    prev.style.display='block';
    prev.textContent = `${n}x de ${fmt(value/n)} — Total: ${fmt(value)}`;
  } else { prev.style.display='none'; }
}

function saveCardExpense() {
  const cardId = Number(document.getElementById('ce-card').value);
  const desc = (document.getElementById('ce-desc').value||'').trim();
  const value = Number(document.getElementById('ce-value').value);
  const date = document.getElementById('ce-date').value||todayStr();
  const installments = Number(document.getElementById('ce-inst').value)||1;
  const category = document.getElementById('ce-cat').value;
  if (!cardId) { toast('Selecione o cartão','error'); return; }
  if (!desc) { toast('Informe a descrição','error'); return; }
  if (!value||value<=0) { toast('Informe o valor','error'); return; }
  const expenses = loadData('sabolli_card_expenses')||[];
  const baseRef = getCardReferenceMonth(cardId, date);
  const installValue = Math.round(value/installments*100)/100;
  for (let i=0; i<installments; i++) {
    const refMonth = addMonths(baseRef, i);
    expenses.push({
      id:nextId(expenses), cardId,
      desc: installments>1?`${desc} (${i+1}/${installments})`:desc,
      value:installValue, date, installments, installmentNum:i+1, category, referenceMonth:refMonth
    });
  }
  saveData('sabolli_card_expenses', expenses);
  toast(installments>1?`Lançado em ${installments}x no cartão!`:'Gasto lançado no cartão!');
  navigateTo('accounts');
}

function deleteCardExpense(id) {
  customConfirm('Excluir este lançamento do cartão?', () => {
    saveData('sabolli_card_expenses', (loadData('sabolli_card_expenses')||[]).filter(e=>e.id!==id));
    toast('Lançamento excluído');
    if (currentBillCardId) renderCardBillContent(currentBillCardId, currentBillMonth);
  });
}

function showCardBill(cardId) {
  currentBillCardId = cardId;
  currentBillMonth = getCardReferenceMonth(cardId, todayStr());
  const el = document.getElementById('card-bill-section');
  if (!el) return;
  el.style.display='block';
  el.scrollIntoView({behavior:'smooth'});
  renderCardBillContent(cardId, currentBillMonth);
}

function hideCardBill() {
  const el = document.getElementById('card-bill-section');
  if (el) el.style.display='none';
  currentBillCardId=null; currentBillMonth=null;
}

function navigateBillMonth(dir) {
  if (!currentBillMonth) return;
  currentBillMonth = addMonths(currentBillMonth, dir);
  renderCardBillContent(currentBillCardId, currentBillMonth);
}

function renderCardBillContent(cardId, monthStr) {
  const card = (loadData('sabolli_accounts')||[]).find(a=>a.id===cardId);
  if (!card) return;
  const expenses = (loadData('sabolli_card_expenses')||[]).filter(e=>e.cardId===cardId&&e.referenceMonth===monthStr).sort((a,b)=>b.date.localeCompare(a.date));
  const total = expenses.reduce((s,e)=>s+(e.value||0),0);
  const brand = CARD_BRANDS[card.cardBrand]||CARD_BRANDS.outro;
  const titleEl = document.getElementById('card-bill-title');
  if (titleEl) titleEl.textContent = `Fatura ${card.name} — ${fmtMonth(monthStr)}`;
  const content = document.getElementById('card-bill-content');
  if (!content) return;
  content.innerHTML = `
    <div class="month-nav">
      <button class="month-nav-btn" onclick="navigateBillMonth(-1)">‹</button>
      <div class="month-nav-label">${fmtMonth(monthStr)}</div>
      <button class="month-nav-btn" onclick="navigateBillMonth(1)">›</button>
    </div>
    <div style="background:linear-gradient(135deg,${brand.bg},${brand.bg}99);border-radius:12px;padding:14px 16px;color:#fff;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-size:10px;opacity:0.7;text-transform:uppercase;letter-spacing:0.5px">Total da Fatura</div>
        <div style="font-size:26px;font-weight:900">${fmt(total)}</div>
        ${card.dueDay?`<div style="font-size:11px;opacity:0.65">Vence dia ${card.dueDay}</div>`:''}
      </div>
      <div>${brand.logo}</div>
    </div>
    ${expenses.length>0?expenses.map(e=>`<div class="card-bill-item">
      <div><div class="cbi-desc">${e.desc}</div><div class="cbi-meta">${fmtDate(e.date)} · ${e.category||''}</div></div>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="cbi-value">${fmt(e.value)}</div>
        <button onclick="deleteCardExpense(${e.id})" style="background:#FEF2F2;border:none;border-radius:6px;color:#EF4444;padding:4px 7px;cursor:pointer;font-size:11px">🗑</button>
      </div>
    </div>`).join(''):`<div class="empty-state"><div class="empty-icon">💳</div><p>Nenhum gasto nesta fatura</p></div>`}`;
}

// ===== CMV =====
function renderCmv(c) {
  const orders = loadData('sabolli_orders')||[];
  const products = loadData('sabolli_products')||[];
  const filtered = filterByPeriod(orders,'date');
  const fat = filtered.reduce((s,o)=>s+(o.total||0),0);
  const cmvEst = fat*0.438;
  const margin = fat>0?(fat-cmvEst)/fat*100:0;
  const prodSales = {};
  filtered.forEach(o=>{
    (o.items||[]).forEach(i=>{
      if (typeof i==='object') {
        prodSales[i.id] = (prodSales[i.id]||{name:i.name,qty:0,revenue:0,cost:0});
        prodSales[i.id].qty += (i.qty||1);
        prodSales[i.id].revenue += (i.price||0)*(i.qty||1);
        const prod = products.find(p=>p.id===i.id);
        prodSales[i.id].cost += (prod?prod.cost:0)*(i.qty||1);
      }
    });
  });
  const rows = Object.values(prodSales).sort((a,b)=>b.revenue-a.revenue);
  c.innerHTML = `
  <div class="kpi-mini-row">
    <div class="kpi-mini"><div class="kpi-mini-label">Faturamento</div><div class="kpi-mini-value">${fmt(fat)}</div></div>
    <div class="kpi-mini"><div class="kpi-mini-label">CMV Est.</div><div class="kpi-mini-value" style="color:#EF4444">${fmt(cmvEst)}</div></div>
    <div class="kpi-mini"><div class="kpi-mini-label">Margem Bruta</div><div class="kpi-mini-value" style="color:#10B981">${margin.toFixed(1)}%</div></div>
  </div>
  <div class="section-card">
    <div class="section-title">📉 CMV por Produto</div>
    ${rows.length>0?`<div style="overflow-x:auto"><table class="mini-table">
      <thead><tr><th>Produto</th><th>Qtd.</th><th>Receita</th><th>Custo Est.</th><th>Margem</th></tr></thead>
      <tbody>${rows.map(r=>{
        const mg = r.revenue>0?((r.revenue-r.cost)/r.revenue*100):0;
        return `<tr><td><strong>${r.name}</strong></td><td>${r.qty}</td><td>${fmt(r.revenue)}</td><td>${fmt(r.cost)}</td><td style="color:${mg>40?'#10B981':'#F97316'};font-weight:700">${mg.toFixed(1)}%</td></tr>`;
      }).join('')}</tbody>
    </table></div>`:'<div class="empty-state"><div class="empty-icon">📉</div><p>Sem dados de vendas no período</p></div>'}
    <div style="margin-top:14px;padding:12px;background:#FFF7ED;border-radius:10px;font-size:12px;color:#92400E">
      <strong>Nota:</strong> CMV estimado com base no custo cadastrado de cada produto. Configure custos em Produtos para maior precisão.
    </div>
  </div>`;
}

// ===== TICKET MÉDIO =====
function renderTicket(c) {
  const orders = loadData('sabolli_orders')||[];
  const filtered = filterByPeriod(orders,'date');
  const fat = filtered.reduce((s,o)=>s+(o.total||0),0);
  const count = filtered.length;
  const ticket = count>0?fat/count:0;
  const byCanal = {};
  filtered.forEach(o=>{ if(!byCanal[o.canal])byCanal[o.canal]={count:0,total:0}; byCanal[o.canal].count++; byCanal[o.canal].total+=o.total||0; });
  c.innerHTML = `
  <div class="kpi-mini-row">
    <div class="kpi-mini"><div class="kpi-mini-label">Ticket Médio</div><div class="kpi-mini-value" style="color:#F97316">${fmt(ticket)}</div></div>
    <div class="kpi-mini"><div class="kpi-mini-label">Pedidos</div><div class="kpi-mini-value">${count}</div></div>
    <div class="kpi-mini"><div class="kpi-mini-label">Faturamento</div><div class="kpi-mini-value">${fmt(fat)}</div></div>
  </div>
  <div class="section-card">
    <div class="section-title">🎫 Ticket Médio por Canal</div>
    ${Object.entries(byCanal).map(([canal,data])=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border)">
      <div><div style="font-weight:600">${canal}</div><div style="font-size:12px;color:#94A3B8">${data.count} pedidos</div></div>
      <div style="text-align:right"><div style="font-weight:800;color:#2563EB">${fmt(data.total/data.count)}</div><div style="font-size:12px;color:#94A3B8">Total: ${fmt(data.total)}</div></div>
    </div>`).join('') || '<div class="empty-state"><div class="empty-icon">🎫</div><p>Sem dados no período</p></div>'}
  </div>`;
}

// ===== METAS =====
function renderGoals(c) {
  const goals = loadData('sabolli_goals')||[];
  const orders = loadData('sabolli_orders')||[];
  const monthOrders = filterByPeriod(orders,'date');
  const monthFat = monthOrders.reduce((s,o)=>s+(o.total||0),0);
  const monthCmv = monthFat*0.438;
  const monthLucro = monthFat-monthCmv;
  const auto = {1:monthFat,2:monthLucro};
  c.innerHTML = `
  <div class="section-card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px">
      <div class="section-title" style="margin:0">🎯 Metas</div>
      <button class="btn-outline" onclick="toggleAddGoal()">+ Nova Meta</button>
    </div>
    <div id="add-goal-form" style="display:none;background:#F8FAFF;border-radius:12px;padding:14px;margin-bottom:14px;border:1.5px solid #DBEAFE">
      <div class="section-title">Nova Meta</div>
      <div class="form-group"><label class="form-label">Nome da Meta</label><input id="goal-name" class="form-input" type="text" placeholder="Ex: Faturamento Mensal"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Valor Atual (R$)</label><input id="goal-current" class="form-input" type="number" step="0.01" placeholder="0,00"></div>
        <div class="form-group"><label class="form-label">Meta (R$)</label><input id="goal-target" class="form-input" type="number" step="0.01" placeholder="0,00"></div>
      </div>
      <div style="display:flex;gap:8px"><button class="btn-primary" style="flex:1" onclick="saveGoal()">Salvar</button><button class="btn-secondary" onclick="toggleAddGoal()">Cancelar</button></div>
    </div>
    ${goals.map(g=>{
      const current = auto[g.id]!==undefined ? auto[g.id] : (g.current||0);
      const pct = g.target>0 ? Math.min(Math.round(current/g.target*100),100) : 0;
      return `<div class="goal-item">
        <div class="goal-header"><span class="goal-label">${g.name}</span><span class="goal-pct" style="color:${pct>=100?'#10B981':pct>=70?'#F97316':'#EF4444'}">${pct}%</span></div>
        <div class="goal-values">${fmt(current)} / ${fmt(g.target)}</div>
        <div class="goal-bar-wrap"><div class="goal-bar" style="width:${pct}%;background:${g.color||'#2563EB'}"></div></div>
        <button class="btn-danger" onclick="deleteGoal(${g.id})" style="margin-top:6px;font-size:11px">Remover</button>
      </div>`;
    }).join('') || '<div class="empty-state"><div class="empty-icon">🎯</div><p>Nenhuma meta cadastrada</p></div>'}
  </div>`;
}

function toggleAddGoal() {
  const f = document.getElementById('add-goal-form');
  if (f) f.style.display = f.style.display==='none'?'block':'none';
}

function saveGoal() {
  const name = (document.getElementById('goal-name').value||'').trim();
  if (!name) { toast('Informe o nome da meta','error'); return; }
  const goals = loadData('sabolli_goals')||[];
  const colors = ['#10B981','#2563EB','#F97316','#7C3AED','#EF4444','#F59E0B'];
  goals.push({ id:nextId(goals), name, current:Number(document.getElementById('goal-current').value)||0, target:Number(document.getElementById('goal-target').value)||0, color:colors[goals.length%colors.length] });
  saveData('sabolli_goals', goals);
  toast('Meta salva!');
  navigateTo('goals');
}

function deleteGoal(id) {
  customConfirm('Remover esta meta?', () => {
    saveData('sabolli_goals', (loadData('sabolli_goals')||[]).filter(g=>g.id!==id));
    navigateTo('goals');
  });
}

// ===== PONTOS DE REVENDA =====
function renderResellers(c) {
  const orders = loadData('sabolli_orders')||[];
  const products = loadData('sabolli_products')||[];
  const resellers = loadData('sabolli_resellers')||[];
  const revOrders = orders.filter(o=>o.canal==='Revenda');
  const pendingOrders = revOrders.filter(o=>o.status==='Pendente');

  // Agregar por ponto
  const byPoint = {};
  revOrders.forEach(o=>{
    const key = o.customer;
    if (!byPoint[key]) byPoint[key] = { name:key, orders:[], total:0, units:0, products:{}, lucroBruto:0 };
    byPoint[key].orders.push(o);
    byPoint[key].total += o.total||0;
    (o.items||[]).forEach(item=>{
      if (typeof item==='object') {
        byPoint[key].units += (item.qty||1);
        const pname = item.name;
        if (!byPoint[key].products[pname]) byPoint[key].products[pname] = 0;
        byPoint[key].products[pname] += item.qty||1;
        const prod = products.find(p=>p.id===item.id);
        byPoint[key].lucroBruto += ((item.price||0) - (prod?prod.cost:0)) * (item.qty||1);
      }
    });
  });
  const points = Object.values(byPoint).sort((a,b)=>b.total-a.total);
  const maxTotal = points.length>0 ? points[0].total : 1;

  const regInfo = resellers.length>0 ? resellers.map(r=>
    `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
      <div><div style="font-weight:700;font-size:14px">${r.name}</div><div style="font-size:12px;color:#94A3B8">${r.phone||''}${r.address?' · '+r.address:''}</div></div>
      <button class="btn-danger" onclick="deleteReseller(${r.id})" style="padding:4px 8px">🗑</button>
    </div>`).join('') : '<div style="font-size:13px;color:#94A3B8;padding:8px 0">Nenhum ponto cadastrado ainda.</div>';

  c.innerHTML = `
  <div class="section-card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px">
      <div class="section-title" style="margin:0">🏪 Cadastro de Pontos</div>
      <button class="btn-outline" onclick="toggleAddReseller()">+ Novo Ponto</button>
    </div>
    <div id="add-reseller-form" style="display:none;background:#F8FAFF;border-radius:12px;padding:14px;margin-bottom:14px;border:1.5px solid #DBEAFE">
      <div class="section-title">Novo Ponto de Revenda</div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Nome do Ponto</label><input id="res-name" class="form-input" type="text" placeholder="Ex: Padaria Central"></div>
        <div class="form-group"><label class="form-label">Telefone / WhatsApp</label><input id="res-phone" class="form-input" type="tel" placeholder="(11) 99999-9999"></div>
      </div>
      <div class="form-group"><label class="form-label">Endereço</label><input id="res-address" class="form-input" type="text" placeholder="Rua, número, bairro..."></div>
      <div class="form-group"><label class="form-label">Responsável</label><input id="res-contact" class="form-input" type="text" placeholder="Nome do responsável"></div>
      <div style="display:flex;gap:8px"><button class="btn-primary" style="flex:1" onclick="saveReseller()">Salvar</button><button class="btn-secondary" onclick="toggleAddReseller()">Cancelar</button></div>
    </div>
    ${regInfo}
  </div>

  ${pendingOrders.length>0?`
  <div class="section-card" style="border:2px solid #F97316">
    <div class="section-title">⏳ Pedidos a Entregar (${pendingOrders.length})</div>
    <div style="overflow-x:auto"><table class="mini-table">
      <thead><tr><th>#</th><th>Data</th><th>Ponto</th><th>Produtos</th><th>Total</th><th></th></tr></thead>
      <tbody>${pendingOrders.sort((a,b)=>a.date.localeCompare(b.date)).map(o=>{
        const items = (o.items||[]).filter(i=>typeof i==='object').map(i=>`${i.name}${i.qty>1?' ×'+i.qty:''}`).join(', ');
        return `<tr>
          <td><strong>#${o.id}</strong></td><td>${fmtDate(o.date)}</td><td>${o.customer}</td>
          <td style="max-width:180px;font-size:12px">${items}</td>
          <td>${fmt(o.total)}</td>
          <td><button class="btn-success" onclick="markOrderPaid(${o.id})">✓ Entregar</button></td>
        </tr>`;
      }).join('')}</tbody>
    </table></div>
  </div>`:''}

  <div class="section-card">
    <div class="section-title">📊 Desempenho por Ponto</div>
    ${points.length===0?'<div class="empty-state"><div class="empty-icon">🏪</div><p>Nenhuma venda de revenda registrada</p></div>':
    points.map(pt=>{
      const pct = maxTotal>0 ? Math.round(pt.total/maxTotal*100) : 0;
      const lucroLiq = pt.lucroBruto * 0.8;
      const topProds = Object.entries(pt.products).sort((a,b)=>b[1]-a[1]).slice(0,3);
      return `<div style="background:#F8FAFC;border-radius:14px;padding:14px;margin-bottom:12px;border:1px solid var(--border)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
          <div>
            <div style="font-weight:800;font-size:15px">${pt.name}</div>
            <div style="font-size:12px;color:#94A3B8">${pt.orders.length} pedido${pt.orders.length!==1?'s':''} · ${pt.units} unidades</div>
          </div>
          <div style="text-align:right">
            <div style="font-weight:900;font-size:16px;color:#2563EB">${fmt(pt.total)}</div>
            <div style="font-size:11px;color:#94A3B8">faturamento total</div>
          </div>
        </div>
        <div style="height:8px;background:#E2E8F0;border-radius:4px;margin-bottom:10px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:#2563EB;border-radius:4px"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
          <div style="background:#F0FDF4;border-radius:10px;padding:8px 10px">
            <div style="font-size:10px;color:#065F46;font-weight:700">LUCRO BRUTO EST.</div>
            <div style="font-size:14px;font-weight:800;color:#10B981">${fmt(pt.lucroBruto)}</div>
          </div>
          <div style="background:#EFF6FF;border-radius:10px;padding:8px 10px">
            <div style="font-size:10px;color:#1E3A8A;font-weight:700">LUCRO LÍQUIDO EST.</div>
            <div style="font-size:14px;font-weight:800;color:#2563EB">${fmt(lucroLiq)}</div>
          </div>
        </div>
        ${topProds.length>0?`<div style="font-size:12px;color:#64748B;font-weight:600;margin-bottom:5px">Mais pedidos:</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          ${topProds.map(([name,qty])=>`<span style="background:#fff;border:1px solid #E2E8F0;border-radius:8px;padding:3px 8px;font-size:12px;font-weight:600">${name} <span style="color:#2563EB">×${qty}</span></span>`).join('')}
        </div>`:''}
      </div>`;
    }).join('')}
  </div>

  ${points.length>0?`
  <div class="section-card">
    <div class="section-title">🛒 Produtos Mais Pedidos por Ponto</div>
    <div style="overflow-x:auto"><table class="mini-table">
      <thead><tr><th>Ponto</th><th>Produto</th><th>Qtd.</th><th>Ticket Médio</th></tr></thead>
      <tbody>${points.flatMap(pt=>
        Object.entries(pt.products).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([name,qty])=>`<tr>
          <td>${pt.name}</td><td>${name}</td><td><strong>${qty}</strong></td>
          <td>${fmt(pt.total/pt.orders.length)}</td>
        </tr>`)
      ).join('')}</tbody>
    </table></div>
  </div>`:''}`;
}

function toggleAddReseller() {
  const f = document.getElementById('add-reseller-form');
  if (f) f.style.display = f.style.display==='none'?'block':'none';
}

function saveReseller() {
  const name = (document.getElementById('res-name').value||'').trim();
  if (!name) { toast('Informe o nome do ponto','error'); return; }
  const resellers = loadData('sabolli_resellers')||[];
  resellers.push({ id:nextId(resellers), name, phone:document.getElementById('res-phone').value, address:document.getElementById('res-address').value, contact:document.getElementById('res-contact').value });
  saveData('sabolli_resellers', resellers);
  toast('Ponto cadastrado!');
  navigateTo('resellers');
}

function deleteReseller(id) {
  customConfirm('Excluir este ponto de revenda?', () => {
    saveData('sabolli_resellers', (loadData('sabolli_resellers')||[]).filter(r=>r.id!==id));
    toast('Ponto excluído');
    navigateTo('resellers');
  });
}

// ===== FORNECEDORES =====
function renderSuppliers(c) {
  const suppliers = loadData('sabolli_suppliers')||[];
  const purchases = loadData('sabolli_purchases')||[];
  c.innerHTML = `
  <div class="section-card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px">
      <div class="section-title" style="margin:0">🤝 ${suppliers.length} fornecedor(es)</div>
      <button class="btn-outline" onclick="toggleAddSupplier()">+ Novo Fornecedor</button>
    </div>
    <div id="add-supplier-form" style="display:none;background:#F8FAFF;border-radius:12px;padding:14px;margin-bottom:14px;border:1.5px solid #DBEAFE">
      <div class="section-title">Novo Fornecedor</div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Nome</label><input id="sup-name" class="form-input" type="text" placeholder="Nome da empresa/fornecedor"></div>
        <div class="form-group"><label class="form-label">Telefone / WhatsApp</label><input id="sup-phone" class="form-input" type="tel" placeholder="(11) 99999-9999"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Contato</label><input id="sup-contact" class="form-input" type="text" placeholder="Nome do responsável"></div>
        <div class="form-group"><label class="form-label">Categoria</label>
          <select id="sup-cat" class="form-select"><option>Laticínios</option><option>Carnes</option><option>Farináceos</option><option>Doces</option><option>Embalagens</option><option>Geral</option></select>
        </div>
      </div>
      <div class="form-group"><label class="form-label">Produtos que fornece</label><input id="sup-products" class="form-input" type="text" placeholder="Ex: Leite, Manteiga, Queijo..."></div>
      <div style="display:flex;gap:8px"><button class="btn-primary" style="flex:1" onclick="saveSupplier()">Salvar</button><button class="btn-secondary" onclick="toggleAddSupplier()">Cancelar</button></div>
    </div>
    ${suppliers.length===0?'<div class="empty-state"><div class="empty-icon">🤝</div><p>Nenhum fornecedor cadastrado</p></div>':
    `<div style="display:flex;flex-direction:column;gap:10px">
      ${suppliers.map(s=>{
        const supPurchases = purchases.filter(p=>p.supplier===s.name);
        const totalGasto = supPurchases.reduce((acc,p)=>acc+(p.total||0),0);
        return `<div style="background:#F8FAFC;border-radius:14px;padding:14px;border:1px solid var(--border)">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <div style="font-weight:800;font-size:15px">${s.name}</div>
              <div style="font-size:12px;color:#94A3B8;margin-top:2px">${s.category||''}${s.contact?' · '+s.contact:''}</div>
              ${s.phone?`<div style="font-size:12px;color:#2563EB;margin-top:2px">📞 ${s.phone}</div>`:''}
              ${s.products?`<div style="font-size:12px;color:#64748B;margin-top:4px">🧂 ${s.products}</div>`:''}
            </div>
            <div style="text-align:right">
              ${supPurchases.length>0?`<div style="font-weight:800;color:#2563EB">${fmt(totalGasto)}</div><div style="font-size:11px;color:#94A3B8">${supPurchases.length} compra(s)</div>`:''}
              <button class="btn-danger" onclick="deleteSupplier(${s.id})" style="margin-top:6px;padding:4px 8px">🗑</button>
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>`}
  </div>`;
}

function toggleAddSupplier() {
  const f = document.getElementById('add-supplier-form');
  if (f) f.style.display = f.style.display==='none'?'block':'none';
}

function saveSupplier() {
  const name = (document.getElementById('sup-name').value||'').trim();
  if (!name) { toast('Informe o nome','error'); return; }
  const suppliers = loadData('sabolli_suppliers')||[];
  suppliers.push({ id:nextId(suppliers), name, phone:document.getElementById('sup-phone').value, contact:document.getElementById('sup-contact').value, category:document.getElementById('sup-cat').value, products:document.getElementById('sup-products').value });
  saveData('sabolli_suppliers', suppliers);
  toast('Fornecedor salvo!');
  navigateTo('suppliers');
}

function deleteSupplier(id) {
  customConfirm('Excluir este fornecedor?', () => {
    saveData('sabolli_suppliers', (loadData('sabolli_suppliers')||[]).filter(s=>s.id!==id));
    toast('Fornecedor excluído');
    navigateTo('suppliers');
  });
}

// ===== PLANEJAMENTO FINANCEIRO =====
function renderPlanning(c) {
  const rules = loadData('sabolli_planning')||[];
  const txs = loadData('sabolli_financial_transactions')||[];
  const cm = currentMonthStr();
  const monthTxs = txs.filter(t=>t.date&&t.date.startsWith(cm));
  const totalIncome = monthTxs.filter(t=>t.type==='entrada'&&(t.extractType==='negocio'||!t.extractType)).reduce((s,t)=>s+(t.value||0),0);
  const totalPct = rules.reduce((s,r)=>s+(r.percentage||0),0);

  // Gastos por categoria no mês
  const spendByCat = {};
  monthTxs.filter(t=>t.type==='saída').forEach(t=>{
    const cat = t.category||'Outros';
    spendByCat[cat] = (spendByCat[cat]||0)+(t.value||0);
  });
  const topSpend = Object.entries(spendByCat).sort((a,b)=>b[1]-a[1]);

  // Alertas automáticos
  const alerts = [];
  if (topSpend.length>=2) {
    const [top1, top2] = topSpend;
    if (top1[1] > top2[1]*2) alerts.push(`Você está gastando muito mais em <strong>${top1[0]}</strong> (${fmt(top1[1])}) do que em outras categorias.`);
  }
  rules.forEach(r=>{
    const expected = totalIncome*(r.percentage/100);
    const actual = spendByCat[r.label]||0;
    if (actual > expected*1.2 && expected>0) alerts.push(`🔴 <strong>${r.label}</strong>: gasto (${fmt(actual)}) acima do planejado (${fmt(expected)}).`);
    if (actual < expected*0.5 && expected>0 && totalIncome>0) alerts.push(`🟡 <strong>${r.label}</strong>: ainda não alocou o suficiente. Planejado: ${fmt(expected)}, Alocado: ${fmt(actual)}.`);
  });

  c.innerHTML = `
  <div class="section-card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px">
      <div class="section-title" style="margin:0">📐 Divisão de Renda</div>
      <button class="btn-outline" onclick="toggleAddRule()">+ Nova Regra</button>
    </div>
    <div style="background:#EFF6FF;border-radius:10px;padding:10px 14px;margin-bottom:14px;font-size:13px">
      <span style="font-weight:700;color:#1E3A8A">Receita este mês: ${fmt(totalIncome)}</span>
      <span style="margin-left:10px;color:${totalPct>100?'#EF4444':'#10B981'};font-weight:600">${totalPct}% alocado${totalPct>100?' ⚠ excede 100%':totalPct===100?' ✅':''}</span>
    </div>
    <div id="add-rule-form" style="display:none;background:#F8FAFF;border-radius:12px;padding:14px;margin-bottom:14px;border:1.5px solid #DBEAFE">
      <div class="section-title">Nova Regra de Distribuição</div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Destino (Ex: Mercadoria, Reserva...)</label><input id="rule-label" class="form-input" type="text" placeholder="Ex: Reserva de Emergência"></div>
        <div class="form-group"><label class="form-label">Porcentagem (%)</label><input id="rule-pct" class="form-input" type="number" min="1" max="100" placeholder="Ex: 60"></div>
      </div>
      <div style="display:flex;gap:8px"><button class="btn-primary" style="flex:1" onclick="saveRule()">Salvar</button><button class="btn-secondary" onclick="toggleAddRule()">Cancelar</button></div>
    </div>
    ${rules.length===0?`<div style="padding:16px;text-align:center;color:#94A3B8;font-size:13px">
      <div style="font-size:28px;margin-bottom:8px">📐</div>
      <p>Defina como dividir sua renda. Ex:<br><strong>60%</strong> → Mercadoria · <strong>20%</strong> → Reserva · <strong>20%</strong> → Retirada</p>
    </div>`:
    rules.map(r=>{
      const expected = totalIncome*(r.percentage/100);
      const actual = spendByCat[r.label]||0;
      const pct = expected>0?Math.min(100,Math.round(actual/expected*100)):0;
      const barColor = pct>100?'#EF4444':pct>70?'#10B981':'#F59E0B';
      return `<div style="padding:12px 0;border-bottom:1px solid var(--border)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div>
            <span style="font-weight:700">${r.label}</span>
            <span style="margin-left:8px;font-size:12px;color:#94A3B8">${r.percentage}% da receita</span>
          </div>
          <div style="text-align:right">
            <div style="font-size:14px;font-weight:800;color:#2563EB">${fmt(expected)}</div>
            <div style="font-size:11px;color:#94A3B8">esperado no mês</div>
          </div>
        </div>
        <div style="height:8px;background:#E2E8F0;border-radius:4px;overflow:hidden;margin-bottom:5px">
          <div style="height:100%;width:${pct}%;background:${barColor};border-radius:4px;transition:width .3s"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:#94A3B8">
          <span>Gasto nesta categoria: ${fmt(actual)}</span>
          <button onclick="deletePlanRule(${r.id})" style="background:none;border:none;color:#EF4444;cursor:pointer;font-size:11px">Remover</button>
        </div>
      </div>`;
    }).join('')}
  </div>

  ${alerts.length>0?`
  <div class="section-card" style="border:2px solid #F59E0B">
    <div class="section-title">⚠️ Alertas e Recomendações</div>
    ${alerts.map(a=>`<div style="padding:10px 12px;background:#FFFBEB;border-radius:10px;margin-bottom:8px;font-size:13px;color:#92400E;line-height:1.5">${a}</div>`).join('')}
  </div>`:''}

  <div class="section-card">
    <div class="section-title">📊 Gastos por Categoria — ${fmtMonth(cm)}</div>
    ${topSpend.length===0?'<div class="empty-state"><div class="empty-icon">📊</div><p>Sem gastos este mês</p></div>':
    topSpend.slice(0,8).map(([cat,val])=>{
      const maxVal = topSpend[0][1]||1;
      const pct = Math.round(val/maxVal*100);
      return `<div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
          <span style="font-weight:600">${cat}</span><span style="color:#2563EB;font-weight:700">${fmt(val)}</span>
        </div>
        <div style="height:7px;background:#E2E8F0;border-radius:4px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:#2563EB;border-radius:4px"></div>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

function toggleAddRule() {
  const f = document.getElementById('add-rule-form');
  if (f) f.style.display = f.style.display==='none'?'block':'none';
}

function saveRule() {
  const label = (document.getElementById('rule-label').value||'').trim();
  const pct = Number(document.getElementById('rule-pct').value);
  if (!label) { toast('Informe o destino','error'); return; }
  if (!pct||pct<=0) { toast('Informe a porcentagem','error'); return; }
  const rules = loadData('sabolli_planning')||[];
  const totalPct = rules.reduce((s,r)=>s+(r.percentage||0),0);
  if (totalPct+pct>100) { toast('Total de % ultrapassaria 100%','warning'); return; }
  const colors = ['#2563EB','#10B981','#F97316','#7C3AED','#EF4444','#F59E0B'];
  rules.push({ id:nextId(rules), label, percentage:pct, color:colors[rules.length%colors.length] });
  saveData('sabolli_planning', rules);
  toast('Regra adicionada!');
  navigateTo('planning');
}

function deletePlanRule(id) {
  customConfirm('Remover esta regra?', () => {
    saveData('sabolli_planning', (loadData('sabolli_planning')||[]).filter(r=>r.id!==id));
    navigateTo('planning');
  });
}

// ===== TEMAS =====
function renderTemas(c) {
  const currentTheme = localStorage.getItem('sabolli_app_theme') || 'azul';
  const cards = Object.entries(APP_THEMES).map(([id, t]) => {
    const isActive = id === currentTheme;
    return `<div onclick="applyAppTheme('${id}');renderTemas(document.getElementById('content'))"
      style="cursor:pointer;border-radius:16px;overflow:hidden;border:${isActive?'3px solid '+t.accentV:'2px solid '+t.border};box-shadow:${isActive?'0 0 0 2px '+t.accentV+'44':'0 2px 8px rgba(0,0,0,0.08)'};transition:all .2s;transform:${isActive?'scale(1.03)':'scale(1)'}">
      <div style="background:${t.bg};padding:14px 14px 10px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <span style="font-size:20px">${t.emoji}</span>
          ${isActive?`<span style="background:${t.accentV};color:#fff;font-size:10px;font-weight:800;padding:2px 8px;border-radius:20px">ATIVO</span>`:''}
        </div>
        <div style="display:flex;gap:4px;margin-bottom:8px">
          <div style="flex:1;height:28px;border-radius:6px;background:${t.card};border:1px solid ${t.border}"></div>
          <div style="flex:1;height:28px;border-radius:6px;background:${t.accentV}"></div>
          <div style="flex:1;height:28px;border-radius:6px;background:${t.accent}"></div>
        </div>
        <div style="background:${t.card};border-radius:8px;padding:8px;border:1px solid ${t.border}">
          <div style="height:6px;border-radius:3px;background:${t.accentV};width:70%;margin-bottom:5px"></div>
          <div style="height:5px;border-radius:3px;background:${t.border};width:90%"></div>
        </div>
      </div>
      <div style="background:${t.card};padding:10px 14px;border-top:1px solid ${t.border}">
        <div style="font-weight:800;font-size:13px;color:${t.text}">${t.name}</div>
        <div style="font-size:11px;color:${t.textS};margin-top:1px">${t.dark?'Modo escuro':'Modo claro'}</div>
      </div>
    </div>`;
  }).join('');

  c.innerHTML = `
  <div class="section-card">
    <div class="section-title" style="margin-bottom:6px">🎨 Temas do App</div>
    <div style="font-size:13px;color:var(--text-sec);margin-bottom:18px">Escolha um tema para personalizar a aparência. Seus dados não são afetados.</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px">
      ${cards}
    </div>
  </div>`;
}

// ===== GERENCIAR CATEGORIAS =====
function renderCategories(c) {
  const cats = loadCategories();
  c.innerHTML = `
  <div class="section-card">
    <div class="section-title">💰 Categorias de Lançamentos Financeiros</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px">
      ${cats.transactions.map((cat,i)=>`
        <span class="cat-tag">${cat}
          <button onclick="deleteCategory('transactions',${i})" title="Remover">×</button>
        </span>`).join('')}
    </div>
    <div style="display:flex;gap:8px">
      <input id="cat-tx-input" class="form-input" type="text" placeholder="Ex: Combustível, Delivery, Mercado..." style="flex:1">
      <button class="btn-outline" onclick="saveCategory('transactions')">+ Adicionar</button>
    </div>
  </div>
  <div class="section-card">
    <div class="section-title">💳 Categorias de Gastos no Cartão</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px">
      ${cats.card.map((cat,i)=>`
        <span class="cat-tag">${cat}
          <button onclick="deleteCategory('card',${i})" title="Remover">×</button>
        </span>`).join('')}
    </div>
    <div style="display:flex;gap:8px">
      <input id="cat-card-input" class="form-input" type="text" placeholder="Ex: Combustível, Mercadoria, Delivery..." style="flex:1">
      <button class="btn-outline" onclick="saveCategory('card')">+ Adicionar</button>
    </div>
  </div>`;
}

function saveCategory(type) {
  const inputId = type==='transactions'?'cat-tx-input':'cat-card-input';
  const name = (document.getElementById(inputId).value||'').trim();
  if (!name) { toast('Informe o nome da categoria','error'); return; }
  const cats = loadCategories();
  if (cats[type].includes(name)) { toast('Categoria já existe','warning'); return; }
  cats[type].push(name);
  saveData('sabolli_categories', cats);
  toast('Categoria "'+name+'" adicionada!');
  navigateTo('categories');
}

function deleteCategory(type, idx) {
  const cats = loadCategories();
  const removed = cats[type][idx];
  cats[type].splice(idx, 1);
  saveData('sabolli_categories', cats);
  toast('"'+removed+'" removida');
  navigateTo('categories');
}

// ===== CONFIGURAÇÕES =====
function renderDelivery(c) {
  const s = loadData('sabolli_settings')||{delivery_fee:6};
  const deliveryTotal = loadData('sabolli_delivery_total')||0;
  const txs = loadData('sabolli_financial_transactions')||[];
  const deliveryTxs = txs.filter(t => t.deliveryFee && t.deliveryFee > 0);
  c.innerHTML = `
  <div class="section-card" style="background:linear-gradient(135deg,#ECFDF5,#D1FAE5);border:2px solid #6EE7B7">
    <div class="section-title" style="color:#065F46">🚴 Total Arrecadado com Taxas de Entrega</div>
    <div style="font-size:36px;font-weight:900;color:#059669;margin:10px 0 4px">${fmt(deliveryTotal)}</div>
    <div style="font-size:12px;color:#065F46;font-weight:600;margin-bottom:14px">${deliveryTxs.length} lançamento(s) com taxa registrado(s)</div>
    ${deliveryTxs.length>0?`<div style="max-height:180px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;margin-bottom:12px">
      ${[...deliveryTxs].sort((a,b)=>b.date.localeCompare(a.date)).map(t=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 10px;background:rgba(255,255,255,0.7);border-radius:8px;font-size:12px">
          <span style="color:#1E293B;font-weight:600">${t.desc}</span>
          <span style="color:#059669;font-weight:800">+${fmt(t.deliveryFee)}</span>
          <span style="color:#64748B">${fmtDate(t.date)}</span>
        </div>`).join('')}
    </div>`:''}
    <button onclick="customConfirm('Zerar o total de taxas de entrega?', ()=>{ saveData(\'sabolli_delivery_total\',0); navigateTo(\'delivery\'); })" style="width:100%;padding:10px;border-radius:10px;background:rgba(255,255,255,0.6);border:1.5px solid #6EE7B7;color:#065F46;font-weight:700;cursor:pointer;font-size:13px">🔄 Zerar total de taxas</button>
  </div>
  <div class="section-card">
    <div class="section-title">⚙️ Configurações de Entrega</div>
    <div class="form-group"><label class="form-label">Valor padrão da Taxa (R$)</label><input id="del-fee" class="form-input" type="number" step="0.50" value="${s.delivery_fee||6}"></div>
    <div class="form-group"><label class="form-label">Área de Entrega</label><input id="del-area" class="form-input" type="text" value="${s.delivery_area||''}" placeholder="Ex: Santo André e região"></div>
    <button class="btn-primary" onclick="saveDelivery()">💾 Salvar</button>
  </div>`;
}

function saveDelivery() {
  const s = loadData('sabolli_settings')||{};
  s.delivery_fee = Number(document.getElementById('del-fee').value)||6;
  s.delivery_area = document.getElementById('del-area').value;
  saveData('sabolli_settings', s);
  toast('Configurações salvas!');
}

function renderCompany(c) {
  const s = loadData('sabolli_settings')||{};
  c.innerHTML = `
  <div class="section-card">
    <div class="section-title">🏢 Dados da Empresa</div>
    <div class="form-group"><label class="form-label">Nome da Empresa</label><input id="co-name" class="form-input" type="text" value="${s.company_name||'Sabolli'}"></div>
    <div class="form-group"><label class="form-label">Telefone / WhatsApp</label><input id="co-phone" class="form-input" type="tel" value="${s.company_phone||''}" placeholder="(11) 99999-9999"></div>
    <div class="form-group"><label class="form-label">Endereço</label><input id="co-addr" class="form-input" type="text" value="${s.company_addr||''}" placeholder="Endereço da loja"></div>
    <div class="form-group"><label class="form-label">Cidade</label><input id="co-city" class="form-input" type="text" value="${s.company_city||''}" placeholder="Cidade"></div>
    <button class="btn-primary" onclick="saveCompany()">💾 Salvar</button>
    <div style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border)">
      <div class="section-title" style="margin-bottom:4px">☁️ Sincronização com Google Drive</div>
      <p style="font-size:12px;color:var(--text-sec);margin-bottom:12px;line-height:1.6">Cole a URL do seu Apps Script abaixo. O app vai salvar seus dados no Google Drive automaticamente a cada 10 minutos e sempre que você fechar o app.</p>
      ${(()=>{const url=localStorage.getItem('sabolli_sync_url')||'';const lastSync=localStorage.getItem('sabolli_last_sync');return`
      <div style="display:flex;gap:8px;margin-bottom:8px">
        <input id="sync-url-input" class="form-input" type="url" placeholder="https://script.google.com/macros/s/..." value="${url}" style="flex:1;font-size:12px">
        <button onclick="saveSyncUrl()" style="padding:10px 14px;border-radius:10px;background:var(--blue-vivid);color:#fff;border:none;font-weight:700;font-size:13px;cursor:pointer">Salvar</button>
      </div>
      ${url?`<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">
        <button onclick="syncToDrive(true)" style="flex:1;padding:10px;border-radius:10px;background:#D1FAE5;color:#065F46;border:1.5px solid #6EE7B7;font-weight:700;font-size:13px;cursor:pointer">⬆️ Salvar no Drive agora</button>
        <button onclick="syncFromDrive(true)" style="flex:1;padding:10px;border-radius:10px;background:#DBEAFE;color:#1E40AF;border:1.5px solid #93C5FD;font-weight:700;font-size:13px;cursor:pointer">⬇️ Restaurar do Drive</button>
      </div>
      <div style="font-size:11px;color:#059669;font-weight:600">${lastSync?'✅ Último sync: '+new Date(lastSync).toLocaleString('pt-BR'):'⚠️ Ainda não sincronizado'}</div>`:''}`;})()}
      <details style="margin-top:12px">
        <summary style="font-size:12px;font-weight:700;color:var(--blue-vivid);cursor:pointer">📋 Como configurar o Apps Script (passo a passo)</summary>
        <div style="margin-top:10px;padding:12px;background:var(--bg);border-radius:10px;font-size:11px;line-height:1.8;color:var(--text)">
          <b>1.</b> Acesse <b>script.google.com</b> no seu celular ou PC<br>
          <b>2.</b> Clique em <b>Novo projeto</b><br>
          <b>3.</b> Apague tudo e cole o código abaixo:<br>
          <div style="background:#1E293B;color:#7DD3FC;padding:10px;border-radius:8px;font-family:monospace;font-size:10px;margin:8px 0;overflow-x:auto;white-space:pre">const F='sabolli-backup.json';
function doGet(){const f=DriveApp.getFilesByName(F);return ContentService.createTextOutput(f.hasNext()?f.next().getBlob().getDataAsString():'{}').setMimeType(ContentService.MimeType.JSON);}
function doPost(e){const f=DriveApp.getFilesByName(F);if(f.hasNext())f.next().setContent(e.postData.contents);else DriveApp.createFile(F,e.postData.contents,MimeType.PLAIN_TEXT);return ContentService.createTextOutput('ok');}</div>
          <b>4.</b> Clique em <b>Implantar → Nova implantação</b><br>
          <b>5.</b> Tipo: <b>App da Web</b><br>
          <b>6.</b> Executar como: <b>Eu</b> · Quem pode acessar: <b>Qualquer pessoa</b><br>
          <b>7.</b> Clique em <b>Implantar</b> e autorize<br>
          <b>8.</b> Copie a URL gerada e cole aqui em cima<br>
        </div>
      </details>
    </div>
    <div style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border)">
      <div class="section-title" style="margin-bottom:12px">💾 Backup Manual</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button onclick="exportBackup()" style="flex:1;min-width:140px;padding:11px 16px;border-radius:10px;background:#D1FAE5;color:#065F46;border:1.5px solid #6EE7B7;font-weight:700;font-size:13px;cursor:pointer">⬇️ Baixar arquivo</button>
        <label style="flex:1;min-width:140px;padding:11px 16px;border-radius:10px;background:#DBEAFE;color:#1E40AF;border:1.5px solid #93C5FD;font-weight:700;font-size:13px;cursor:pointer;text-align:center">
          ⬆️ Carregar arquivo
          <input type="file" accept=".json" onchange="importBackup(event)" style="display:none">
        </label>
      </div>
      <div id="backup-status" style="margin-top:8px;font-size:12px;color:var(--text-sec)"></div>
    </div>
    <div style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border)">
      <div class="section-title" style="color:#EF4444">⚠️ Zona de Perigo</div>
      <button onclick="customConfirm('⚠️ Isso vai apagar TODOS os dados do app permanentemente. Tem certeza?', ()=>{localStorage.clear();location.reload();})" style="padding:10px 20px;border-radius:10px;background:#FEF2F2;color:#EF4444;border:1.5px solid #FCA5A5;font-weight:600;cursor:pointer">🗑️ Apagar todos os dados</button>
    </div>
  </div>`;
}

function saveCompany() {
  const s = loadData('sabolli_settings')||{};
  s.company_name = document.getElementById('co-name').value;
  s.company_phone = document.getElementById('co-phone').value;
  s.company_addr = document.getElementById('co-addr').value;
  s.company_city = document.getElementById('co-city').value;
  saveData('sabolli_settings', s);
  toast('Dados salvos!');
}

function saveSyncUrl() {
  const url = (document.getElementById('sync-url-input')?.value||'').trim();
  localStorage.setItem('sabolli_sync_url', url);
  if (url) { toast('URL salva! Sincronizando agora...'); syncToDrive(true); }
  else { toast('URL removida'); navigateTo('company'); }
}

function buildBackupPayload() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('sabolli_'));
  const backup = { version: 1, date: new Date().toISOString(), data: {} };
  keys.forEach(k => { try { backup.data[k] = JSON.parse(localStorage.getItem(k)); } catch(e) { backup.data[k] = localStorage.getItem(k); } });
  return backup;
}

async function syncToDrive(showFeedback) {
  const url = localStorage.getItem('sabolli_sync_url');
  if (!url) return;
  try {
    const payload = buildBackupPayload();
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'text/plain' }
    });
    localStorage.setItem('sabolli_last_sync', new Date().toISOString());
    if (showFeedback) { toast('✅ Dados salvos no Google Drive!'); navigateTo('company'); }
  } catch(e) {
    if (showFeedback) toast('Erro ao salvar no Drive: verifique a URL', 'error');
  }
}

async function syncFromDrive(showFeedback) {
  const url = localStorage.getItem('sabolli_sync_url');
  if (!url) { if(showFeedback) toast('Configure a URL do Apps Script primeiro', 'error'); return; }
  try {
    if (showFeedback) toast('Buscando dados no Drive...');
    const res = await fetch(url + '?t=' + Date.now());
    const backup = await res.json();
    if (!backup.data) { if(showFeedback) toast('Nenhum backup encontrado no Drive', 'error'); return; }
    const keys = Object.keys(backup.data);
    keys.forEach(k => { if (k.startsWith('sabolli_')) localStorage.setItem(k, JSON.stringify(backup.data[k])); });
    localStorage.setItem('sabolli_last_sync', new Date().toISOString());
    if (showFeedback) { toast(`✅ ${keys.length} registros restaurados do Drive! 🎉`); setTimeout(() => location.reload(), 1500); }
  } catch(e) {
    if (showFeedback) toast('Erro ao acessar o Drive: verifique a URL', 'error');
  }
}

// Auto-sync a cada 10 minutos se URL configurada
(function initAutoSync() {
  const url = localStorage.getItem('sabolli_sync_url');
  if (!url) return;
  // Sync ao fechar/sair
  window.addEventListener('beforeunload', () => syncToDrive(false));
  // Sync periódico a cada 10 min
  setInterval(() => syncToDrive(false), 10 * 60 * 1000);
  // Se localStorage vazio, tenta restaurar do Drive
  if (!localStorage.getItem('sabolli_seeded')) {
    syncFromDrive(false).then(() => { if (localStorage.getItem('sabolli_seeded')) location.reload(); });
  }
})();

function exportBackup() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('sabolli_'));
  const backup = { version: 1, date: new Date().toISOString(), data: {} };
  keys.forEach(k => { try { backup.data[k] = JSON.parse(localStorage.getItem(k)); } catch(e) { backup.data[k] = localStorage.getItem(k); } });
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  const d = new Date();
  a.href = URL.createObjectURL(blob);
  a.download = `sabolli-backup-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast('Backup exportado! Salve o arquivo em lugar seguro. 💾');
}

function importBackup(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const backup = JSON.parse(e.target.result);
      if (!backup.data) { toast('Arquivo inválido. Use um backup gerado pelo app.', 'error'); return; }
      const keys = Object.keys(backup.data);
      keys.forEach(k => { if (k.startsWith('sabolli_')) localStorage.setItem(k, JSON.stringify(backup.data[k])); });
      const el = document.getElementById('backup-status');
      if (el) el.innerHTML = `<span style="color:#059669;font-weight:700">✅ ${keys.length} chaves restauradas com sucesso! Data do backup: ${backup.date ? new Date(backup.date).toLocaleDateString('pt-BR') : '—'}</span>`;
      toast(`Backup restaurado! ${keys.length} registros recuperados. 🎉`);
      setTimeout(() => location.reload(), 1500);
    } catch(err) {
      toast('Erro ao ler o arquivo. Verifique se é um backup válido.', 'error');
    }
  };
  reader.readAsText(file);
}

// ===== FICHA TÉCNICA =====
function renderFichaTecnica(c) {
  const productId = window._fichaProdId;
  if (!productId) { navigateTo('products'); return; }
  const products = loadData('sabolli_products')||[];
  const product = products.find(p=>p.id===productId);
  if (!product) { navigateTo('products'); return; }
  const stock = loadData('sabolli_stock')||[];
  const fichas = loadData('sabolli_fichas')||{};
  const ficha = fichas[productId] || { ingredients:[], wastePercent:4 };

  const rawCost = ficha.ingredients.reduce((s,i)=>s+(i.subtotal||0),0);
  const waste = ficha.wastePercent||4;
  const totalCost = rawCost * (1 + waste/100);

  const ingredientsHtml = ficha.ingredients.length===0
    ? '<div class="empty-state" style="padding:20px"><div class="empty-icon">🧂</div><p>Nenhum ingrediente adicionado</p></div>'
    : `<div style="overflow-x:auto"><table class="mini-table">
        <thead><tr><th>Ingrediente</th><th>Qtd.</th><th>Custo/Un.</th><th>Subtotal</th><th></th></tr></thead>
        <tbody>${ficha.ingredients.map((ing,idx)=>`<tr>
          <td><strong>${ing.name}</strong></td>
          <td>${ing.qty} ${ing.unit}</td>
          <td>R$ ${Number(ing.unitCost).toLocaleString('pt-BR',{minimumFractionDigits:4,maximumFractionDigits:4})}</td>
          <td style="font-weight:700;color:#2563EB">${fmt(ing.subtotal)}</td>
          <td><button class="btn-danger" onclick="removeFichaIngredient(${idx})" style="padding:3px 8px">×</button></td>
        </tr>`).join('')}</tbody>
      </table></div>`;

  c.innerHTML = `
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap">
    <button onclick="navigateTo('products')" style="background:none;border:1.5px solid var(--border);border-radius:10px;padding:6px 12px;font-size:13px;font-weight:600;cursor:pointer;color:var(--text-sec)">← Produtos</button>
    <div>
      <div style="font-size:17px;font-weight:800;color:var(--text)">${product.name}</div>
      <div style="font-size:12px;color:#94A3B8">${product.category} · Preço de venda: ${fmt(product.price)}</div>
    </div>
  </div>

  <div class="section-card">
    <div class="section-title">🧂 Ingredientes da Ficha</div>
    ${ingredientsHtml}
  </div>

  <div class="section-card">
    <div class="section-title">+ Adicionar Ingrediente</div>
    <div class="form-group"><label class="form-label">Insumo do estoque</label>
      <select id="fi-sel" class="form-select" onchange="onFiIngredientChange()">
        <option value="">— Selecionar —</option>
        ${stock.map(s=>`<option value="${s.id}" data-unit="${s.unit}" data-cost="${s.cost}">${s.name} (${s.unit}) · custo: R$ ${Number(s.cost).toLocaleString('pt-BR',{minimumFractionDigits:4,maximumFractionDigits:4})}</option>`).join('')}
      </select>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label" id="fi-qty-label">Quantidade usada</label><input id="fi-qty" class="form-input" type="number" step="0.001" min="0" placeholder="0" oninput="calcFiSubtotal()"></div>
      <div class="form-group"><label class="form-label">Custo unit. (R$)</label><input id="fi-ucost" class="form-input" type="number" step="0.0001" min="0" placeholder="0,0000" oninput="calcFiSubtotal()"></div>
    </div>
    <div id="fi-subtotal" style="font-size:13px;font-weight:700;color:#2563EB;margin-bottom:10px;min-height:18px"></div>
    <button class="btn-outline" onclick="addFichaIngredient()" style="width:100%">+ Adicionar</button>
  </div>

  <div class="section-card" style="border:2px solid #E2E8F0">
    <div class="section-title">📊 Resumo de Custo</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;padding:10px;background:#F8FAFC;border-radius:10px">
        <span style="font-weight:600;color:#64748B">Custo bruto dos ingredientes</span>
        <span style="font-weight:800;color:#1E293B" id="fi-raw-cost">${fmt(rawCost)}</span>
      </div>
      <div style="padding:10px;background:#FFF7ED;border-radius:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span style="font-weight:600;color:#92400E">% de perda estimada</span>
          <div style="display:flex;gap:6px">
            ${[3,4,5].map(p=>`<button onclick="setFichaWaste(${p})" style="padding:5px 10px;border-radius:8px;border:1.5px solid ${waste===p?'#F97316':'#FED7AA'};background:${waste===p?'#F97316':'#FFF7ED'};color:${waste===p?'#fff':'#92400E'};font-weight:700;font-size:13px;cursor:pointer">${p}%</button>`).join('')}
          </div>
        </div>
        <div style="display:flex;justify-content:space-between">
          <span style="font-size:12px;color:#92400E">Acréscimo de perda</span>
          <span style="font-weight:700;color:#F97316" id="fi-waste-val">+${fmt(rawCost*waste/100)}</span>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;padding:12px 14px;background:linear-gradient(135deg,#EFF6FF,#DBEAFE);border-radius:12px;border:2px solid #BFDBFE">
        <span style="font-weight:800;font-size:15px;color:#1E3A8A">Custo Total por unidade</span>
        <span style="font-weight:900;font-size:18px;color:#2563EB" id="fi-total-cost">${fmt(totalCost)}</span>
      </div>
      ${product.price>0 && totalCost>0 ? `<div style="display:flex;justify-content:space-between;padding:10px;background:#F0FDF4;border-radius:10px">
        <span style="font-weight:600;color:#065F46">Margem com este custo</span>
        <span style="font-weight:800;color:#10B981">${((product.price-totalCost)/product.price*100).toFixed(1)}%</span>
      </div>` : ''}
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn-primary" style="flex:1" onclick="applyFichaCost()">✅ Aplicar custo ao produto</button>
      <button onclick="clearFicha()" style="padding:10px 14px;border-radius:10px;border:1.5px solid #FCA5A5;background:#FEF2F2;color:#EF4444;font-weight:600;cursor:pointer;font-size:13px">🗑 Limpar</button>
    </div>
  </div>`;
}

function onFiIngredientChange() {
  const sel = document.getElementById('fi-sel');
  const opt = sel && sel.selectedOptions[0];
  if (!opt || !opt.value) return;
  const unit = opt.dataset.unit||'un';
  const cost = Number(opt.dataset.cost)||0;
  const label = document.getElementById('fi-qty-label');
  if (label) label.textContent = `Quantidade usada (${unit})`;
  const ucostEl = document.getElementById('fi-ucost');
  if (ucostEl) ucostEl.value = cost;
  calcFiSubtotal();
}

function calcFiSubtotal() {
  const qty = Number(document.getElementById('fi-qty').value)||0;
  const ucost = Number(document.getElementById('fi-ucost').value)||0;
  const el = document.getElementById('fi-subtotal');
  if (!el) return;
  if (qty>0 && ucost>0) {
    el.textContent = `Subtotal: ${fmt(qty*ucost)}`;
  } else {
    el.textContent = '';
  }
}

function addFichaIngredient() {
  const productId = window._fichaProdId;
  const sel = document.getElementById('fi-sel');
  const stockId = Number(sel && sel.value);
  const qty = Number(document.getElementById('fi-qty').value)||0;
  const ucost = Number(document.getElementById('fi-ucost').value)||0;
  if (!stockId) { toast('Selecione um insumo','error'); return; }
  if (qty<=0) { toast('Informe a quantidade','error'); return; }
  if (ucost<=0) { toast('Informe o custo','error'); return; }
  const stock = loadData('sabolli_stock')||[];
  const item = stock.find(s=>s.id===stockId);
  if (!item) return;
  const fichas = loadData('sabolli_fichas')||{};
  if (!fichas[productId]) fichas[productId] = { ingredients:[], wastePercent:4 };
  if (fichas[productId].ingredients.find(i=>i.stockId===stockId)) { toast('Ingrediente já adicionado','warning'); return; }
  fichas[productId].ingredients.push({ stockId, name:item.name, unit:item.unit, qty, unitCost:ucost, subtotal:qty*ucost });
  saveData('sabolli_fichas', fichas);
  toast('Ingrediente adicionado!');
  navigateTo('ficha-tecnica');
}

function removeFichaIngredient(idx) {
  const productId = window._fichaProdId;
  const fichas = loadData('sabolli_fichas')||{};
  if (!fichas[productId]) return;
  fichas[productId].ingredients.splice(idx,1);
  saveData('sabolli_fichas', fichas);
  toast('Ingrediente removido');
  navigateTo('ficha-tecnica');
}

function setFichaWaste(pct) {
  const productId = window._fichaProdId;
  const fichas = loadData('sabolli_fichas')||{};
  if (!fichas[productId]) fichas[productId] = { ingredients:[], wastePercent:pct };
  else fichas[productId].wastePercent = pct;
  saveData('sabolli_fichas', fichas);
  navigateTo('ficha-tecnica');
}

function applyFichaCost() {
  const productId = window._fichaProdId;
  const fichas = loadData('sabolli_fichas')||{};
  const ficha = fichas[productId];
  if (!ficha || ficha.ingredients.length===0) { toast('Adicione ingredientes antes','warning'); return; }
  const rawCost = ficha.ingredients.reduce((s,i)=>s+(i.subtotal||0),0);
  const totalCost = rawCost * (1 + (ficha.wastePercent||4)/100);
  const products = loadData('sabolli_products')||[];
  const p = products.find(x=>x.id===productId);
  if (!p) return;
  p.cost = Math.round(totalCost*100)/100;
  saveData('sabolli_products', products);
  toast(`Custo atualizado para ${fmt(p.cost)}!`);
  navigateTo('ficha-tecnica');
}

function clearFicha() {
  customConfirm('Limpar toda a ficha técnica deste produto?', () => {
    const productId = window._fichaProdId;
    const fichas = loadData('sabolli_fichas')||{};
    delete fichas[productId];
    saveData('sabolli_fichas', fichas);
    toast('Ficha limpa');
    navigateTo('ficha-tecnica');
  });
}

// ===== ATUALIZAR APP =====
function forceUpdate() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg && reg.waiting) {
        // Tem versão nova esperando — aplica ela
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      } else if (reg) {
        // Força verificação de atualização
        reg.update().then(() => {
          if (reg.waiting) {
            reg.waiting.postMessage({ type: 'SKIP_WAITING' });
          } else {
            // Nenhuma atualização disponível — limpa cache e recarrega
            caches.keys().then(keys =>
              Promise.all(keys.map(k => caches.delete(k)))
            ).then(() => window.location.reload(true));
          }
        });
      } else {
        window.location.reload(true);
      }
    });
  } else {
    window.location.reload(true);
  }
}

// ===== INIT =====
function initApp() {
  seedDemoDataIfEmpty();
  renderSidebar();
  updateHeader();
  renderPage(document.getElementById('content'), currentSection);
  initTheme();
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  // Firebase chama _startApp após login + sync. Fallback de 4s se Firebase não carregar.
  window._startApp = initApp;
  const fbFallback = setTimeout(() => { if (!window._fbReady) initApp(); }, 4000);
  window._fbStarted = () => clearTimeout(fbFallback);

  document.addEventListener('click', e => {
    const panel = document.getElementById('saldoPanel');
    const btn = document.getElementById('saldoBtn');
    if (panel&&panel.classList.contains('open')&&!panel.contains(e.target)&&btn&&!btn.contains(e.target)) {
      panel.classList.remove('open');
    }
  });
});
