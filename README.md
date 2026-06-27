# SABOLLI FINANÇAS

Sistema web de gestão financeira e operacional para a Sabolli.

## Como abrir

1. Abra a pasta `sabolli-financas`
2. Dê um duplo clique em **`index.html`**
3. O app abrirá diretamente no navegador

Não é necessário instalar nada, servidor, ou dependências externas.

## O que está funcional

- Dashboard principal com 3 abas (Negócios, Gestão Pessoal, Estoque)
- Sidebar completa com todos os módulos de navegação
- KPI cards com valores calculados
- Filtros de período (Hoje / Semana / Mês / Ano)
- Gráfico de barras SVG — Evolução do Faturamento
- Gráfico donut SVG — Vendas por Canal e Gastos por Categoria
- Ranking de produtos mais vendidos
- Tabela de últimos pedidos com badges de status
- Resumo financeiro do período
- Formas de pagamento com barras proporcionais
- Estoque rápido
- Informações rápidas
- Ações rápidas (navegam para os módulos correspondentes)
- Metas do mês com barra de progresso
- Dashboard de Gestão Pessoal completo
- Dashboard de Estoque completo com alertas
- Dados demo criados automaticamente no localStorage
- Layout responsivo (mobile, tablet, desktop)

## Como testar

1. Abrir `index.html` no navegador
2. Clicar nas 3 abas grandes (Negócios, Gestão Pessoal, Estoque)
3. Clicar nos filtros: Hoje / Semana / Mês / Ano
4. Clicar nos botões de Ações Rápidas
5. Navegar pelos itens da sidebar
6. Abrir DevTools (F12) → Application → Local Storage para ver os dados
7. Testar em tela menor ou modo responsivo do DevTools

## Estrutura de arquivos

```
sabolli-financas/
├── index.html    — estrutura HTML principal
├── styles.css    — todos os estilos
├── app.js        — toda a lógica JavaScript
├── assets/       — pasta para imagens e ícones futuros
└── README.md     — este arquivo
```

## Dados no localStorage

| Chave | Conteúdo |
|-------|----------|
| `sabolli_orders` | 10 pedidos de exemplo |
| `sabolli_products` | 6 produtos da Sabolli |
| `sabolli_customers` | 10 clientes cadastrados |
| `sabolli_stock` | 12 insumos com quantidades |
| `sabolli_purchases` | 5 compras de fornecedores |
| `sabolli_financial_transactions` | Lançamentos financeiros |
| `sabolli_personal_transactions` | Transações pessoais |
| `sabolli_goals` | Metas do negócio e pessoais |
| `sabolli_cards` | Contas e cartões |
| `sabolli_settings` | Configurações gerais |

Para resetar os dados demo, abra o console do navegador (F12) e execute:
```javascript
localStorage.removeItem('sabolli_seeded'); location.reload();
```

## Próximas melhorias recomendadas

- Formulários funcionais para cadastro de pedidos, clientes e produtos
- Cálculo de KPIs em tempo real com dados do localStorage
- Gráficos com dados reais salvos
- Exportação de relatórios em PDF/Excel
- Integração futura com Supabase (backend)
- Login e controle de usuários
- App mobile (PWA)
