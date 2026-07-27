-- Anji shared travel OS. Run this once in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  public_url text not null,
  day_id text not null,
  caption text not null default '',
  photo_type text not null default 'Us',
  uploaded_by text not null check (uploaded_by in ('Jenny', 'Richard')),
  is_day_cover boolean not null default false,
  is_trip_cover boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.packing_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'other',
  owner text not null default 'Both' check (owner in ('Jenny', 'Richard', 'Both')),
  checked boolean not null default false,
  created_by text not null check (created_by in ('Jenny', 'Richard')),
  updated_by text not null check (updated_by in ('Jenny', 'Richard')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.place_candidates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null default 'other',
  description text not null default '',
  day_hint text not null default '',
  map_url text not null default '',
  added_by text not null check (added_by in ('Jenny', 'Richard')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.place_votes (
  candidate_id uuid not null references public.place_candidates(id) on delete cascade,
  user_name text not null check (user_name in ('Jenny', 'Richard')),
  vote text not null check (vote in ('want', 'maybe', 'skip')),
  updated_at timestamptz not null default now(),
  primary key (candidate_id, user_name)
);

alter table public.photos enable row level security;
alter table public.packing_items enable row level security;
alter table public.place_candidates enable row level security;
alter table public.place_votes enable row level security;

create policy "shared photos" on public.photos for all using (true) with check (true);
create policy "shared packing" on public.packing_items for all using (true) with check (true);
create policy "shared places" on public.place_candidates for all using (true) with check (true);
create policy "shared votes" on public.place_votes for all using (true) with check (true);

insert into storage.buckets (id, name, public) values ('anji-photos', 'anji-photos', true) on conflict (id) do nothing;
create policy "shared photo files" on storage.objects for all using (bucket_id = 'anji-photos') with check (bucket_id = 'anji-photos');

do $$ begin
  alter publication supabase_realtime add table public.photos;
  alter publication supabase_realtime add table public.packing_items;
  alter publication supabase_realtime add table public.place_candidates;
  alter publication supabase_realtime add table public.place_votes;
exception when duplicate_object then null;
end $$;
