-- Check existing users and their roles
SELECT 
  id,
  email,
  name,
  role,
  azure_id,
  created_at
FROM public.users
ORDER BY created_at DESC;

-- Check if the users table exists and its owner
SELECT 
  tablename,
  tableowner,
  hasindexes,
  hasrules,
  hastriggers
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename = 'users';

-- Check RLS status
SELECT 
  relname as table_name,
  relrowsecurity as rls_enabled,
  relforcerowsecurity as rls_forced
FROM pg_class
WHERE relname = 'users'
AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');