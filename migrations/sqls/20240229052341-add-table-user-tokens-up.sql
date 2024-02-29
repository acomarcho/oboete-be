create table user_tokens(
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references users(id),
  token varchar not null
);