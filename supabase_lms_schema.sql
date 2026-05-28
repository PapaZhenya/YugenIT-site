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

create table if not exists public.admin_test_attempts (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references auth.users(id) on delete cascade,
  admin_username text not null,
  test_name text not null,
  score integer not null check (score >= 0),
  total_questions integer not null check (total_questions > 0),
  logic_answers jsonb not null default '[]'::jsonb,
  attempt_type text not null default 'admin_test_attempt',
  created_at timestamptz not null default now()
);

alter table public.admin_test_attempts add column if not exists admin_user_id uuid references auth.users(id) on delete cascade;
alter table public.admin_test_attempts add column if not exists admin_username text;
alter table public.admin_test_attempts add column if not exists test_name text;
alter table public.admin_test_attempts add column if not exists score integer;
alter table public.admin_test_attempts add column if not exists total_questions integer;
alter table public.admin_test_attempts add column if not exists logic_answers jsonb not null default '[]'::jsonb;
alter table public.admin_test_attempts add column if not exists attempt_type text not null default 'admin_test_attempt';
alter table public.admin_test_attempts add column if not exists created_at timestamptz not null default now();

create table if not exists public.admin_rating_adjustments (
  id uuid primary key default gen_random_uuid(),
  target_user_id uuid not null references auth.users(id) on delete cascade,
  target_username text not null,
  admin_user_id uuid not null references auth.users(id) on delete cascade,
  admin_username text not null,
  xp_delta integer not null default 0,
  rating_delta integer not null default 0,
  reason text not null check (char_length(trim(reason)) > 0),
  created_at timestamptz not null default now()
);

alter table public.admin_rating_adjustments add column if not exists target_user_id uuid references auth.users(id) on delete cascade;
alter table public.admin_rating_adjustments add column if not exists target_username text;
alter table public.admin_rating_adjustments add column if not exists admin_user_id uuid references auth.users(id) on delete cascade;
alter table public.admin_rating_adjustments add column if not exists admin_username text;
alter table public.admin_rating_adjustments add column if not exists xp_delta integer not null default 0;
alter table public.admin_rating_adjustments add column if not exists rating_delta integer not null default 0;
alter table public.admin_rating_adjustments add column if not exists reason text;
alter table public.admin_rating_adjustments add column if not exists created_at timestamptz not null default now();

create table if not exists public.logic_ai_reviews (
  id uuid primary key default gen_random_uuid(),
  logic_answer_id uuid not null references public.logic_answers(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  username text not null,
  test_name text not null,
  question_number integer not null check (question_number between 1 and 10),
  ai_score numeric(3,1) not null check (ai_score >= 0 and ai_score <= 5),
  max_score integer not null default 5,
  ai_feedback text not null,
  xp_awarded integer not null default 0 check (xp_awarded >= 0),
  rating_awarded integer not null default 0 check (rating_awarded >= 0),
  model text not null,
  raw_response jsonb not null default '{}'::jsonb,
  reviewed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (logic_answer_id)
);

alter table public.logic_ai_reviews add column if not exists logic_answer_id uuid references public.logic_answers(id) on delete cascade;
alter table public.logic_ai_reviews add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.logic_ai_reviews add column if not exists username text;
alter table public.logic_ai_reviews add column if not exists test_name text;
alter table public.logic_ai_reviews add column if not exists question_number integer;
alter table public.logic_ai_reviews add column if not exists ai_score numeric(3,1);
alter table public.logic_ai_reviews add column if not exists max_score integer not null default 5;
alter table public.logic_ai_reviews add column if not exists ai_feedback text;
alter table public.logic_ai_reviews add column if not exists xp_awarded integer not null default 0;
alter table public.logic_ai_reviews add column if not exists rating_awarded integer not null default 0;
alter table public.logic_ai_reviews add column if not exists model text;
alter table public.logic_ai_reviews add column if not exists raw_response jsonb not null default '{}'::jsonb;
alter table public.logic_ai_reviews add column if not exists reviewed_at timestamptz not null default now();
alter table public.logic_ai_reviews add column if not exists created_at timestamptz not null default now();
alter table public.logic_ai_reviews add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'logic_ai_reviews_logic_answer_id_key'
      and conrelid = 'public.logic_ai_reviews'::regclass
  ) then
    alter table public.logic_ai_reviews
    add constraint logic_ai_reviews_logic_answer_id_key unique (logic_answer_id);
  end if;
end;
$$;

