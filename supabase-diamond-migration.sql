-- ============================================================
-- Migração: Relatório Mensal → Supabase DiamondSales
-- Rodar em: https://supabase.com/dashboard/project/mbymsmfouzmwvprcwkhe/sql/new
-- NÃO toca nas tabelas existentes (clients, campaigns, leads, orders)
-- ============================================================

-- 1. Tabela de clientes do relatório
CREATE TABLE IF NOT EXISTS relatorio_clients (
  id         text        PRIMARY KEY,
  name       text        NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE relatorio_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "relatorio_clients_select" ON relatorio_clients FOR SELECT USING (true);
CREATE POLICY "relatorio_clients_insert" ON relatorio_clients FOR INSERT WITH CHECK (true);
CREATE POLICY "relatorio_clients_update" ON relatorio_clients FOR UPDATE USING (true);
CREATE POLICY "relatorio_clients_delete" ON relatorio_clients FOR DELETE USING (true);

-- 2. Tabela de relatórios mensais
CREATE TABLE IF NOT EXISTS relatorio_monthly_reports (
  id           bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  client_id    text        NOT NULL REFERENCES relatorio_clients(id) ON DELETE CASCADE,
  year         integer     NOT NULL,
  month        integer     NOT NULL CHECK (month >= 0 AND month <= 11),
  investimento text        DEFAULT '',
  mensagens    text        DEFAULT '',
  impressoes   text        DEFAULT '',
  cliques      text        DEFAULT '',
  hook_rate    text        DEFAULT '',
  faturamento  text        DEFAULT '',
  vendas       text        DEFAULT '',
  created_at   timestamptz DEFAULT now() NOT NULL,
  UNIQUE (client_id, year, month)
);

ALTER TABLE relatorio_monthly_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "relatorio_reports_select" ON relatorio_monthly_reports FOR SELECT USING (true);
CREATE POLICY "relatorio_reports_insert" ON relatorio_monthly_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "relatorio_reports_update" ON relatorio_monthly_reports FOR UPDATE USING (true);
CREATE POLICY "relatorio_reports_delete" ON relatorio_monthly_reports FOR DELETE USING (true);

-- 3. Dados migrados do projeto antigo
INSERT INTO relatorio_clients (id, name, created_at) VALUES
  ('mpfnq5pvzw7dn', 'Effe Joias', '2026-05-21T15:40:12.787+00:00')
ON CONFLICT (id) DO NOTHING;

INSERT INTO relatorio_monthly_reports
  (client_id, year, month, investimento, mensagens, impressoes, cliques, hook_rate, faturamento, vendas)
VALUES
  ('mpfnq5pvzw7dn', 2026, 1, '1589,66', '138', '143663', '405', '7,38', '38400', '11'),
  ('mpfnq5pvzw7dn', 2026, 2, '1610,42', '139', '137790', '372', '8,27', '50100', '14'),
  ('mpfnq5pvzw7dn', 2026, 3, '2509,03', '171', '195110', '435', '9,35', '38800', '13'),
  ('mpfnq5pvzw7dn', 2026, 4, '2218,92', '182', '171075', '458', '7,82', '65000', '')
ON CONFLICT (client_id, year, month) DO NOTHING;
