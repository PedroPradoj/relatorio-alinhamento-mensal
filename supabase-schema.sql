-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

create table clients (
  id text primary key,
  name text not null,
  created_at timestamptz not null default now()
);

create table monthly_reports (
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

-- Allow public read/write (admin app + client view both use anon key)
alter table clients enable row level security;
alter table monthly_reports enable row level security;

create policy "public read clients" on clients for select using (true);
create policy "public insert clients" on clients for insert with check (true);
create policy "public update clients" on clients for update using (true);
create policy "public delete clients" on clients for delete using (true);

create policy "public read reports" on monthly_reports for select using (true);
create policy "public insert reports" on monthly_reports for insert with check (true);
create policy "public update reports" on monthly_reports for update using (true);
create policy "public delete reports" on monthly_reports for delete using (true);
