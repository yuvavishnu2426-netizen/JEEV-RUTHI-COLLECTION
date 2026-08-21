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
