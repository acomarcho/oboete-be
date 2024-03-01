create table user_cards(
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references users(id),
  content varchar not null,
  status varchar not null,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);