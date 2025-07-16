-- Sample Data for Testing Database Schema
-- Description: Creates sample projects and tasks for testing
-- Usage: Run this after running the main migrations
-- Created: 2025-07-16

-- Start transaction
BEGIN;

-- Clear existing data (for testing purposes)
DELETE FROM tasks;
DELETE FROM projects;

-- Insert sample projects
INSERT INTO projects (id, name, description) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Personal Tasks', 'Personal todo items and goals'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Work Project', 'Professional tasks and deadlines'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Home Improvement', 'House maintenance and upgrade tasks'),
    ('550e8400-e29b-41d4-a716-446655440004', 'Learning Goals', 'Educational and skill development tasks');

-- Insert sample tasks
INSERT INTO tasks (title, description, completed, priority, due_date, project_id) VALUES
    -- Personal Tasks
    ('Buy groceries', 'Weekly grocery shopping - milk, bread, eggs, fruits', false, 'medium', '2025-07-17 18:00:00+00', '550e8400-e29b-41d4-a716-446655440001'),
    ('Schedule dentist appointment', 'Call dentist office to schedule routine cleaning', false, 'high', '2025-07-18 09:00:00+00', '550e8400-e29b-41d4-a716-446655440001'),
    ('Plan weekend trip', 'Research destinations and book accommodation', false, 'low', '2025-07-25 12:00:00+00', '550e8400-e29b-41d4-a716-446655440001'),
    ('Update resume', 'Add recent projects and skills to resume', true, 'medium', '2025-07-15 17:00:00+00', '550e8400-e29b-41d4-a716-446655440001'),
    
    -- Work Project
    ('Finish quarterly report', 'Complete Q2 sales analysis and projections', false, 'high', '2025-07-20 17:00:00+00', '550e8400-e29b-41d4-a716-446655440002'),
    ('Team meeting preparation', 'Prepare slides and agenda for Monday meeting', false, 'medium', '2025-07-21 09:00:00+00', '550e8400-e29b-41d4-a716-446655440002'),
    ('Code review', 'Review pull requests from team members', true, 'medium', '2025-07-16 10:00:00+00', '550e8400-e29b-41d4-a716-446655440002'),
    ('Update project documentation', 'Document new API endpoints and usage examples', false, 'low', '2025-07-22 15:00:00+00', '550e8400-e29b-41d4-a716-446655440002'),
    ('Deploy to staging', 'Deploy latest changes to staging environment', false, 'high', '2025-07-17 14:00:00+00', '550e8400-e29b-41d4-a716-446655440002'),
    
    -- Home Improvement
    ('Fix leaky faucet', 'Replace washer in kitchen sink faucet', false, 'high', '2025-07-18 10:00:00+00', '550e8400-e29b-41d4-a716-446655440003'),
    ('Paint living room', 'Choose color and paint the living room walls', false, 'medium', '2025-07-30 08:00:00+00', '550e8400-e29b-41d4-a716-446655440003'),
    ('Clean garage', 'Organize tools and clean out unused items', false, 'low', '2025-07-26 10:00:00+00', '550e8400-e29b-41d4-a716-446655440003'),
    ('Install new light fixture', 'Replace old dining room light with new LED fixture', true, 'medium', '2025-07-14 16:00:00+00', '550e8400-e29b-41d4-a716-446655440003'),
    
    -- Learning Goals
    ('Complete React course', 'Finish advanced React patterns course on online platform', false, 'high', '2025-07-28 23:59:00+00', '550e8400-e29b-41d4-a716-446655440004'),
    ('Read programming book', 'Read "Clean Code" by Robert Martin', false, 'medium', '2025-08-15 23:59:00+00', '550e8400-e29b-41d4-a716-446655440004'),
    ('Practice SQL queries', 'Complete 50 SQL challenges on coding platform', false, 'medium', '2025-08-01 23:59:00+00', '550e8400-e29b-41d4-a716-446655440004'),
    ('Learn TypeScript', 'Complete TypeScript fundamentals course', true, 'high', '2025-07-10 23:59:00+00', '550e8400-e29b-41d4-a716-446655440004'),
    ('Build portfolio website', 'Create personal portfolio showcasing projects', false, 'low', '2025-09-01 23:59:00+00', '550e8400-e29b-41d4-a716-446655440004');

-- Commit transaction
COMMIT;

-- Verify data was inserted
SELECT 
    p.name as project_name,
    COUNT(t.id) as task_count,
    COUNT(CASE WHEN t.completed = true THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN t.completed = false THEN 1 END) as pending_tasks
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
GROUP BY p.id, p.name
ORDER BY p.name;

-- Show all tasks with their projects
SELECT 
    p.name as project,
    t.title as task,
    t.priority,
    t.completed,
    t.due_date,
    t.created_at
FROM projects p
JOIN tasks t ON p.id = t.project_id
ORDER BY p.name, t.created_at;

-- Success message
SELECT 'Sample data inserted successfully!' as message;