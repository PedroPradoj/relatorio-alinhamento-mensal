-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- If you already ran the previous version, run the DROP section first.

-- DROP (if re-running)
-- drop table if exists monthly_reports;
-- drop table if exists clients;

create table if not exists clients (
  id text primary key,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists monthly_reports (
  id bigint generated always as identity primary key,
  client_id text not null references clients(id) on delete cascade,
  year int not null,
  month int not null,  -- 0-11
  investimento text,
  mensagens text,
  impressoes text,
  cliques text,
  hook_rate text,
  faturamento text,
  vendas text,
  unique (client_id, year, month)
);

-- RLS
alter table clients enable row level security;
alter table monthly_reports enable row level security;

-- Public read (client view page /c/[id] uses anon key)
create policy "public read clients"
  on clients for select using (true);

create policy "public read reports"
  on monthly_reports for select using (true);

-- Write requires authenticated user (admin)
create policy "auth write clients insert"
  on clients for insert with check (auth.role() = 'authenticated');

create policy "auth write clients update"
  on clients for update using (auth.role() = 'authenticated');

create policy "auth write clients delete"
  on clients for delete using (auth.role() = 'authenticated');

create policy "auth write reports insert"
  on monthly_reports for insert with check (auth.role() = 'authenticated');

create policy "auth write reports update"
  on monthly_reports for update using (auth.role() = 'authenticated');

create policy "auth write reports delete"
  on monthly_reports for delete using (auth.role() = 'authenticated');
