# API Documentation

## Overview

This document provides comprehensive API documentation for the To-Do App services. The application uses Supabase as the backend, providing both REST API endpoints and real-time functionality.

## Base Configuration

### Supabase Client Setup

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Task API Service

### Overview
The Task API service (`src/services/taskService.js`) provides CRUD operations for task management.

### Data Types

#### Task Object
```typescript
interface Task {
  id: string;              // UUID, primary key
  title: string;           // Required, task title
  description?: string;    // Optional, task description
  completed: boolean;      // Default: false
  project_id?: string;     // Optional, foreign key to projects
  created_at: string;      // ISO timestamp
  updated_at: string;      // ISO timestamp
}
```

#### Task Creation Input
```typescript
interface CreateTaskInput {
  title: string;
  description?: string;
  project_id?: string;
}
```

#### Task Update Input
```typescript
interface UpdateTaskInput {
  title?: string;
  description?: string;
  completed?: boolean;
  project_id?: string;
}
```

### API Methods

#### getTasks()
Retrieves all tasks for the current user.

```javascript
const getTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};
```

**Returns**: `Promise<Task[]>`
**Throws**: `Error` if database operation fails

#### getTaskById(id)
Retrieves a single task by ID.

```javascript
const getTaskById = async (id) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};
```

**Parameters**:
- `id` (string): Task UUID

**Returns**: `Promise<Task>`
**Throws**: `Error` if task not found or database operation fails

#### createTask(taskData)
Creates a new task.

```javascript
const createTask = async (taskData) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([taskData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
```

**Parameters**:
- `taskData` (CreateTaskInput): Task creation data

**Returns**: `Promise<Task>`
**Throws**: `Error` if validation fails or database operation fails

#### updateTask(id, updates)
Updates an existing task.

```javascript
const updateTask = async (id, updates) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
```

**Parameters**:
- `id` (string): Task UUID
- `updates` (UpdateTaskInput): Fields to update

**Returns**: `Promise<Task>`
**Throws**: `Error` if task not found or database operation fails

#### deleteTask(id)
Deletes a task by ID.

```javascript
const deleteTask = async (id) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};
```

**Parameters**:
- `id` (string): Task UUID

**Returns**: `Promise<void>`
**Throws**: `Error` if task not found or database operation fails

#### toggleTaskComplete(id)
Toggles the completion status of a task.

```javascript
const toggleTaskComplete = async (id) => {
  // First get current status
  const { data: currentTask, error: fetchError } = await supabase
    .from('tasks')
    .select('completed')
    .eq('id', id)
    .single();
  
  if (fetchError) throw fetchError;
  
  // Update with opposite status
  const { data, error } = await supabase
    .from('tasks')
    .update({
      completed: !currentTask.completed,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
```

**Parameters**:
- `id` (string): Task UUID

**Returns**: `Promise<Task>`
**Throws**: `Error` if task not found or database operation fails

## Project API Service

### Overview
The Project API service (`src/services/projectService.js`) provides CRUD operations for project management.

### Data Types

#### Project Object
```typescript
interface Project {
  id: string;              // UUID, primary key
  name: string;            // Required, project name
  description?: string;    // Optional, project description
  created_at: string;      // ISO timestamp
  updated_at: string;      // ISO timestamp
}
```

#### Project Creation Input
```typescript
interface CreateProjectInput {
  name: string;
  description?: string;
}
```

#### Project Update Input
```typescript
interface UpdateProjectInput {
  name?: string;
  description?: string;
}
```

### API Methods

#### getProjects()
Retrieves all projects for the current user.

```javascript
const getProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};
```

**Returns**: `Promise<Project[]>`
**Throws**: `Error` if database operation fails

#### getProjectById(id)
Retrieves a single project by ID.

```javascript
const getProjectById = async (id) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};
```

**Parameters**:
- `id` (string): Project UUID

**Returns**: `Promise<Project>`
**Throws**: `Error` if project not found or database operation fails

#### createProject(projectData)
Creates a new project.

