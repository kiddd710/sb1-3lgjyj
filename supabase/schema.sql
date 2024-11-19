-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Drop existing tables if they exist
drop table if exists public.task_comments cascade;
drop table if exists public.task_activities cascade;
drop table if exists public.notifications cascade;
drop table if exists public.tasks cascade;
drop table if exists public.projects cascade;
drop table if exists public.users cascade;

-- Create service role for application
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role;
  end if;
end
$$;

-- Create users table
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  azure_id text unique not null,
  email text unique not null,
  name text not null,
  role text not null check (role in ('Project_Workflow_Operations_Managers', 'Project_Workflow_Project_Managers', 'default_role')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create projects table
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  start_date date not null,
  end_date date not null,
  project_manager_id uuid references public.users(id) not null,
  status text not null check (status in ('active', 'completed', 'on-hold')),
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create tasks table
create table public.tasks (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) not null,
  name text not null,
  description text,
  assigned_to_id uuid references public.users(id),
  status text not null check (status in ('pending', 'in-progress', 'pending-review', 'completed')),
  start_date date not null,
  end_date date not null,
  is_recurring boolean not null default false,
  recurring_interval text check (recurring_interval in ('daily', 'weekly', 'monthly')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create notifications table
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) not null,
  title text not null,
  message text not null,
  type text not null check (type in ('task_update', 'mention', 'status_change')),
  read boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.notifications enable row level security;

-- Grant access to service role
grant all on all tables in schema public to service_role;
grant usage on schema public to service_role;
grant all on all sequences in schema public to service_role;

-- Create policies for anon and authenticated access
create policy "Allow all access to users"
  on public.users
  for all
  using (true)
  with check (true);

create policy "Allow all access to projects"
  on public.projects
  for all
  using (true)
  with check (true);

create policy "Allow all access to tasks"
  on public.tasks
  for all
  using (true)
  with check (true);

create policy "Allow all access to notifications"
  on public.notifications
  for all
  using (true)
  with check (true);

-- Updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger set_users_updated_at
  before update on public.users
  for each row
  execute function public.handle_updated_at();

create trigger set_projects_updated_at
  before update on public.projects
  for each row
  execute function public.handle_updated_at();

create trigger set_tasks_updated_at
  before update on public.tasks
  for each row
  execute function public.handle_updated_at();