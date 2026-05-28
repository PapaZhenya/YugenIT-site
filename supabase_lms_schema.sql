-- MLS IT Projects GreenV LMS schema
-- Run this file in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  region text not null default 'SD',
  xp integer not null default 0 check (xp >= 0),
  level integer not null default 1 check (level >= 1),
  rating integer not null default 0 check (rating >= 0),
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists region text not null default 'SD';
alter table public.profiles add column if not exists xp integer not null default 0;
alter table public.profiles add column if not exists level integer not null default 1;
alter table public.profiles add column if not exists rating integer not null default 0;
alter table public.profiles add column if not exists role text not null default 'user';
alter table public.profiles add column if not exists created_at timestamptz not null default now();

create table if not exists public.test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  username text not null,
  test_name text not null,
  score integer not null check (score >= 0),
  total_questions integer not null check (total_questions > 0),
  xp_earned integer not null default 0 check (xp_earned >= 0),
  created_at timestamptz not null default now()
);

alter table public.test_results add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.test_results add column if not exists username text;
alter table public.test_results add column if not exists test_name text;
alter table public.test_results add column if not exists score integer;
alter table public.test_results add column if not exists total_questions integer;
alter table public.test_results add column if not exists xp_earned integer not null default 0;
alter table public.test_results add column if not exists created_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'test_results_one_user_one_test'
      and conrelid = 'public.test_results'::regclass
  ) then
    alter table public.test_results
    add constraint test_results_one_user_one_test unique (user_id, test_name);
  end if;
end;
$$;

create table if not exists public.logic_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  username text not null,
  test_name text not null,
  question_number integer not null check (question_number between 1 and 10),
  question_text text not null,
  answer_text text not null default '',
  created_at timestamptz not null default now()
);

alter table public.logic_answers add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.logic_answers add column if not exists username text;
alter table public.logic_answers add column if not exists test_name text;
alter table public.logic_answers add column if not exists question_number integer;
alter table public.logic_answers add column if not exists question_text text;
alter table public.logic_answers add column if not exists answer_text text not null default '';
alter table public.logic_answers add column if not exists created_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'logic_answers_one_answer_per_question'
      and conrelid = 'public.logic_answers'::regclass
  ) then
    alter table public.logic_answers
    add constraint logic_answers_one_answer_per_question unique (user_id, test_name, question_number);
  end if;
end;
$$;

