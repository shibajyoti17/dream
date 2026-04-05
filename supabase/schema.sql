-- Legacy reference only — the app no longer reads this table (memories are static in personalization.ts).
-- You can ignore or drop `shared_memories` in Supabase if you created it earlier.
--
-- Run in Supabase SQL Editor only if you still want the table for something else:
-- https://supabase.com/dashboard/project/_/sql

create table if not exists public.shared_memories (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  date_label text not null,
  title text not null,
  body text not null,
  user_id uuid references auth.users (id) on delete set null
);

create index if not exists shared_memories_created_at_idx
  on public.shared_memories (created_at desc);

alter table public.shared_memories enable row level security;

-- Anyone can read (the gift page shows them without logging in).
create policy "shared_memories_select_public"
  on public.shared_memories for select
  using (true);

-- Logged-in users only add rows tied to their auth user.
create policy "shared_memories_insert_own"
  on public.shared_memories for insert
  with check (auth.uid() = user_id);

create policy "shared_memories_update_own"
  on public.shared_memories for update
  using (auth.uid() = user_id);

create policy "shared_memories_delete_own"
  on public.shared_memories for delete
  using (auth.uid() = user_id);
