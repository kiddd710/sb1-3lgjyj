-- Check user records
SELECT 
  id,
  email,
  role,
  azure_id,
  created_at,
  updated_at
FROM public.users
ORDER BY created_at DESC;

-- Check table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'users'
AND table_schema = 'public';

-- Check table privileges
SELECT *
FROM pg_catalog.pg_tables
WHERE schemaname = 'public'
AND tablename = 'users';