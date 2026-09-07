-- Davidas content backend — initial schema
-- Tables mirror the existing TypeScript shapes (products.ts, articles.json, showcase.ts)
-- so the app's data layer maps 1:1. All content is read-only to the public (RLS);
-- writes happen via the Supabase dashboard or the service-role seed script.

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- categories  (from CATEGORIES in products.ts)
-- ---------------------------------------------------------------------------
create table public.categories (
  id         text primary key,          -- e.g. 'ladies'
  label      text not null,             -- e.g. 'Ladies'
  sort_order int  not null default 0
);

-- ---------------------------------------------------------------------------
-- subcategories
-- ---------------------------------------------------------------------------
create table public.subcategories (
  category_id text not null references public.categories(id) on delete cascade,
  id          text not null,            -- e.g. 'bracelets'
  label       text not null,
  sort_order  int  not null default 0,
  primary key (category_id, id)
);

-- ---------------------------------------------------------------------------
-- products  (from Product interface)
-- ---------------------------------------------------------------------------
create table public.products (
  id             uuid primary key default gen_random_uuid(),
  style          text unique not null,           -- '260-105'
  slug           text unique not null,           -- 'mermaid-bracelet'
  name           text not null,
  category_id    text not null references public.categories(id),
  subcategory_id text not null,                  -- (composite FK to subcategories can be added once data is verified)
  description    text not null default '',
  metals         text not null default '',
  sizes          text not null default '',
  karats         text not null default '',
  image          text not null default '',
  video          text not null default '',       -- ijewel.design 3D embed URL
  form_hint      text,
  sort_order     int  not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index products_category_idx on public.products (category_id, subcategory_id);
create trigger products_set_updated_at before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- articles  (from Article interface)
-- ---------------------------------------------------------------------------
create table public.articles (
  id         text primary key,          -- slug, e.g. 'paraiba-tourmaline'
  title      text not null,
  tag        text not null default '',
  author     text not null default '',
  date       text not null default '',  -- kept as text to match current data ('2025')
  excerpt    text not null default '',
  content    text not null default '',  -- HTML string
  image      text not null default '',  -- may be empty
  sort_order int  not null default 0    -- shelf order
);

-- ---------------------------------------------------------------------------
-- showcase_items  (from ShowcaseItem + the gaps in the showcase plan)
-- Standalone: NOT derived from products (solves items with no product row).
-- ---------------------------------------------------------------------------
create table public.showcase_items (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  name           text not null,
  category_id    text,                            -- for filtering + inquiry routing
  subcategory_id text,
  collection     text not null default '',
  price          numeric,                         -- null => inquiry-only piece
  price_options  jsonb,                           -- [{ "label": "...", "price": 0 }] for dual pricing
  description    text not null default '',
  image          text not null default '',
  images         text[] not null default '{}',    -- extra photos (model shots, close-ups)
  metals         text not null default '',
  karats         text not null default '',
  style          text not null default '',
  gemstone       text not null default '',
  surface        text not null default 'velvet' check (surface in ('velvet','stand','box')),
  video          text,                            -- ijewel 3D embed (optional)
  motion_video   text,                            -- self-hosted mp4 -> "See It In Motion"
  creation_video text,                            -- real bench footage -> "See How This Piece Was Created"
  sketch_image   text,
  bench_image    text,
  featured       boolean not null default false,
  case_number    int not null default 1,
  display_order  int not null default 0,
  mode           text not null default 'price' check (mode in ('price','inquiry')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create trigger showcase_items_set_updated_at before update on public.showcase_items
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security: public may READ everything; nobody may write via anon.
-- Writes go through the service-role key (seed script) or the dashboard.
-- ---------------------------------------------------------------------------
alter table public.categories     enable row level security;
alter table public.subcategories  enable row level security;
alter table public.products       enable row level security;
alter table public.articles       enable row level security;
alter table public.showcase_items enable row level security;

create policy "public_read_categories"     on public.categories     for select using (true);
create policy "public_read_subcategories"  on public.subcategories  for select using (true);
create policy "public_read_products"       on public.products       for select using (true);
create policy "public_read_articles"       on public.articles       for select using (true);
create policy "public_read_showcase_items" on public.showcase_items for select using (true);
