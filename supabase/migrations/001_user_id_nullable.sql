-- If you already ran the original schema with NOT NULL user_id, run this once.
alter table public.shared_memories alter column user_id drop not null;
