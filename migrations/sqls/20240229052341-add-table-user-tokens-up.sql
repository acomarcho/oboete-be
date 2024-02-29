create table user_tokens(
  id uuid default gen_random_uuid(),
  user_id uuid not null references users(id),
  token varchar not null
);