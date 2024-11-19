-- Check all users and their roles
SELECT * FROM public.users;

-- Check table definition
SELECT 
    table_schema,
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users';

-- Check table grants
SELECT 
    grantee,
    privilege_type 
FROM information_schema.table_privileges 
WHERE table_schema = 'public' 
AND table_name = 'users';