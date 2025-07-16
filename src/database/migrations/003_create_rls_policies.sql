-- Migration: Create Row Level Security policies
-- Description: Sets up RLS policies for projects and tasks tables
-- Version: 003
-- Created: 2025-07-16

-- Enable Row Level Security on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security on tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for projects table
-- Note: For a simple todo app, we'll allow all authenticated users to manage projects
-- In a multi-tenant app, you would filter by user_id or organization_id

-- Policy: Allow authenticated users to view all projects
CREATE POLICY "Users can view all projects" ON projects
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow authenticated users to insert projects
CREATE POLICY "Users can create projects" ON projects
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: Allow authenticated users to update projects
CREATE POLICY "Users can update projects" ON projects
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Allow authenticated users to delete projects
CREATE POLICY "Users can delete projects" ON projects
    FOR DELETE
    TO authenticated
    USING (true);

-- Create RLS policies for tasks table
-- Tasks are associated with projects, so users can manage tasks in any project

-- Policy: Allow authenticated users to view all tasks
CREATE POLICY "Users can view all tasks" ON tasks
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow authenticated users to insert tasks
CREATE POLICY "Users can create tasks" ON tasks
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: Allow authenticated users to update tasks
CREATE POLICY "Users can update tasks" ON tasks
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Allow authenticated users to delete tasks
CREATE POLICY "Users can delete tasks" ON tasks
    FOR DELETE
    TO authenticated
    USING (true);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON projects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON tasks TO authenticated;

-- Grant usage on sequences (for auto-incrementing IDs if needed)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Comments for documentation
COMMENT ON POLICY "Users can view all projects" ON projects IS 'Allow authenticated users to view all projects';
COMMENT ON POLICY "Users can create projects" ON projects IS 'Allow authenticated users to create new projects';
COMMENT ON POLICY "Users can update projects" ON projects IS 'Allow authenticated users to update existing projects';
COMMENT ON POLICY "Users can delete projects" ON projects IS 'Allow authenticated users to delete projects';

COMMENT ON POLICY "Users can view all tasks" ON tasks IS 'Allow authenticated users to view all tasks';
COMMENT ON POLICY "Users can create tasks" ON tasks IS 'Allow authenticated users to create new tasks';
COMMENT ON POLICY "Users can update tasks" ON tasks IS 'Allow authenticated users to update existing tasks';
COMMENT ON POLICY "Users can delete tasks" ON tasks IS 'Allow authenticated users to delete tasks';