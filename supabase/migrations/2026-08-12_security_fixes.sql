-- Security fixes for critical audit findings (2026-08-12).
-- Run this file once in the Supabase SQL Editor (or `supabase db push`),
-- after supabase_lms_schema.sql has already been applied.
-- Idempotent: safe to re-run.
--
-- Fixes:
--   1. Users could call apply_logic_ai_review() directly with a self-chosen
--      score, bypassing the OpenAI grading edge function entirely.
--   2. submit_test_attempt() silently treated an unknown/unregistered
--      test_name as "open", allowing unlimited XP/rating farming.
--   3. Direct client INSERT into test_results / logic_answers let users
--      bypass submit_test_attempt()'s validation entirely.
--   4. apply_admin_code() embedded a static, hardcoded admin-grant secret
--      in the database (mirrored in the old client bundle) with no
--      expiry or audit trail. Removed — admin role is now granted only
--      by an operator running `update public.profiles set role = 'admin'
--      where id = '<user-uuid>';` from the Supabase Dashboard.

-- 1) Close direct-insert bypass: all writes to these tables must go
--    through submit_test_attempt(), which is SECURITY DEFINER and
--    performs its own validation (test open, score bounds, question
--    counts) before inserting.
drop policy if exists "Users can insert own test result" on public.test_results;
drop policy if exists "Users can insert own logic answers" on public.logic_answers;

-- 2) Reject test attempts for a test_name that isn't registered in
--    test_settings, instead of silently allowing it.
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

  if not found then
    raise exception 'Unknown test';
  end if;

  if v_is_open = false then
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

-- 3) apply_logic_ai_review must only be callable by the trusted
--    grade-logic-answers Edge Function acting with its service_role key,
--    never directly by a logged-in user's own JWT. The old 5-arg
--    (authenticated-callable) version is dropped; the replacement adds
--    an explicit p_caller_user_id that must match the answer's owner,
--    so even the trusted caller can't grade someone else's answer under
--    the wrong identity.
drop function if exists public.apply_logic_ai_review(uuid, numeric, text, text, jsonb);

create or replace function public.apply_logic_ai_review(
  p_logic_answer_id uuid,
  p_caller_user_id uuid,
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
  if p_caller_user_id is null then
    raise exception 'Caller identity required';
  end if;

  select * into v_answer
  from public.logic_answers
  where id = p_logic_answer_id;

  if v_answer.id is null then
    raise exception 'Logic answer not found';
  end if;

  if v_answer.user_id <> p_caller_user_id then
    raise exception 'Answer does not belong to caller';
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

revoke execute on function public.apply_logic_ai_review(uuid, uuid, numeric, text, text, jsonb) from authenticated, anon, public;
grant execute on function public.apply_logic_ai_review(uuid, uuid, numeric, text, text, jsonb) to service_role;

-- 4) Remove the static admin-activation-code mechanism entirely (secret
--    was committed in plaintext in both this schema and the old JS
--    bundle). Admin role is granted manually going forward. Existing
--    admins (profiles.role = 'admin') are untouched by this change.
drop function if exists public.apply_admin_code(text);
