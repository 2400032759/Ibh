-- Add email field to profiles for username-based login
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Update existing profiles with email from auth.users
DO $$
DECLARE
  profile_record RECORD;
  user_email TEXT;
BEGIN
  FOR profile_record IN SELECT id FROM public.profiles WHERE email IS NULL
  LOOP
    SELECT email INTO user_email FROM auth.users WHERE id = profile_record.id;
    IF user_email IS NOT NULL THEN
      UPDATE public.profiles SET email = user_email WHERE id = profile_record.id;
    END IF;
  END LOOP;
END $$;

-- Update the trigger to also save email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    NEW.email
  );
  RETURN NEW;
END;
$$;