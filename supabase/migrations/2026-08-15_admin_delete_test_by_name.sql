-- Adds admin_delete_test_by_name(): removes every test_results / logic_answers /
-- logic_ai_reviews row for a given test_name across ALL users (not just one, unlike
-- admin_reset_test_attempt), reversing each affected user's xp/rating the same way
-- admin_reset_test_attempt does, and logging one admin_test_resets row per affected
-- user for audit. Meant for purging stray/test data (e.g. a leftover "QA Quiz Test"
-- entry) from the leaderboard without hand-editing the database.
-- Idempotent: safe to re-run.

create or replace function public.admin_delete_test_by_name(
  p_test_name text,
  p_reason text default 'Admin deleted test entries'
)
returns table (
  affected_users integer,
  removed_test_results integer,
  removed_logic_answers integer,
  removed_ai_reviews integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_user_id uuid := auth.uid();
  v_admin_username text;
  v_target record;
  v_test_xp integer;
  v_test_rating integer;
  v_test_count integer;
  v_ai_xp integer;
  v_ai_rating integer;
  v_ai_count integer;
  v_answers_count integer;
  v_xp_delta integer;
  v_rating_delta integer;
  v_affected_users integer := 0;
  v_total_test_results integer := 0;
  v_total_logic_answers integer := 0;
  v_total_ai_reviews integer := 0;
begin
  if v_admin_user_id is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_admin() then
    raise exception 'Admin role required';
  end if;

  if char_length(trim(coalesce(p_test_name, ''))) = 0 then
    raise exception 'Test name is required';
  end if;

  if char_length(trim(coalesce(p_reason, ''))) = 0 then
    raise exception 'Reason is required';
  end if;

  select profiles.username into v_admin_username
  from public.profiles
  where profiles.id = v_admin_user_id
    and profiles.role = 'admin';

  if v_admin_username is null then
    raise exception 'Admin profile not found';
  end if;

  for v_target in
    select distinct user_id, username from (
      select user_id, username from public.test_results where test_name = p_test_name
      union
      select user_id, username from public.logic_answers where test_name = p_test_name
      union
      select user_id, username from public.logic_ai_reviews where test_name = p_test_name
    ) as targets
  loop
    select
      coalesce(sum(test_results.xp_earned), 0)::integer,
      coalesce(sum(test_results.score), 0)::integer,
      count(*)::integer
    into v_test_xp, v_test_rating, v_test_count
    from public.test_results
    where test_results.user_id = v_target.user_id
      and test_results.test_name = p_test_name;

    select
      coalesce(sum(logic_ai_reviews.xp_awarded), 0)::integer,
      coalesce(sum(logic_ai_reviews.rating_awarded), 0)::integer,
      count(*)::integer
    into v_ai_xp, v_ai_rating, v_ai_count
    from public.logic_ai_reviews
    where logic_ai_reviews.user_id = v_target.user_id
      and logic_ai_reviews.test_name = p_test_name;

    select count(*)::integer into v_answers_count
    from public.logic_answers
    where logic_answers.user_id = v_target.user_id
      and logic_answers.test_name = p_test_name;

    delete from public.test_results
    where test_results.user_id = v_target.user_id
      and test_results.test_name = p_test_name;

    delete from public.logic_answers
    where logic_answers.user_id = v_target.user_id
      and logic_answers.test_name = p_test_name;

    delete from public.logic_ai_reviews
    where logic_ai_reviews.user_id = v_target.user_id
      and logic_ai_reviews.test_name = p_test_name;

    v_xp_delta := -1 * (v_test_xp + v_ai_xp);
    v_rating_delta := -1 * (v_test_rating + v_ai_rating);

    update public.profiles
    set
      xp = greatest(public.profiles.xp + v_xp_delta, 0),
      rating = greatest(public.profiles.rating + v_rating_delta, 0),
      level = public.calculate_lms_level(greatest(public.profiles.xp + v_xp_delta, 0))
    where profiles.id = v_target.user_id;

    insert into public.admin_test_resets (
      target_user_id,
      target_username,
      admin_user_id,
      admin_username,
      test_name,
      removed_test_results,
      removed_logic_answers,
      removed_ai_reviews,
      xp_delta,
      rating_delta,
      reason
    )
    values (
      v_target.user_id,
      v_target.username,
      v_admin_user_id,
      v_admin_username,
      p_test_name,
      v_test_count,
      v_answers_count,
      v_ai_count,
      v_xp_delta,
      v_rating_delta,
      trim(p_reason)
    );

    v_affected_users := v_affected_users + 1;
    v_total_test_results := v_total_test_results + v_test_count;
    v_total_logic_answers := v_total_logic_answers + v_answers_count;
    v_total_ai_reviews := v_total_ai_reviews + v_ai_count;
  end loop;

  return query select v_affected_users, v_total_test_results, v_total_logic_answers, v_total_ai_reviews;
end;
$$;

grant execute on function public.admin_delete_test_by_name(text, text) to authenticated;