create table if not exists public.logic_ai_review_adjustments (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.logic_ai_reviews(id) on delete cascade,
  logic_answer_id uuid not null references public.logic_answers(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  username text not null,
  admin_user_id uuid not null references auth.users(id) on delete cascade,
  admin_username text not null,
  old_score numeric(3,1) not null,
  new_score numeric(3,1) not null,
  old_feedback text,
  new_feedback text not null,
  xp_delta integer not null,
  rating_delta integer not null,
  reason text not null check (char_length(trim(reason)) > 0),
  created_at timestamptz not null default now()
);

alter table public.logic_ai_review_adjustments add column if not exists review_id uuid references public.logic_ai_reviews(id) on delete cascade;
alter table public.logic_ai_review_adjustments add column if not exists logic_answer_id uuid references public.logic_answers(id) on delete cascade;
alter table public.logic_ai_review_adjustments add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.logic_ai_review_adjustments add column if not exists username text;
alter table public.logic_ai_review_adjustments add column if not exists admin_user_id uuid references auth.users(id) on delete cascade;
alter table public.logic_ai_review_adjustments add column if not exists admin_username text;
alter table public.logic_ai_review_adjustments add column if not exists old_score numeric(3,1);
alter table public.logic_ai_review_adjustments add column if not exists new_score numeric(3,1);
alter table public.logic_ai_review_adjustments add column if not exists old_feedback text;
alter table public.logic_ai_review_adjustments add column if not exists new_feedback text;
alter table public.logic_ai_review_adjustments add column if not exists xp_delta integer;
alter table public.logic_ai_review_adjustments add column if not exists rating_delta integer;
alter table public.logic_ai_review_adjustments add column if not exists reason text;
alter table public.logic_ai_review_adjustments add column if not exists created_at timestamptz not null default now();

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

  if public.is_admin() then
    insert into public.admin_test_attempts (
      admin_user_id,
      admin_username,
      test_name,
      score,
      total_questions,
      logic_answers,
      attempt_type
    )
    values (
      v_user_id,
      v_username,
      p_test_name,
      p_score,
      p_total_questions,
      p_logic_answers,
      'admin_test_attempt'
    );

    return query
    select p_score, p_total_questions, 0, 0, 0, 0;
    return;
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
    xp = public.profiles.xp + v_xp_earned,
    rating = public.profiles.rating + p_score,
    level = public.calculate_lms_level(public.profiles.xp + v_xp_earned)
  where id = v_user_id
  returning profiles.xp, profiles.level, profiles.rating
  into v_total_xp, v_level, v_rating;

  return query
  select p_score, p_total_questions, v_xp_earned, v_total_xp, v_level, v_rating;
end;
$$;

create or replace function public.admin_adjust_user_points(
  p_target_user_id uuid,
  p_xp_delta integer,
  p_rating_delta integer,
  p_reason text
)
returns table (
  target_user_id uuid,
  username text,
  xp integer,
  rating integer,
  level integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_user_id uuid := auth.uid();
  v_admin_username text;
  v_target_username text;
  v_current_xp integer;
  v_current_rating integer;
  v_new_xp integer;
  v_new_rating integer;
  v_new_level integer;
begin
  if v_admin_user_id is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_admin() then
    raise exception 'Admin role required';
  end if;

  if coalesce(p_xp_delta, 0) = 0 and coalesce(p_rating_delta, 0) = 0 then
    raise exception 'No XP or rating change requested';
  end if;

  if char_length(trim(coalesce(p_reason, ''))) = 0 then
    raise exception 'Adjustment reason is required';
  end if;

  select profiles.username into v_admin_username
  from public.profiles
  where profiles.id = v_admin_user_id
    and profiles.role = 'admin';

  if v_admin_username is null then
    raise exception 'Admin profile not found';
  end if;

  select profiles.username, profiles.xp, profiles.rating
  into v_target_username, v_current_xp, v_current_rating
  from public.profiles
  where profiles.id = p_target_user_id;

  if v_target_username is null then
    raise exception 'Target profile not found';
  end if;

  v_new_xp := greatest(v_current_xp + coalesce(p_xp_delta, 0), 0);
  v_new_rating := greatest(v_current_rating + coalesce(p_rating_delta, 0), 0);
  v_new_level := public.calculate_lms_level(v_new_xp);

  update public.profiles
  set
    xp = v_new_xp,
    rating = v_new_rating,
    level = v_new_level
  where profiles.id = p_target_user_id;

  insert into public.admin_rating_adjustments (
    target_user_id,
    target_username,
    admin_user_id,
    admin_username,
    xp_delta,
    rating_delta,
    reason
  )
  values (
    p_target_user_id,
    v_target_username,
    v_admin_user_id,
    v_admin_username,
    coalesce(p_xp_delta, 0),
    coalesce(p_rating_delta, 0),
    trim(p_reason)
  );

  return query
  select p_target_user_id, v_target_username, v_new_xp, v_new_rating, v_new_level;
end;
$$;

create or replace function public.apply_logic_ai_review(
  p_logic_answer_id uuid,
  p_ai_score numeric,
  p_ai_feedback text,
  p_model text,
  p_raw_response jsonb
)
returns table (
  review_id uuid,
  logic_answer_id uuid,
  ai_score numeric,
  max_score integer,
  xp_awarded integer,
  rating_awarded integer,
  ai_feedback text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_answer public.logic_answers%rowtype;
  v_review public.logic_ai_reviews%rowtype;
  v_score numeric(3,1);
  v_xp_awarded integer;
  v_rating_awarded integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select * into v_answer
  from public.logic_answers
  where id = p_logic_answer_id;

  if v_answer.id is null then
    raise exception 'Logic answer not found';
  end if;

  if auth.uid() <> v_answer.user_id and not public.is_admin() then
    raise exception 'Not allowed to review this answer';
  end if;

  select * into v_review
  from public.logic_ai_reviews
  where logic_ai_reviews.logic_answer_id = p_logic_answer_id;

  if v_review.id is not null then
    return query
    select
      v_review.id,
      v_review.logic_answer_id,
      v_review.ai_score,
      v_review.max_score,
      v_review.xp_awarded,
      v_review.rating_awarded,
      v_review.ai_feedback;
    return;
  end if;

  v_score := least(greatest(coalesce(p_ai_score, 0), 0), 5);
  v_xp_awarded := round(v_score * 10);
  v_rating_awarded := round(v_score * 2);

  insert into public.logic_ai_reviews (
    logic_answer_id,
    user_id,
    username,
    test_name,
    question_number,
    ai_score,
    max_score,
    ai_feedback,
    xp_awarded,
    rating_awarded,
    model,
    raw_response
  )
  values (
    p_logic_answer_id,
    v_answer.user_id,
    v_answer.username,
    v_answer.test_name,
    v_answer.question_number,
    v_score,
    5,
    trim(coalesce(p_ai_feedback, '')),
    v_xp_awarded,
    v_rating_awarded,
    coalesce(p_model, 'unknown'),
    coalesce(p_raw_response, '{}'::jsonb)
  )
  returning * into v_review;

  update public.profiles
  set
    xp = public.profiles.xp + v_xp_awarded,
    rating = public.profiles.rating + v_rating_awarded,
    level = public.calculate_lms_level(public.profiles.xp + v_xp_awarded)
  where profiles.id = v_answer.user_id;

  return query
  select
    v_review.id,
    v_review.logic_answer_id,
    v_review.ai_score,
    v_review.max_score,
    v_review.xp_awarded,
    v_review.rating_awarded,
    v_review.ai_feedback;
end;
$$;

create or replace function public.admin_override_logic_ai_review(
  p_review_id uuid,
  p_new_score numeric,
  p_new_feedback text,
  p_reason text
)
returns table (
  review_id uuid,
  username text,
  ai_score numeric,
  xp_awarded integer,
  rating_awarded integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_user_id uuid := auth.uid();
  v_admin_username text;
  v_review public.logic_ai_reviews%rowtype;
  v_old_score numeric(3,1);
  v_old_feedback text;
  v_old_xp integer;
  v_old_rating integer;
  v_new_score numeric(3,1);
  v_new_xp integer;
  v_new_rating integer;
  v_xp_delta integer;
  v_rating_delta integer;
begin
  if v_admin_user_id is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_admin() then
    raise exception 'Admin role required';
  end if;

  if char_length(trim(coalesce(p_reason, ''))) = 0 then
    raise exception 'Override reason is required';
  end if;

  select profiles.username into v_admin_username
  from public.profiles
  where profiles.id = v_admin_user_id
    and profiles.role = 'admin';

  select * into v_review
  from public.logic_ai_reviews
  where id = p_review_id;

  if v_review.id is null then
    raise exception 'AI review not found';
  end if;

  v_old_score := v_review.ai_score;
  v_old_feedback := v_review.ai_feedback;
  v_old_xp := v_review.xp_awarded;
  v_old_rating := v_review.rating_awarded;
  v_new_score := least(greatest(coalesce(p_new_score, 0), 0), 5);
  v_new_xp := round(v_new_score * 10);
  v_new_rating := round(v_new_score * 2);
  v_xp_delta := v_new_xp - v_old_xp;
  v_rating_delta := v_new_rating - v_old_rating;

  update public.logic_ai_reviews
  set
    ai_score = v_new_score,
    ai_feedback = trim(coalesce(p_new_feedback, v_review.ai_feedback)),
    xp_awarded = v_new_xp,
    rating_awarded = v_new_rating,
    updated_at = now()
  where id = p_review_id
  returning * into v_review;

  update public.profiles
  set
    xp = greatest(public.profiles.xp + v_xp_delta, 0),
    rating = greatest(public.profiles.rating + v_rating_delta, 0),
    level = public.calculate_lms_level(greatest(public.profiles.xp + v_xp_delta, 0))
  where profiles.id = v_review.user_id;

  insert into public.logic_ai_review_adjustments (
    review_id,
    logic_answer_id,
    user_id,
    username,
    admin_user_id,
    admin_username,
    old_score,
    new_score,
    old_feedback,
    new_feedback,
    xp_delta,
    rating_delta,
    reason
  )
  values (
    p_review_id,
    v_review.logic_answer_id,
    v_review.user_id,
    v_review.username,
    v_admin_user_id,
    v_admin_username,
    v_old_score,
    v_new_score,
    v_old_feedback,
    v_review.ai_feedback,
    v_xp_delta,
    v_rating_delta,
    trim(p_reason)
  );

  return query
  select v_review.id, v_review.username, v_review.ai_score, v_review.xp_awarded, v_review.rating_awarded;
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
alter table public.admin_test_attempts enable row level security;
alter table public.admin_rating_adjustments enable row level security;
alter table public.logic_ai_reviews enable row level security;
alter table public.logic_ai_review_adjustments enable row level security;

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

drop policy if exists "Admins can read admin test attempts" on public.admin_test_attempts;
drop policy if exists "Admins can insert admin test attempts" on public.admin_test_attempts;
drop policy if exists "Admins can manage admin test attempts" on public.admin_test_attempts;

create policy "Admins can read admin test attempts"
on public.admin_test_attempts for select
to authenticated
using (public.is_admin());

create policy "Admins can insert admin test attempts"
on public.admin_test_attempts for insert
to authenticated
with check (
  public.is_admin()
  and auth.uid() = admin_user_id
  and attempt_type = 'admin_test_attempt'
);

create policy "Admins can manage admin test attempts"
on public.admin_test_attempts for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read rating adjustments" on public.admin_rating_adjustments;
drop policy if exists "Admins can insert rating adjustments" on public.admin_rating_adjustments;
drop policy if exists "Admins can manage rating adjustments" on public.admin_rating_adjustments;

create policy "Admins can read rating adjustments"
on public.admin_rating_adjustments for select
to authenticated
using (public.is_admin());

create policy "Admins can insert rating adjustments"
on public.admin_rating_adjustments for insert
to authenticated
with check (
  public.is_admin()
  and auth.uid() = admin_user_id
);

create policy "Admins can manage rating adjustments"
on public.admin_rating_adjustments for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users can read own AI reviews" on public.logic_ai_reviews;
drop policy if exists "Admins can read all AI reviews" on public.logic_ai_reviews;
drop policy if exists "Service can insert AI reviews" on public.logic_ai_reviews;
drop policy if exists "Admins can manage AI reviews" on public.logic_ai_reviews;

create policy "Users can read own AI reviews"
on public.logic_ai_reviews for select
to authenticated
using (auth.uid() = user_id);

create policy "Admins can read all AI reviews"
on public.logic_ai_reviews for select
to authenticated
using (public.is_admin());

create policy "Service can insert AI reviews"
on public.logic_ai_reviews for insert
to authenticated
with check (auth.uid() = user_id or public.is_admin());

create policy "Admins can manage AI reviews"
on public.logic_ai_reviews for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read AI review adjustments" on public.logic_ai_review_adjustments;
drop policy if exists "Admins can insert AI review adjustments" on public.logic_ai_review_adjustments;
drop policy if exists "Admins can manage AI review adjustments" on public.logic_ai_review_adjustments;

create policy "Admins can read AI review adjustments"
on public.logic_ai_review_adjustments for select
to authenticated
using (public.is_admin());

create policy "Admins can insert AI review adjustments"
on public.logic_ai_review_adjustments for insert
to authenticated
with check (
  public.is_admin()
  and auth.uid() = admin_user_id
);

create policy "Admins can manage AI review adjustments"
on public.logic_ai_review_adjustments for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

grant execute on function public.is_admin() to authenticated;
grant execute on function public.apply_admin_code(text) to authenticated;
grant execute on function public.submit_test_attempt(text, text, integer, integer, jsonb) to authenticated;
grant execute on function public.admin_adjust_user_points(uuid, integer, integer, text) to authenticated;
grant execute on function public.apply_logic_ai_review(uuid, numeric, text, text, jsonb) to authenticated;
grant execute on function public.admin_override_logic_ai_review(uuid, numeric, text, text) to authenticated;
grant execute on function public.handle_new_user_profile() to authenticated;
