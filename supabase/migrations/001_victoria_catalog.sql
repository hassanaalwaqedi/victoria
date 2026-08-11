create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  slug text unique not null,
  description_ar text,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  slug text unique not null,
  description_ar text,
  short_description_ar text,
  price numeric(10,2) not null check (price >= 0),
  category_id uuid references public.categories(id) on delete set null,
  primary_image_url text,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  is_best_seller boolean not null default false,
  allow_custom_message boolean not null default false,
  allow_flavor_selection boolean not null default false,
  allow_size_selection boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  storage_path text,
  alt_text_ar text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.product_options (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  type text not null check (type in ('size', 'flavor')),
  name_ar text not null,
  price_modifier numeric(10,2) not null default 0,
  sort_order integer not null default 0,
  is_available boolean not null default true
);

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_available_idx on public.products(is_available);
create index if not exists product_images_product_id_idx on public.product_images(product_id);
create index if not exists product_options_product_id_idx on public.product_options(product_id);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at before update on public.categories for each row execute procedure public.set_updated_at();
drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products for each row execute procedure public.set_updated_at();

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_options enable row level security;

drop policy if exists "Public can read active categories" on public.categories;
drop policy if exists "Admins manage categories" on public.categories;
drop policy if exists "Public can read available products" on public.products;
drop policy if exists "Admins manage products" on public.products;
drop policy if exists "Public can read product images" on public.product_images;
drop policy if exists "Admins manage product images" on public.product_images;
drop policy if exists "Public can read available options" on public.product_options;
drop policy if exists "Admins manage product options" on public.product_options;

create policy "Public can read active categories" on public.categories for select using (is_active = true or auth.role() = 'authenticated');
create policy "Admins manage categories" on public.categories for all to authenticated using (true) with check (true);
create policy "Public can read available products" on public.products for select using (is_available = true or auth.role() = 'authenticated');
create policy "Admins manage products" on public.products for all to authenticated using (true) with check (true);
create policy "Public can read product images" on public.product_images for select using (exists (select 1 from public.products p where p.id = product_id and (p.is_available = true or auth.role() = 'authenticated')));
create policy "Admins manage product images" on public.product_images for all to authenticated using (true) with check (true);
create policy "Public can read available options" on public.product_options for select using (exists (select 1 from public.products p where p.id = product_id and (p.is_available = true or auth.role() = 'authenticated')));
create policy "Admins manage product options" on public.product_options for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do update set public = true;
drop policy if exists "Anyone can view product images" on storage.objects;
drop policy if exists "Admins can upload product images" on storage.objects;
drop policy if exists "Admins can update product images" on storage.objects;
drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Anyone can view product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "Admins can upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images');
create policy "Admins can update product images" on storage.objects for update to authenticated using (bucket_id = 'product-images') with check (bucket_id = 'product-images');
create policy "Admins can delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images');
