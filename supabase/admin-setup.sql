-- Run this only after 001_victoria_catalog.sql and 002_victoria_content.sql.
-- First create an Email/Password user in Supabase Dashboard → Authentication → Users
-- using the intended owner email. Do not place the password in this repository or SQL Editor history.

select id, email, created_at
from auth.users
where lower(email) = lower('victoria@gmail.waqedi');

-- After confirming that the query above returns exactly one user, grant that user access to the dashboard.
insert into public.admin_users (user_id)
select id
from auth.users
where lower(email) = lower('victoria@gmail.waqedi')
on conflict (user_id) do nothing;

-- Verification: this must return one row before the owner signs in at /admin/login.
select u.email, a.created_at as admin_granted_at
from public.admin_users a
join auth.users u on u.id = a.user_id
where lower(u.email) = lower('victoria@gmail.waqedi');
