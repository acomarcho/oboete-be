create table users(
  id uuid default gen_random_uuid(),
  username varchar unique not null,
  email varchar unique not null,
  password varchar not null
);