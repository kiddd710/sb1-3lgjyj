-- Show all users with their roles
SELECT id, email, name, role, azure_id, created_at, updated_at 
FROM users
ORDER BY created_at DESC;

-- Show count of users by role
SELECT role, COUNT(*) 
FROM users 
GROUP BY role;