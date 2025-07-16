-- Rollback Migration Script
-- Description: Rolls back all database migrations
-- Usage: Execute this script to undo all migrations
-- WARNING: This will delete all data in the projects and tasks tables!
-- Created: 2025-07-16

-- Start transaction
BEGIN;

-- Drop RLS policies first
DROP POLICY IF EXISTS "Users can view all projects" ON projects;
DROP POLICY IF EXISTS "Users can create projects" ON projects;
DROP POLICY IF EXISTS "Users can update projects" ON projects;
DROP POLICY IF EXISTS "Users can delete projects" ON projects;

DROP POLICY IF EXISTS "Users can view all tasks" ON tasks;
DROP POLICY IF EXISTS "Users can create tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete tasks" ON tasks;

-- Drop tables (cascade will handle foreign key constraints)
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Drop the trigger function if no other tables are using it
-- Note: Be careful with this in production - other tables might use this function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Revoke permissions (if needed)
REVOKE SELECT, INSERT, UPDATE, DELETE ON projects FROM authenticated;
REVOKE SELECT, INSERT, UPDATE, DELETE ON tasks FROM authenticated;

-- Commit transaction
COMMIT;

-- Success message
SELECT 'Database migrations rolled back successfully!' as message;