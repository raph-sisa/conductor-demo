-- Database Schema Test Script
-- Description: Tests the database schema functionality
-- Usage: Run this after running migrations to verify everything works
-- Created: 2025-07-16

-- Test 1: Create a test project
INSERT INTO projects (name, description) VALUES ('Test Project', 'Testing database schema');

-- Test 2: Create a test task
INSERT INTO tasks (title, description, project_id) 
VALUES ('Test Task', 'Testing task creation', (SELECT id FROM projects WHERE name = 'Test Project'));

-- Test 3: Query projects and tasks
SELECT 
    p.name as project_name,
    p.description as project_description,
    t.title as task_title,
    t.description as task_description,
    t.completed,
    t.priority,
    t.created_at
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
ORDER BY p.name, t.created_at;

-- Test 4: Update task completion status
UPDATE tasks 
SET completed = true 
WHERE title = 'Test Task';

-- Test 5: Test foreign key constraint by trying to create task with invalid project_id
-- This should fail with foreign key constraint error
-- INSERT INTO tasks (title, project_id) VALUES ('Invalid Task', '00000000-0000-0000-0000-000000000000');

-- Test 6: Test cascade deletion
-- Create a temporary project and task
INSERT INTO projects (name) VALUES ('Temp Project');
INSERT INTO tasks (title, project_id) VALUES ('Temp Task', (SELECT id FROM projects WHERE name = 'Temp Project'));

-- Delete the project (should cascade delete the task)
DELETE FROM projects WHERE name = 'Temp Project';

-- Verify the task was deleted
SELECT COUNT(*) as temp_tasks_remaining FROM tasks WHERE title = 'Temp Task';

-- Test 7: Test updated_at trigger
-- First, get the current updated_at value
SELECT id, name, updated_at FROM projects WHERE name = 'Test Project';

-- Update the project (should automatically update updated_at)
UPDATE projects SET description = 'Updated description' WHERE name = 'Test Project';

-- Check that updated_at was changed
SELECT id, name, updated_at FROM projects WHERE name = 'Test Project';

-- Test 8: Test data validation constraints
-- These should fail due to CHECK constraints
-- INSERT INTO projects (name) VALUES (''); -- Should fail: empty name
-- INSERT INTO tasks (title, project_id) VALUES ('', (SELECT id FROM projects WHERE name = 'Test Project')); -- Should fail: empty title
-- INSERT INTO tasks (title, priority, project_id) VALUES ('Test Priority', 'invalid', (SELECT id FROM projects WHERE name = 'Test Project')); -- Should fail: invalid priority

-- Test 9: Test RLS policies (basic test)
-- This assumes we're connected as an authenticated user
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd
FROM pg_policies 
WHERE tablename IN ('projects', 'tasks')
ORDER BY tablename, policyname;

-- Test 10: Test indexes exist
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('projects', 'tasks')
ORDER BY tablename, indexname;

-- Cleanup test data
DELETE FROM projects WHERE name = 'Test Project';

-- Success message
SELECT 'Schema tests completed successfully!' as message;