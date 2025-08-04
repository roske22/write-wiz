-- Fix security warnings by setting search_path for functions

-- Update get_user_role function with proper search_path
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id ORDER BY created_at DESC LIMIT 1;
$$;

-- Update get_current_user_profile function with proper search_path
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS TABLE(id UUID, email TEXT, display_name TEXT, avatar_url TEXT)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT p.id, p.email, p.display_name, p.avatar_url 
  FROM public.profiles p 
  WHERE p.id = auth.uid();
$$;

-- Update update_updated_at_column function with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;