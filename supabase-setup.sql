create table saved_trips (
  id bigserial primary key,
  user_id uuid not null,
  destination_id text not null,
  city text not null,
  country text not null,
  flag text,
  total_cost integer,
  nights integer,
  budget integer,
  saved_at timestamptz default now()
);
