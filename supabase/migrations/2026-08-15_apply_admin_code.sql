-- Creates apply_admin_code(), referenced by the "Admin access code" field
-- on the profile page (script.js: applyAdminCode()). It was already present
-- in the aspirational supabase_lms_schema.sql but had never actually been
-- run against the live database — PostgREST returned "Could not find the
-- function public.apply_admin_code(p_code) in the schema cache".
--
-- Also updates protect_profile_privileged_fields (from
-- 2026-08-13_profile_self_update.sql): as written, that trigger reverts any
-- change to profiles.role unless the caller already has role = 'admin' —
-- which would silently undo what apply_admin_code is meant to do. The fix
-- only enforces that check for a direct client-side update; calls coming
-- from inside a SECURITY DEFINER function (current_user differs from
-- session_user while such a function runs) are left alone, matching how
-- the other admin_* functions already update these same columns.
--
-- Note (owner-accepted tradeoff, 2026-08-15): this repo is public, so the
-- code below is visible to anyone who reads it. Rotate it in the database
-- (and here) if that ever becomes a problem.
--
-- Idempotent: safe to re-run.

create or replace function public.protect_profile_privileged_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() and current_user = session_user then
    new.role := old.role;
    new.xp := old.xp;
    new.level := old.level;
    new.rating := old.rating;
  end if;
  return new;
end;
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

grant execute on function public.apply_admin_code(text) to authenticated;
