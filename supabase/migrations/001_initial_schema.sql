create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  nickname text,
  editor_tone text default 'calm',
  created_at timestamp with time zone default now()
);

create table if not exists watchlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  code text not null,
  name text not null,
  market text,
  sector text,
  created_at timestamp with time zone default now(),
  unique(user_id, code)
);

create index if not exists watchlist_items_user_created_idx
  on watchlist_items (user_id, created_at);

create table if not exists daily_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  report_date date not null,
  report_json jsonb not null,
  report_markdown text,
  status text default 'completed',
  created_at timestamp with time zone default now(),
  unique(user_id, report_date)
);

create index if not exists daily_reports_user_date_idx
  on daily_reports (user_id, report_date desc);

create table if not exists market_events (
  id uuid primary key default gen_random_uuid(),
  event_date date not null,
  type text,
  title text,
  summary text,
  related_codes text[],
  related_sectors text[],
  importance int,
  sentiment text,
  source_urls text[],
  created_at timestamp with time zone default now()
);

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  role text not null,
  content text not null,
  related_report_id uuid references daily_reports(id),
  created_at timestamp with time zone default now()
);

create index if not exists chat_messages_user_created_idx
  on chat_messages (user_id, created_at desc);

create index if not exists chat_messages_related_report_idx
  on chat_messages (related_report_id);

create table if not exists generation_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  job_date date not null,
  status text not null default 'pending',
  error_message text,
  retry_count int not null default 0,
  started_at timestamp with time zone,
  finished_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  unique(user_id, job_date)
);

create index if not exists generation_jobs_user_date_idx
  on generation_jobs (user_id, job_date desc);

create index if not exists generation_jobs_status_idx
  on generation_jobs (status);

insert into users (id, nickname)
values ('00000000-0000-0000-0000-000000000001', '默认用户')
on conflict (id) do nothing;
