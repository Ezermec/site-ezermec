-- ==========================================================================
-- Ezermec — Schema do banco (Supabase / Postgres)
-- Projeto: qawzvbgxlyohppereybe
--
-- Este arquivo documenta o schema já aplicado ao banco (via migrations).
-- Serve como referência/versionamento; rode-o num banco novo para recriar.
-- ==========================================================================

-- --------------------------------------------------------------------------
-- Tabela de produtos e estoque
-- --------------------------------------------------------------------------
create table if not exists public.products (
  id                  bigint generated always as identity primary key,
  slug                text not null unique,
  name                text not null,
  code                text not null,
  fab                 text,
  brand               text not null,
  cat                 text not null,
  icon                text not null default 'ph-package',
  weight              text,
  dims                text,
  material            text,
  short               text,
  full_description    text,
  tags                text[] not null default '{}',  -- geradas automaticamente
  images              text[] not null default '{}',  -- caminhos no Storage (1ª = principal)
  stock_quantity      integer not null default 0,
  low_stock_threshold integer not null default 5,
  -- Status derivado automaticamente da quantidade em estoque:
  --   0             -> 'sem'  (sem estoque)
  --   <= limite     -> 'baixo' (estoque baixo)
  --   > limite      -> 'em'   (em estoque)
  stock_status        text generated always as (
                        case
                          when stock_quantity <= 0 then 'sem'
                          when stock_quantity <= low_stock_threshold then 'baixo'
                          else 'em'
                        end
                      ) stored,
  featured            boolean not null default false,
  position            integer,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists products_cat_idx      on public.products (cat);
create index if not exists products_brand_idx    on public.products (brand);
create index if not exists products_position_idx on public.products (position);

-- --------------------------------------------------------------------------
-- Trigger: mantém updated_at atualizado
-- --------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_products_set_updated_at on public.products;
create trigger trg_products_set_updated_at
  before update on public.products
  for each row
  execute function public.set_updated_at();

-- --------------------------------------------------------------------------
-- Row Level Security
--   Leitura pública (site usa a chave publicável / role anon).
--   Escrita liberada para qualquer usuário autenticado (role `authenticated`):
--   não há modelo multiusuário/propriedade por linha — toda conta autenticada
--   é, por definição, uma conta de administrador do painel (login criado
--   manualmente, sem cadastro público). Ver app/painel/.
-- --------------------------------------------------------------------------
alter table public.products enable row level security;

drop policy if exists "Leitura pública dos produtos" on public.products;
create policy "Leitura pública dos produtos"
  on public.products
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin pode inserir produtos" on public.products;
create policy "Admin pode inserir produtos"
  on public.products
  for insert
  to authenticated
  with check (true);

drop policy if exists "Admin pode atualizar produtos" on public.products;
create policy "Admin pode atualizar produtos"
  on public.products
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin pode remover produtos" on public.products;
create policy "Admin pode remover produtos"
  on public.products
  for delete
  to authenticated
  using (true);

-- --------------------------------------------------------------------------
-- Marcas e categorias (registro selecionável no cadastro de produto)
--   Leitura pública; escrita apenas para authenticated (admin).
-- --------------------------------------------------------------------------
create table if not exists public.brands (
  id         bigint generated always as identity primary key,
  name       text not null unique,
  created_at timestamptz not null default now()
);
alter table public.brands enable row level security;
create policy "Leitura pública das marcas" on public.brands for select to anon, authenticated using (true);
create policy "Admin insere marcas"  on public.brands for insert to authenticated with check (true);
create policy "Admin atualiza marcas" on public.brands for update to authenticated using (true) with check (true);
create policy "Admin remove marcas"  on public.brands for delete to authenticated using (true);

create table if not exists public.categories (
  id         bigint generated always as identity primary key,
  name       text not null unique,
  icon       text not null default 'ph-package',
  position   integer,
  created_at timestamptz not null default now()
);
alter table public.categories enable row level security;
create policy "Leitura pública das categorias" on public.categories for select to anon, authenticated using (true);
create policy "Admin insere categorias"  on public.categories for insert to authenticated with check (true);
create policy "Admin atualiza categorias" on public.categories for update to authenticated using (true) with check (true);
create policy "Admin remove categorias"  on public.categories for delete to authenticated using (true);

-- --------------------------------------------------------------------------
-- Storage: bucket público de imagens de produto
--   Leitura via URL pública (sem política de SELECT, para não permitir listar
--   o bucket inteiro). Escrita apenas para authenticated (admin).
-- --------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product-images admin insere"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images');
create policy "product-images admin atualiza"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images') with check (bucket_id = 'product-images');
create policy "product-images admin remove"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images');
