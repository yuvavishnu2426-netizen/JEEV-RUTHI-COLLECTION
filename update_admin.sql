-- Run this entire script in your Supabase SQL Editor to grant Admin access to the new email.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER STABLE
AS $$
  SELECT coalesce(
    (current_setting('request.jwt.claims', true)::json->>'email') IN ('sujithjai007@gmail.com', 'yuvavishnu2426@gmail.com'),
    false
  );
$$;

-- If the admin_users table exists, insert the new user just in case.
INSERT INTO public.admin_users (email, is_active)
VALUES ('yuvavishnu2426@gmail.com', true)
ON CONFLICT (email) DO NOTHING;
