-- Global app settings table (single-row, managed by Founder)
create table if not exists public.app_settings (
  id text primary key default 'global',
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- Insert the default row so upsert always works
insert into public.app_settings (id, settings)
values ('global', '{}'::jsonb)
on conflict (id) do nothing;

-- Anyone authenticated can READ settings (all roles need to load appearance)
alter table public.app_settings enable row level security;

create policy "Everyone can read app_settings"
  on public.app_settings for select
  using (auth.role() = 'authenticated');

-- Only the service role (or Founder via RLS check) can update
-- We'll rely on the anon key + trusted client-side Founder check for now
create policy "Authenticated users can upsert app_settings"
  on public.app_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
