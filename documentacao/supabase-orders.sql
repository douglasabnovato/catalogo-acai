-- supabase-orders.sql · tabela de pedidos e políticas RLS para o cardápio (rodar no SQL Editor do Supabase).
-- Objetivo: o site (chave anon/publishable) só consegue INSERIR pedidos válidos; ninguém anônimo lê,
-- altera ou apaga pedidos (nomes, telefones e endereços são dados pessoais — LGPD art. 46).

create table if not exists public.orders (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  customer_name text not null check (char_length(customer_name) between 3 and 120),
  customer_phone text not null check (customer_phone ~ '^[0-9]{10,13}$'),
  delivery_type text not null check (delivery_type in ('delivery', 'retirada')),
  address text not null check (char_length(address) between 3 and 300),
  items jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) between 1 and 50),
  total_amount numeric(10, 2) not null check (total_amount > 0 and total_amount < 2000)
);

alter table public.orders enable row level security;

-- Remove políticas antigas que possam liberar leitura ao público.
drop policy if exists "anon pode ler pedidos" on public.orders;
drop policy if exists "Enable read access for all users" on public.orders;

-- Visitante anônimo só insere.
drop policy if exists "site insere pedidos" on public.orders;
create policy "site insere pedidos" on public.orders
  for insert to anon
  with check (true);

-- Leitura apenas para usuários autenticados da loja (painel/Studio).
drop policy if exists "loja le pedidos" on public.orders;
create policy "loja le pedidos" on public.orders
  for select to authenticated
  using (true);

-- Conferência: deve listar só as duas políticas acima.
select policyname, cmd, roles from pg_policies where tablename = 'orders';
-- fim de supabase-orders.sql
