-- TODO change this if changing the DB connection name
\connect postgres;

-- Create tables
create table public.people (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    name text not null,
    owner_id uuid not null,
    constraint people_pkey primary key (id)
  );

create table public.tasks (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    name text not null,
    date text not null,
    owner_id uuid not null,
    person_id uuid not null,
    constraint task_pkey primary key (id)
  );

create table public.timeoffs (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    name text not null,
    date text not null,
    owner_id uuid not null,
    person_id uuid not null,
    constraint timeoff_pkey primary key (id)
  );

-- Creates some initial data to be synced
INSERT INTO people (id, name, owner_id) VALUES ('75f89104-d95a-4f16-8309-5363f1bb377a', 'S. Mario', '85f89104-d95a-4f16-8309-5363f1bb377b');
INSERT INTO people (id, name, owner_id) VALUES ('75f89104-d95a-4f16-8309-5363f1bb377b', 'Luigi', '85f89104-d95a-4f16-8309-5363f1bb377b');
INSERT INTO people (id, name, owner_id) VALUES ('75f89104-d95a-4f16-8309-5363f1bb377c', 'Peach', '85f89104-d95a-4f16-8309-5363f1bb377b');
INSERT INTO tasks (name, person_id, owner_id, date) VALUES ('Save the princess', '75f89104-d95a-4f16-8309-5363f1bb377a', '85f89104-d95a-4f16-8309-5363f1bb377b', '2024-09-20');

-- Create publication for PowerSync
create publication powersync for table people, tasks, timeoffs;

-- Walkthrough continue on 2_schedule-app/src/1_AppSchema.ts
