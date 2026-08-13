-- Adds the missing "user can update own profile" RLS policy.
-- Without it, registerUser()'s client-side upsert() fails with an RLS
-- error whenever handle_new_user_profile() has already inserted the row
-- via trigger (the upsert then becomes an UPDATE, and only admins had
-- an UPDATE policy). A protective trigger stops non-admins from changing
-- role/xp/level/rating through this path — those must only ever change
-- via the SECURITY DEFINER functions (submit_test_attempt, admin_*).
-- Idempotent: safe to re-run.

create or replace function public.protect_profile_privileged_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.role := old.role;
    new.xp := old.xp;
    new.level := old.level;
    new.rating := old.rating;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_privileged_fields on public.profiles;

create trigger protect_profile_privileged_fields
before update on public.profiles
for each row execute function public.protect_profile_privileged_fields();

drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can update own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
