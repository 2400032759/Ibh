-- Create a secure function to lookup email by username for authentication
CREATE OR REPLACE FUNCTION public.get_email_by_username(_username text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email
  FROM public.profiles
  WHERE username = _username
  LIMIT 1
$$;

-- Grant execute permission to anonymous users for login
GRANT EXECUTE ON FUNCTION public.get_email_by_username(text) TO anon, authenticated;