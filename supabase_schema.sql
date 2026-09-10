-- =======================================================
-- BRIDGEUP SUPABASE POSTGRESQL SCHEMA
-- Run this in your Supabase project: SQL Editor -> New Query -> Run
-- =======================================================

-- 1. Incidents Table (Real-Time Distress Dispatch)
create table if not exists public.incidents (
  id text primary key,
  title text not null,
  category text not null,
  severity text not null,
  status text not null default 'Reported',
  location text,
  coordinates jsonb default '{"lat": 28.6139, "lng": 77.2090}'::jsonb,
  description text,
  photo text,
  reporter_name text,
  reporter_email text,
  reporter_phone text,
  created_at timestamptz default now(),
  assigned_ngo_id text,
  assigned_ngo_name text,
  resolution_notes text,
  resolution_photo text,
  resolved_at timestamptz,
  admin_moderation_note text
);

-- 2. Registered Users Table (Persistent Real Authentication)
create table if not exists public.registered_users (
  id text primary key,
  username text unique not null,
  email text unique not null,
  password text not null,
  name text,
  phone text,
  location text,
  avatar text,
  total_donated numeric default 0,
  donations_count int default 0,
  volunteer_hours int default 0,
  badges text[] default array['New Citizen', 'Verified Explorer'],
  saved_adoptions text[] default array[]::text[],
  donation_history jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- 3. NGOs Table (Verified Organizations & Status)
create table if not exists public.ngos (
  id text primary key,
  name text not null,
  registration_number text,
  pan_number text,
  fcra_number text,
  focus_area text,
  verified boolean default false,
  verification_status text default 'pending',
  verification_date timestamptz,
  verified_by text,
  location text,
  address text,
  contact_email text,
  phone text,
  bio text,
  logo text,
  banner text,
  documents jsonb default '[]'::jsonb,
  stats jsonb default '{"totalDonationsRaised": 0, "incidentsResolved": 0, "activeCampaignsCount": 1, "volunteersCount": 0}'::jsonb,
  created_at timestamptz default now()
);

-- 4. Enable Row Level Security (RLS) with Public Open Access
alter table public.incidents enable row level security;
alter table public.registered_users enable row level security;
alter table public.ngos enable row level security;

-- Policies for Incidents
create policy "Allow public read incidents" on public.incidents for select using (true);
create policy "Allow public insert incidents" on public.incidents for insert with check (true);
create policy "Allow public update incidents" on public.incidents for update using (true);

-- Policies for Registered Users
create policy "Allow public read users" on public.registered_users for select using (true);
create policy "Allow public insert users" on public.registered_users for insert with check (true);
create policy "Allow public update users" on public.registered_users for update using (true);

-- Policies for NGOs
create policy "Allow public read ngos" on public.ngos for select using (true);
create policy "Allow public insert ngos" on public.ngos for insert with check (true);
create policy "Allow public update ngos" on public.ngos for update using (true);

-- 5. Enable Real-Time Broadcast on all 3 tables
alter publication supabase_realtime add table public.incidents;
alter publication supabase_realtime add table public.registered_users;
alter publication supabase_realtime add table public.ngos;
