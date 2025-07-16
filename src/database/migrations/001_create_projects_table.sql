-- Migration: Create projects table
-- Description: Creates the projects table with proper schema and constraints
-- Version: 001
-- Created: 2025-07-16

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
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(name);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Add comments for documentation
COMMENT ON TABLE projects IS 'Projects table storing project information';
COMMENT ON COLUMN projects.id IS 'Unique identifier for the project';
COMMENT ON COLUMN projects.name IS 'Project name (required, min 1 character)';
COMMENT ON COLUMN projects.description IS 'Project description (optional)';
COMMENT ON COLUMN projects.created_at IS 'Timestamp when the project was created';
COMMENT ON COLUMN projects.updated_at IS 'Timestamp when the project was last updated';