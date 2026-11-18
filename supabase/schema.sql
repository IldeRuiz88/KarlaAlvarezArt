-- Ejecutar completo en Supabase → SQL Editor.

-- ===== Tablas =====
create table if not exists public.series (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  cover_url text,
  cover_path text,
  cover_position text default '50% 50%',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  series_id uuid references public.series(id) on delete set null,
  year int,
  technique text,
  dimensions text,
  description text,
  colors text[] default '{}',
  image_url text not null,
  image_path text,
  featured boolean default true,
  created_at timestamptz default now()
);

create index if not exists works_series_idx on public.works(series_id);
create index if not exists works_year_idx on public.works(year);

-- ===== Seguridad (RLS) =====
-- Lectura pública; escritura solo para usuarios autenticados (la artista).
alter table public.series enable row level security;
alter table public.works enable row level security;

create policy "series lectura pública" on public.series for select using (true);
create policy "works lectura pública" on public.works for select using (true);

create policy "series escritura autenticada" on public.series
  for all to authenticated using (true) with check (true);
create policy "works escritura autenticada" on public.works
  for all to authenticated using (true) with check (true);

-- ===== Storage =====
insert into storage.buckets (id, name, public)
values ('obras', 'obras', true)
on conflict (id) do nothing;

create policy "obras lectura pública" on storage.objects
  for select using (bucket_id = 'obras');
create policy "obras subida autenticada" on storage.objects
  for insert to authenticated with check (bucket_id = 'obras');
create policy "obras edición autenticada" on storage.objects
  for update to authenticated using (bucket_id = 'obras');
create policy "obras borrado autenticado" on storage.objects
  for delete to authenticated using (bucket_id = 'obras');

-- ===== Migración (solo si las tablas ya existían antes de esta versión) =====
-- Punto de enfoque de la imagen de cada serie.
alter table public.series add column if not exists cover_position text default '50% 50%';