```javascript
const createProject = async (projectData) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
```

**Parameters**:
- `projectData` (CreateProjectInput): Project creation data

**Returns**: `Promise<Project>`
**Throws**: `Error` if validation fails or database operation fails

#### updateProject(id, updates)
Updates an existing project.

```javascript
const updateProject = async (id, updates) => {
  const { data, error } = await supabase
    .from('projects')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
```

**Parameters**:
- `id` (string): Project UUID
- `updates` (UpdateProjectInput): Fields to update

**Returns**: `Promise<Project>`
**Throws**: `Error` if project not found or database operation fails

#### deleteProject(id)
Deletes a project by ID.

```javascript
const deleteProject = async (id) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};
```

**Parameters**:
- `id` (string): Project UUID

**Returns**: `Promise<void>`
**Throws**: `Error` if project not found or database operation fails

#### getProjectWithTasks(id)
Retrieves a project with all its associated tasks.

```javascript
const getProjectWithTasks = async (id) => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      tasks (*)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};
```

**Parameters**:
- `id` (string): Project UUID

**Returns**: `Promise<Project & { tasks: Task[] }>`
**Throws**: `Error` if project not found or database operation fails

## Error Handling

### Common Error Types

#### Database Errors
```javascript
// Example error handling
try {
  const tasks = await getTasks();
} catch (error) {
  if (error.code === 'PGRST116') {
    // No rows returned
    console.log('No tasks found');
  } else if (error.code === '42501') {
    // Insufficient privilege
    console.error('Access denied');
  } else {
    console.error('Database error:', error.message);
  }
}
```

#### Network Errors
```javascript
// Handle network connectivity issues
try {
  const tasks = await getTasks();
} catch (error) {
  if (error.message.includes('network')) {
    // Handle offline scenario
    console.error('Network error - check connectivity');
  }
}
```

### Error Response Format
```typescript
interface ApiError {
  message: string;
  code?: string;
  details?: any;
  hint?: string;
}
```

## Real-time Subscriptions

### Task Subscriptions

```javascript
// Subscribe to task changes
const subscribeToTasks = (callback) => {
  const subscription = supabase
    .channel('tasks')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'tasks'
    }, callback)
    .subscribe();
  
  return subscription;
};

// Usage
const subscription = subscribeToTasks((payload) => {
  console.log('Task changed:', payload);
  // Update UI accordingly
});

// Cleanup
subscription.unsubscribe();
```

### Project Subscriptions

```javascript
// Subscribe to project changes
const subscribeToProjects = (callback) => {
  const subscription = supabase
    .channel('projects')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'projects'
    }, callback)
    .subscribe();
  
  return subscription;
};
```

## Best Practices

### 1. Error Handling
Always wrap API calls in try-catch blocks and provide meaningful error messages to users.

### 2. Loading States
Show loading indicators during API operations to improve user experience.

### 3. Optimistic Updates
Update UI immediately for better responsiveness, then sync with server.

### 4. Batch Operations
Group multiple API calls when possible to reduce network requests.

### 5. Data Validation
Validate data on both client and server sides.

## Testing

### Unit Tests Example
```javascript
import { getTasks, createTask } from '../services/taskService';

describe('Task Service', () => {
  test('getTasks returns array of tasks', async () => {
    const tasks = await getTasks();
    expect(Array.isArray(tasks)).toBe(true);
  });
  
  test('createTask creates a new task', async () => {
    const taskData = {
      title: 'Test Task',
      description: 'Test Description'
    };
    
    const newTask = await createTask(taskData);
    expect(newTask.title).toBe(taskData.title);
    expect(newTask.id).toBeDefined();
  });
});
```

### Integration Tests
```javascript
// Test API service with mock Supabase client
jest.mock('@supabase/supabase-js');

// Test real database operations (use test database)
describe('API Integration', () => {
  beforeEach(async () => {
    // Setup test data
  });
  
  afterEach(async () => {
    // Cleanup test data
  });
  
  // Test cases...
});
```