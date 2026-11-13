-- Acme Plumbing: jobs booked by customers and the quotes we send them.
-- RLS is on for every table: customers only see and change their own rows.
-- Staff tools use the service role on the server, which bypasses RLS.

create table public.jobs (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users (id) on delete cascade,
  customer_id   uuid not null,
  title         text not null,
  address       text,
  status        text not null default 'booked'
                check (status in ('booked', 'scheduled', 'in_progress', 'complete', 'cancelled')),
  technician    text,
  scheduled_for timestamptz,
  completed_at  timestamptz,
  created_at    timestamptz not null default now()
);

create index jobs_owner_id_idx on public.jobs (owner_id);

create table public.quotes (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null references auth.users (id) on delete cascade,
  job_id       uuid references public.jobs (id) on delete set null,
  description  text not null,
  amount_cents integer not null check (amount_cents >= 0),
  status       text not null default 'draft'
               check (status in ('draft', 'sent', 'accepted', 'declined')),
  created_at   timestamptz not null default now()
);

create index quotes_owner_id_idx on public.quotes (owner_id);

alter table public.jobs enable row level security;
alter table public.quotes enable row level security;

create policy "Customers read their own jobs"
  on public.jobs
  for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Customers book jobs for themselves"
  on public.jobs
  for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Customers read their own quotes"
  on public.quotes
  for select
  to authenticated
  using ((select auth.uid()) = owner_id);
