-- KOPYR STORE dedicated database. Run ONLY in an isolated KOPYR project.
create extension if not exists pgcrypto;
create table if not exists public.products (
 id uuid primary key default gen_random_uuid(), sku text not null unique, name text not null,
 category text not null default 'General', description text, image_url text,
 price_usd_cents integer check (price_usd_cents > 0),
 price_approved boolean not null default false, published boolean not null default false,
 created_at timestamptz not null default now(),
 constraint published_requires_price check (not published or (price_approved and price_usd_cents is not null))
);
create table if not exists public.inventory (
 product_id uuid primary key references public.products(id) on delete cascade,
 on_hand integer not null default 0 check(on_hand>=0),
 reserved integer not null default 0 check(reserved>=0 and reserved<=on_hand),
 verified boolean not null default false
);
create table if not exists public.customers (
 id uuid primary key default gen_random_uuid(), email text not null, full_name text not null,
 phone text, created_at timestamptz not null default now()
);
create table if not exists public.addresses (
 id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.customers(id),
 line1 text not null, province text not null, municipality text not null, sector text,
 reference text, created_at timestamptz not null default now()
);
create table if not exists public.orders (
 id uuid primary key default gen_random_uuid(),
 customer_id uuid not null references public.customers(id),
 address_id uuid not null references public.addresses(id),
 status text not null default 'pending' check(status in ('pending','awaiting_payment','paid','cancelled','fulfilled','refunded')),
 currency text not null default 'USD' check(currency='USD'),
 subtotal_cents integer not null check(subtotal_cents>=0),
 shipping_cents integer not null check(shipping_cents>=0),
 total_cents integer generated always as (subtotal_cents+shipping_cents) stored,
 exchange_rate_dop_per_usd numeric(12,4),
 paypal_order_id text unique,
 created_at timestamptz not null default now()
);
create table if not exists public.order_items (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id),
 product_id uuid not null references public.products(id),
 quantity integer not null check(quantity>0), unit_cents integer not null check(unit_cents>0),
 unique(order_id,product_id)
);
create table if not exists public.payments (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id),
 paypal_capture_id text unique, paypal_order_id text unique,
 status text not null default 'pending' check(status in ('pending','completed','failed','refunded')),
 amount_cents integer not null check(amount_cents>0), currency text not null default 'USD' check(currency='USD'),
 created_at timestamptz not null default now()
);
create table if not exists public.payment_events (
 id uuid primary key default gen_random_uuid(), provider_event_id text not null unique,
 event_type text not null, verified boolean not null default false,
 processed_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.shipments (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id),
 status text not null default 'pending', tracking_code text, created_at timestamptz not null default now()
);
create table if not exists public.admin_users (
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
create table if not exists public.audit_logs (
 id bigint generated always as identity primary key,
 actor_id uuid, action text not null, entity_type text not null, entity_id text,
 created_at timestamptz not null default now()
);
create index if not exists orders_created_idx on public.orders(created_at desc);
create index if not exists orders_customer_idx on public.orders(customer_id);
create index if not exists order_items_order_idx on public.order_items(order_id);
create index if not exists payments_order_idx on public.payments(order_id);
-- No anonymous Data API permissions; server-side commerce operations require dedicated backend.
revoke all on all tables in schema public from anon, authenticated;
alter table public.products enable row level security;
alter table public.inventory enable row level security;
alter table public.customers enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.payment_events enable row level security;
alter table public.shipments enable row level security;
alter table public.admin_users enable row level security;
alter table public.audit_logs enable row level security;
-- Admin read access to approved catalog only, explicit auth membership.
create policy "admins_read_products" on public.products for select to authenticated
 using (exists(select 1 from public.admin_users a where a.user_id=(select auth.uid())));
