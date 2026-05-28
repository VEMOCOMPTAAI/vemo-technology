alter table public.client_documents
add column if not exists client_email text,
add column if not exists document_key text,
add column if not exists title text,
add column if not exists file_name text,
add column if not exists file_url text,
add column if not exists storage_path text,
add column if not exists status text not null default 'pending',
add column if not exists required boolean not null default false,
add column if not exists admin_comment text,
add column if not exists created_at timestamptz not null default now(),
add column if not exists updated_at timestamptz not null default now();

create index if not exists client_documents_client_email_idx
on public.client_documents (client_email);

notify pgrst, 'reload schema';