create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.categories add column if not exists storage_path text;

create or replace function public.is_victoria_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  store_name text not null default 'المتجر',
  store_name_ar text not null default 'المتجر',
  tagline_ar text,
  description_ar text,
  whatsapp_number text,
  phone_number text,
  email text,
  instagram_url text,
  facebook_url text,
  tiktok_url text,
  address_ar text,
  google_maps_url text,
  currency text not null default '',
  currency_symbol text not null default '',
  delivery_enabled boolean not null default true,
  pickup_enabled boolean not null default true,
  default_delivery_note_ar text,
  opening_hours jsonb not null default '[]'::jsonb,
  footer_note_ar text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text unique not null check (section_key in ('hero', 'custom_cake', 'chocolate', 'gift', 'about')),
  title_ar text,
  subtitle_ar text,
  button_text_ar text,
  button_link text,
  secondary_button_text_ar text,
  secondary_button_link text,
  image_url text,
  mobile_image_url text,
  storage_path text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  storage_path text,
  caption_ar text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  description_ar text,
  image_url text,
  storage_path text,
  button_text_ar text,
  button_link text,
  placement text not null default 'homepage' check (placement in ('homepage', 'cakes', 'chocolate')),
  start_at timestamptz,
  end_at timestamptz,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists homepage_sections_order_idx on public.homepage_sections(sort_order);
create index if not exists gallery_items_order_idx on public.gallery_items(sort_order);
create index if not exists promotions_active_idx on public.promotions(is_active, placement, sort_order);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at before update on public.site_settings for each row execute procedure public.set_updated_at();
drop trigger if exists homepage_sections_set_updated_at on public.homepage_sections;
create trigger homepage_sections_set_updated_at before update on public.homepage_sections for each row execute procedure public.set_updated_at();
drop trigger if exists promotions_set_updated_at on public.promotions;
create trigger promotions_set_updated_at before update on public.promotions for each row execute procedure public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.gallery_items enable row level security;
alter table public.promotions enable row level security;

drop policy if exists "Public can read active categories" on public.categories;
drop policy if exists "Admins manage categories" on public.categories;
drop policy if exists "Public can read available products" on public.products;
drop policy if exists "Admins manage products" on public.products;
drop policy if exists "Public can read product images" on public.product_images;
drop policy if exists "Admins manage product images" on public.product_images;
drop policy if exists "Public can read available options" on public.product_options;
drop policy if exists "Admins manage product options" on public.product_options;
create policy "Public can read active categories" on public.categories for select using (is_active or public.is_victoria_admin());
create policy "Victoria admin manages categories" on public.categories for all using (public.is_victoria_admin()) with check (public.is_victoria_admin());
create policy "Public can read available products" on public.products for select using (is_available or public.is_victoria_admin());
create policy "Victoria admin manages products" on public.products for all using (public.is_victoria_admin()) with check (public.is_victoria_admin());
create policy "Public can read product images" on public.product_images for select using (exists (select 1 from public.products p where p.id = product_id and (p.is_available or public.is_victoria_admin())));
create policy "Victoria admin manages product images" on public.product_images for all using (public.is_victoria_admin()) with check (public.is_victoria_admin());
create policy "Public can read available options" on public.product_options for select using (exists (select 1 from public.products p where p.id = product_id and (p.is_available or public.is_victoria_admin())));
create policy "Victoria admin manages product options" on public.product_options for all using (public.is_victoria_admin()) with check (public.is_victoria_admin());

create policy "Public can read site settings" on public.site_settings for select using (true);
create policy "Victoria admin manages site settings" on public.site_settings for all using (public.is_victoria_admin()) with check (public.is_victoria_admin());
create policy "Public can read active homepage sections" on public.homepage_sections for select using (is_active or public.is_victoria_admin());
create policy "Victoria admin manages homepage sections" on public.homepage_sections for all using (public.is_victoria_admin()) with check (public.is_victoria_admin());
create policy "Public can read active gallery" on public.gallery_items for select using (is_active or public.is_victoria_admin());
create policy "Victoria admin manages gallery" on public.gallery_items for all using (public.is_victoria_admin()) with check (public.is_victoria_admin());
create policy "Public can read active promotions" on public.promotions for select using (is_active or public.is_victoria_admin());
create policy "Victoria admin manages promotions" on public.promotions for all using (public.is_victoria_admin()) with check (public.is_victoria_admin());

drop policy if exists "Anyone can view product images" on storage.objects;
drop policy if exists "Admins can upload product images" on storage.objects;
drop policy if exists "Admins can update product images" on storage.objects;
drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Public can view Victoria media" on storage.objects for select using (bucket_id = 'product-images');
create policy "Victoria admin can upload media" on storage.objects for insert with check (bucket_id = 'product-images' and public.is_victoria_admin());
create policy "Victoria admin can update media" on storage.objects for update using (bucket_id = 'product-images' and public.is_victoria_admin()) with check (bucket_id = 'product-images' and public.is_victoria_admin());
create policy "Victoria admin can delete media" on storage.objects for delete using (bucket_id = 'product-images' and public.is_victoria_admin());
