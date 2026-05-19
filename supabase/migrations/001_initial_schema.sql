-- ============================================================
-- Synq — Initial Database Schema
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ============================================================

-- Enable UUID extension (already enabled by default in Supabase)
-- create extension if not exists "uuid-ossp";

-- ── Thoughts ─────────────────────────────────────────────────
create table if not exists public.thoughts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  text        text not null,
  category    text not null default 'task'
              check (category in ('task','idea','emotion','note')),
  state       text not null default 'active'
              check (state in ('active','done','paused','overwhelmed')),
  priority    text not null default 'normal'
              check (priority in ('low','normal','high')),
  deadline    timestamptz,
  reminder_at timestamptz,
  tags        text[],
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Emotions ─────────────────────────────────────────────────
create table if not exists public.emotions (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid references auth.users(id) on delete cascade not null,
  mood      text not null
            check (mood in ('calm','anxious','energized','tired','grateful','sad','overwhelmed','neutral')),
  note      text,
  intensity int not null default 3 check (intensity between 1 and 5),
  logged_at timestamptz not null default now()
);

-- ── Reminders ────────────────────────────────────────────────
create table if not exists public.reminders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  title       text not null,
  description text,
  due_at      timestamptz not null,
  category    text not null default 'task'
              check (category in ('task','idea','emotion','note')),
  done        boolean not null default false,
  repeat      text not null default 'none'
              check (repeat in ('none','daily','weekly','monthly')),
  created_at  timestamptz not null default now()
);

-- ── Profiles (auto-created on signup via trigger) ─────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  streak      int not null default 0,
  created_at  timestamptz not null default now()
);

-- ── Row Level Security ────────────────────────────────────────
alter table public.thoughts  enable row level security;
alter table public.emotions  enable row level security;
alter table public.reminders enable row level security;
alter table public.profiles  enable row level security;

-- Thoughts policies
create policy "Users can view own thoughts"   on public.thoughts for select using (auth.uid() = user_id);
create policy "Users can insert own thoughts" on public.thoughts for insert with check (auth.uid() = user_id);
create policy "Users can update own thoughts" on public.thoughts for update using (auth.uid() = user_id);
create policy "Users can delete own thoughts" on public.thoughts for delete using (auth.uid() = user_id);

-- Emotions policies
create policy "Users can view own emotions"   on public.emotions for select using (auth.uid() = user_id);
create policy "Users can insert own emotions" on public.emotions for insert with check (auth.uid() = user_id);

-- Reminders policies
create policy "Users can view own reminders"   on public.reminders for select using (auth.uid() = user_id);
create policy "Users can insert own reminders" on public.reminders for insert with check (auth.uid() = user_id);
create policy "Users can update own reminders" on public.reminders for update using (auth.uid() = user_id);
create policy "Users can delete own reminders" on public.reminders for delete using (auth.uid() = user_id);

-- Profiles policies
create policy "Users can view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- ── Auto-create profile on signup ─────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Indexes for performance ────────────────────────────────────
create index if not exists thoughts_user_id_idx  on public.thoughts(user_id);
create index if not exists thoughts_state_idx    on public.thoughts(user_id, state);
create index if not exists emotions_user_id_idx  on public.emotions(user_id);
create index if not exists reminders_user_id_idx on public.reminders(user_id);
create index if not exists reminders_due_at_idx  on public.reminders(user_id, due_at);
