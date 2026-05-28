alter table public.client_messages
add column if not exists client_email text,
add column if not exists subject text,
add column if not exists message text,
add column if not exists status text not null default 'sent',
add column if not exists created_at timestamptz not null default now();

create index if not exists client_messages_client_email_idx
on public.client_messages (client_email);

notify pgrst, 'reload schema';