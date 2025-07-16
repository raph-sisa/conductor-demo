# Database Schema Documentation

This directory contains the database schema and migration scripts for the Todo App project.

## Schema Overview

The database consists of two main tables:

1. **projects** - Stores project information
2. **tasks** - Stores task information with foreign key relationship to projects

## Table Schemas

### Projects Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| name | VARCHAR(255) | NOT NULL, CHECK (length >= 1) | Project name |
| description | TEXT | NULL | Project description |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update timestamp |

### Tasks Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| title | VARCHAR(255) | NOT NULL, CHECK (length >= 1) | Task title |
| description | TEXT | NULL | Task description |
| completed | BOOLEAN | DEFAULT FALSE | Completion status |
| priority | VARCHAR(10) | DEFAULT 'medium', CHECK (IN 'low', 'medium', 'high') | Task priority |
| due_date | TIMESTAMP WITH TIME ZONE | NULL | Optional due date |
| project_id | UUID | NOT NULL, REFERENCES projects(id) ON DELETE CASCADE | Foreign key to projects |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update timestamp |

## Migration Files

### Individual Migration Files

1. **001_create_projects_table.sql** - Creates the projects table with indexes and triggers
2. **002_create_tasks_table.sql** - Creates the tasks table with foreign key relationship
3. **003_create_rls_policies.sql** - Sets up Row Level Security policies

### Master Migration Files

- **run_migrations.sql** - Runs all migrations in sequence
- **rollback_migrations.sql** - Rolls back all migrations (⚠️ WARNING: Deletes all data!)

## How to Run Migrations

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the content of `run_migrations.sql`
4. Click "Run" to execute the migrations

### Option 2: Using Supabase CLI (if available)

```bash
# Run all migrations
supabase db reset
# Then run the migration file
```

### Option 3: Individual Migration Files

Execute each migration file in order:
1. `001_create_projects_table.sql`
2. `002_create_tasks_table.sql`
3. `003_create_rls_policies.sql`

## Row Level Security (RLS)

The schema includes RLS policies that:

- Allow authenticated users to perform all CRUD operations on projects
- Allow authenticated users to perform all CRUD operations on tasks
- Restrict access to authenticated users only

**Note**: The current RLS policies are basic and allow all authenticated users to access all data. For a production multi-tenant application, you would need more restrictive policies based on user ownership or organization membership.

## Database Indexes

The schema includes optimized indexes for:

### Projects Table
- `idx_projects_name` - For searching by project name
- `idx_projects_created_at` - For sorting by creation date

### Tasks Table
- `idx_tasks_title` - For searching by task title
- `idx_tasks_completed` - For filtering by completion status
- `idx_tasks_priority` - For filtering by priority
- `idx_tasks_project_id` - For filtering by project
- `idx_tasks_created_at` - For sorting by creation date
- `idx_tasks_due_date` - For filtering by due date
- `idx_tasks_project_completed` - Composite index for project + completion queries
- `idx_tasks_project_priority` - Composite index for project + priority queries

## Auto-updating Timestamps

Both tables include automatic timestamp updates:
- `created_at` is set automatically when a record is created
- `updated_at` is automatically updated whenever a record is modified

This is handled by the `update_updated_at_column()` trigger function.

## Foreign Key Relationships

- Tasks have a `project_id` foreign key that references `projects.id`
- The relationship uses `ON DELETE CASCADE`, meaning when a project is deleted, all its tasks are automatically deleted

## Sample Data

See the `seeds/` directory for sample data scripts to test the schema.

## Testing the Schema

After running migrations, you can test the schema with:

```sql
-- Test creating a project
INSERT INTO projects (name, description) VALUES ('Test Project', 'A test project');

-- Test creating a task
INSERT INTO tasks (title, description, project_id) 
VALUES ('Test Task', 'A test task', (SELECT id FROM projects WHERE name = 'Test Project'));

-- Test querying data
SELECT p.name as project_name, t.title as task_title, t.completed
FROM projects p
JOIN tasks t ON p.id = t.project_id;
```

## Rollback

⚠️ **WARNING**: The rollback script will delete all data in the projects and tasks tables!

To rollback all migrations, run `rollback_migrations.sql` in your Supabase SQL editor.

## Next Steps

After running the database migrations, you can:

1. Use the API services in `src/services/` to interact with the database
2. Test the schema with the seed data
3. Implement the frontend components to display and manage the data

## Troubleshooting

### Common Issues

1. **Permission Errors**: Make sure RLS policies are properly configured
2. **Foreign Key Errors**: Ensure projects exist before creating tasks
3. **UUID Generation**: Make sure the `gen_random_uuid()` function is available

### Checking Migration Status

You can check if migrations ran successfully by:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename IN ('projects', 'tasks');

-- Check policies
SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename IN ('projects', 'tasks');
```