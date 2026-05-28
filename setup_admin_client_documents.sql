create extension if not exists "pgcrypto";

create table if not exists public.client_accounts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid null,
  email text not null unique,
  full_name text null,
  company_name text null,
  plan_name text null,
  status text not null default 'active',
  portal_enabled boolean not null default true,
  access_token text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_documents (
  id uuid primary key default gen_random_uuid(),
  order_id uuid null,
  client_email text not null,
  document_key text null,
  title text not null,
  file_name text null,
  file_url text null,
  storage_path text null,
  status text not null default 'pending',
  required boolean not null default false,
  admin_comment text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid null,
  client_email text not null,
  subject text not null,
  message text not null,
  status text not null default 'sent',
  created_at timestamptz not null default now()
);

create index if not exists client_documents_client_email_idx
on public.client_documents (client_email);

create index if not exists client_messages_client_email_idx
on public.client_messages (client_email);

insert into storage.buckets (id, name, public)
values ('client-documents', 'client-documents', true)
on conflict (id) do nothing;