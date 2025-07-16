-- Master Migration Script
-- Description: Runs all database migrations in the correct order
-- Usage: Execute this script in your Supabase SQL editor or via CLI
-- Created: 2025-07-16

-- Start transaction
BEGIN;

-- Migration 001: Create projects table
-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL CHECK (length(name) >= 1),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at column
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(name);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Migration 002: Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL CHECK (length(title) >= 1),
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date TIMESTAMP WITH TIME ZONE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for updated_at column
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_title ON tasks(title);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_project_completed ON tasks(project_id, completed);
CREATE INDEX IF NOT EXISTS idx_tasks_project_priority ON tasks(project_id, priority);

-- Migration 003: Create RLS policies
-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all projects" ON projects;
DROP POLICY IF EXISTS "Users can create projects" ON projects;
DROP POLICY IF EXISTS "Users can update projects" ON projects;
DROP POLICY IF EXISTS "Users can delete projects" ON projects;
DROP POLICY IF EXISTS "Users can view all tasks" ON tasks;
DROP POLICY IF EXISTS "Users can create tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete tasks" ON tasks;

-- Create RLS policies for projects table
CREATE POLICY "Users can view all projects" ON projects
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create projects" ON projects
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update projects" ON projects
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Users can delete projects" ON projects
    FOR DELETE TO authenticated USING (true);

-- Create RLS policies for tasks table
CREATE POLICY "Users can view all tasks" ON tasks
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create tasks" ON tasks
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update tasks" ON tasks
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Users can delete tasks" ON tasks
    FOR DELETE TO authenticated USING (true);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON projects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON tasks TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Commit transaction
COMMIT;

-- Success message
SELECT 'Database migrations completed successfully!' as message;