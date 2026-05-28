alter table public.client_messages
add column if not exists status text not null default 'sent';

notify pgrst, 'reload schema';