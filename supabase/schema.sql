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

-- --------------------------------------------------------------------------
-- Perfis dos usuários do painel (nome + papel).
--   "owner" = admin principal, gerencia outros usuários.
--   "admin" = gerencia produtos/marcas/categorias, mas não usuários.
-- --------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  role       text not null default 'admin' check (role in ('owner','admin')),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "Perfis: leitura para autenticados"
  on public.profiles for select to authenticated using (true);

create or replace function public.is_owner()
returns boolean
language sql
security invoker
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'owner'
  );
$$;

create policy "Perfis: só owner atualiza"
  on public.profiles for update to authenticated
  using (public.is_owner())
  with check (public.is_owner());

-- --------------------------------------------------------------------------
-- Funções de gerenciamento de usuários (só o owner pode chamar; verificado
-- dentro de cada função via is_owner()). Não depende de service_role key:
-- criação usa o endpoint público de signup + confirmação via SQL.
-- --------------------------------------------------------------------------
create or replace function public.admin_finish_new_user(target_id uuid, target_name text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_owner() then
    raise exception 'Apenas o administrador principal pode gerenciar usuários.';
  end if;

  update auth.users set email_confirmed_at = now()
  where id = target_id and email_confirmed_at is null;

  insert into public.profiles (id, name, role)
  values (target_id, target_name, 'admin')
  on conflict (id) do update set name = excluded.name;
end;
$$;
revoke all on function public.admin_finish_new_user(uuid, text) from public, anon;
grant execute on function public.admin_finish_new_user(uuid, text) to authenticated;

create or replace function public.admin_delete_user(target_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_role text;
begin
  if not public.is_owner() then
    raise exception 'Apenas o administrador principal pode gerenciar usuários.';
  end if;
  if target_id = auth.uid() then
    raise exception 'Você não pode remover sua própria conta.';
  end if;

  select role into target_role from public.profiles where id = target_id;
  if target_role = 'owner' then
    raise exception 'Não é possível remover um administrador principal.';
  end if;
  if target_role is null then
    raise exception 'Usuário não encontrado.';
  end if;

  delete from auth.users where id = target_id;
end;
$$;
revoke all on function public.admin_delete_user(uuid) from public, anon;
grant execute on function public.admin_delete_user(uuid) to authenticated;

create or replace function public.admin_list_users()
returns table (id uuid, email text, name text, role text, created_at timestamptz, last_sign_in_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_owner() then
    raise exception 'Apenas o administrador principal pode ver esta lista.';
  end if;

  return query
    select u.id, u.email::text, p.name, p.role, p.created_at, u.last_sign_in_at
    from auth.users u
    join public.profiles p on p.id = u.id
    order by (p.role = 'owner') desc, p.created_at asc;
end;
$$;
revoke all on function public.admin_list_users() from public, anon;
grant execute on function public.admin_list_users() to authenticated;

-- Bootstrap: garante perfil para contas criadas fora do fluxo /painel/usuarios
-- (ex.: criadas direto no Dashboard do Supabase). Nunca define role='owner'.
create or replace function public.ensure_own_profile()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, role)
  values (auth.uid(), 'admin')
  on conflict (id) do nothing;
end;
$$;
revoke all on function public.ensure_own_profile() from public, anon;
grant execute on function public.ensure_own_profile() to authenticated;

-- --------------------------------------------------------------------------
-- Histórico de alterações (audit log) — imutável para os usuários do painel:
-- só o trigger (security definer) escreve; sem policies de insert/update/delete.
-- --------------------------------------------------------------------------
create table if not exists public.audit_log (
  id           bigint generated always as identity primary key,
  actor_id     uuid references auth.users(id) on delete set null,
  actor_email  text,
  actor_name   text,
  action       text not null check (action in ('insert','update','delete')),
  table_name   text not null,
  record_label text,
  changes      jsonb,
  created_at   timestamptz not null default now()
);
alter table public.audit_log enable row level security;

create policy "Histórico: leitura para autenticados"
  on public.audit_log for select to authenticated using (true);

create index if not exists audit_log_created_at_idx on public.audit_log (created_at desc);

create or replace function public.log_audit_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor_id uuid := auth.uid();
  v_actor_email text;
  v_actor_name text;
  v_changes jsonb;
  v_label text;
begin
  if v_actor_id is not null then
    select u.email, p.name into v_actor_email, v_actor_name
    from auth.users u left join public.profiles p on p.id = u.id
    where u.id = v_actor_id;
  end if;

  if TG_OP = 'INSERT' then
    v_changes := to_jsonb(NEW);
    v_label := to_jsonb(NEW)->>'name';
  elsif TG_OP = 'DELETE' then
    v_changes := to_jsonb(OLD);
    v_label := to_jsonb(OLD)->>'name';
  else
    select jsonb_object_agg(o.key, jsonb_build_object('old', o.value, 'new', n.value))
      into v_changes
    from jsonb_each(to_jsonb(OLD)) o
    join jsonb_each(to_jsonb(NEW)) n on o.key = n.key
    where o.value is distinct from n.value
      and o.key not in ('updated_at');
    v_label := coalesce(to_jsonb(NEW)->>'name', to_jsonb(OLD)->>'name');
  end if;

  insert into public.audit_log (actor_id, actor_email, actor_name, action, table_name, record_label, changes)
  values (v_actor_id, v_actor_email, v_actor_name, lower(TG_OP), TG_TABLE_NAME, v_label, v_changes);

  return coalesce(NEW, OLD);
end;
$$;
revoke all on function public.log_audit_change() from public, anon, authenticated;

drop trigger if exists trg_products_audit on public.products;
create trigger trg_products_audit
  after insert or update or delete on public.products
  for each row execute function public.log_audit_change();

drop trigger if exists trg_brands_audit on public.brands;
create trigger trg_brands_audit
  after insert or update or delete on public.brands
  for each row execute function public.log_audit_change();

drop trigger if exists trg_categories_audit on public.categories;
create trigger trg_categories_audit
  after insert or update or delete on public.categories
  for each row execute function public.log_audit_change();