create table if not exists public.test_settings (
  test_name text primary key,
  is_open boolean not null default true,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  language text not null default 'en' check (language in ('en', 'ru', 'uk', 'es')),
  display_role text not null default 'Junior SysAdmin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.discussion_comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  username text not null,
  topic_id text not null default 'technical-moments',
  text text not null check (char_length(trim(text)) > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.admin_messages (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  author_username text not null,
  text text not null check (char_length(trim(text)) > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.notification_reads (
  user_id uuid primary key references auth.users(id) on delete cascade,
  last_read_at timestamptz not null default 'epoch'::timestamptz,
  updated_at timestamptz not null default now()
);

insert into public.test_settings (test_name, is_open)
values ('Первый тест', true)
on conflict (test_name) do nothing;

create or replace function public.calculate_lms_level(total_xp integer)
returns integer
language plpgsql
immutable
as $$
declare
  current_level integer := 1;
  remaining_xp integer := greatest(total_xp, 0);
  needed integer;
begin
  while current_level < 50 loop
    needed := case
      when current_level = 1 then 20
      when current_level = 2 then 50
      when current_level = 3 then 100
      when current_level = 4 then 200
      when current_level = 5 then 350
      when current_level = 6 then 500
      when current_level = 7 then 700
      when current_level = 8 then 900
      when current_level = 9 then 1200
      when current_level = 10 then 1500
      when current_level = 11 then 1800
      when current_level = 12 then 2200
      when current_level = 13 then 2600
      when current_level = 14 then 3000
      when current_level >= 15 and current_level < 20 then 500
      when current_level >= 20 and current_level < 30 then 800
      when current_level >= 30 and current_level < 40 then 1200
      else 2000
    end;

    if remaining_xp < needed then
      return current_level;
    end if;

    remaining_xp := remaining_xp - needed;
    current_level := current_level + 1;
  end loop;

  return current_level;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.apply_admin_code(p_code text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_role text;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_code = 'mls234692' then
    v_role := 'admin';
  elsif p_code = 'nomls234692' then
    v_role := 'user';
  else
    raise exception 'Invalid admin code';
  end if;

  update public.profiles
  set role = v_role
  where id = v_user_id;

  return v_role;
end;
$$;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    username,
    region,
    xp,
    level,
    rating,
    role
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    'SD',
    0,
    1,
    0,
    'user'
  )
  on conflict (id) do nothing;

  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;

create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

create or replace function public.submit_test_attempt(
  p_test_name text,
  p_username text,
  p_score integer,
  p_total_questions integer,
  p_logic_answers jsonb
)
returns table (
  score integer,
  total_questions integer,
  xp_earned integer,
  total_xp integer,
  level integer,
  rating integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_is_open boolean;
  v_username text;
  v_xp_earned integer;
  v_total_xp integer;
  v_level integer;
  v_rating integer;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select is_open into v_is_open
  from public.test_settings
  where test_name = p_test_name;

  if coalesce(v_is_open, true) = false then
    raise exception 'Test is closed';
  end if;

  if p_score < 0 or p_score > p_total_questions then
    raise exception 'Invalid score';
  end if;

  if p_total_questions <> 30 then
    raise exception 'Invalid total question count';
  end if;

  if jsonb_typeof(p_logic_answers) <> 'array' or jsonb_array_length(p_logic_answers) <> 10 then
    raise exception 'Exactly 10 logic answers are required';
  end if;

  select username into v_username
  from public.profiles
  where id = v_user_id;

  if v_username is null then
    raise exception 'Profile not found';
  end if;

  v_xp_earned := (p_score * 10) + 50;

  insert into public.test_results (
    user_id,
    username,
    test_name,
    score,
    total_questions,
    xp_earned
  )
  values (
    v_user_id,
    v_username,
    p_test_name,
    p_score,
    p_total_questions,
    v_xp_earned
  );

  insert into public.logic_answers (
    user_id,
    username,
    test_name,
    question_number,
    question_text,
    answer_text
  )
  select
    v_user_id,
    v_username,
    p_test_name,
    item.question_number,
    item.question_text,
    item.answer_text
  from jsonb_to_recordset(p_logic_answers) as item(
    question_number integer,
    question_text text,
    answer_text text
  );

  update public.profiles
  set
    xp = xp + v_xp_earned,
    rating = rating + p_score,
    level = public.calculate_lms_level(xp + v_xp_earned)
  where id = v_user_id
  returning profiles.xp, profiles.level, profiles.rating
  into v_total_xp, v_level, v_rating;

  return query
  select p_score, p_total_questions, v_xp_earned, v_total_xp, v_level, v_rating;
end;
$$;

alter table public.profiles enable row level security;
alter table public.test_results enable row level security;
alter table public.logic_answers enable row level security;
alter table public.test_settings enable row level security;
alter table public.user_preferences enable row level security;
alter table public.discussion_comments enable row level security;
alter table public.admin_messages enable row level security;
alter table public.notification_reads enable row level security;

drop policy if exists "Profiles are readable by authenticated users" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Admins can update profiles" on public.profiles;

create policy "Profiles are readable by authenticated users"
on public.profiles for select
to authenticated
using (true);

create policy "Users can insert own profile"
on public.profiles for insert
to authenticated
with check (
  auth.uid() = id
  and role = 'user'
  and xp = 0
  and level = 1
  and rating = 0
);

create policy "Admins can update profiles"
on public.profiles for update
to authenticated
using (public.is_admin())
with check (true);

drop policy if exists "Users can read leaderboard results" on public.test_results;
drop policy if exists "Users can insert own test result" on public.test_results;
drop policy if exists "Admins can manage test results" on public.test_results;

create policy "Users can read leaderboard results"
on public.test_results for select
to authenticated
using (true);

create policy "Users can insert own test result"
on public.test_results for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Admins can manage test results"
on public.test_results for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users can insert own logic answers" on public.logic_answers;
drop policy if exists "Users can read own logic answers" on public.logic_answers;
drop policy if exists "Admins can read all logic answers" on public.logic_answers;

create policy "Users can insert own logic answers"
on public.logic_answers for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can read own logic answers"
on public.logic_answers for select
to authenticated
using (auth.uid() = user_id);

create policy "Admins can read all logic answers"
on public.logic_answers for select
to authenticated
using (public.is_admin());

drop policy if exists "Users can read test settings" on public.test_settings;
drop policy if exists "Admins can manage test settings" on public.test_settings;

create policy "Users can read test settings"
on public.test_settings for select
to authenticated
using (true);

create policy "Admins can manage test settings"
on public.test_settings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users can read own preferences" on public.user_preferences;
drop policy if exists "Users can insert own preferences" on public.user_preferences;
drop policy if exists "Users can update own preferences" on public.user_preferences;

create policy "Users can read own preferences"
on public.user_preferences for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own preferences"
on public.user_preferences for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own preferences"
on public.user_preferences for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Authenticated users can read discussion comments" on public.discussion_comments;
drop policy if exists "Users can insert own discussion comments" on public.discussion_comments;
drop policy if exists "Admins can manage discussion comments" on public.discussion_comments;

create policy "Authenticated users can read discussion comments"
on public.discussion_comments for select
to authenticated
using (true);

create policy "Users can insert own discussion comments"
on public.discussion_comments for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.username = discussion_comments.username
  )
);

create policy "Admins can manage discussion comments"
on public.discussion_comments for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Authenticated users can read admin messages" on public.admin_messages;
drop policy if exists "Admins can insert admin messages" on public.admin_messages;
drop policy if exists "Admins can manage admin messages" on public.admin_messages;

create policy "Authenticated users can read admin messages"
on public.admin_messages for select
to authenticated
using (true);

create policy "Admins can insert admin messages"
on public.admin_messages for insert
to authenticated
with check (
  public.is_admin()
  and auth.uid() = author_id
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.username = admin_messages.author_username
  )
);

create policy "Admins can manage admin messages"
on public.admin_messages for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users can read own notification reads" on public.notification_reads;
drop policy if exists "Users can insert own notification reads" on public.notification_reads;
drop policy if exists "Users can update own notification reads" on public.notification_reads;

create policy "Users can read own notification reads"
on public.notification_reads for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own notification reads"
on public.notification_reads for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own notification reads"
on public.notification_reads for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

grant execute on function public.is_admin() to authenticated;
grant execute on function public.apply_admin_code(text) to authenticated;
grant execute on function public.submit_test_attempt(text, text, integer, integer, jsonb) to authenticated;
grant execute on function public.handle_new_user_profile() to authenticated;
