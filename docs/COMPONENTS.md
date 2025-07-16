# Component Documentation

## Overview

This document provides comprehensive documentation for all React components in the To-Do App. Each component follows consistent patterns for props, state management, and testing.

## Component Architecture

### File Structure
```
src/
├── components/
│   ├── Task/
│   │   ├── Task.jsx
│   │   ├── Task.test.js
│   │   └── Task.module.css
│   ├── TaskList/
│   │   ├── TaskList.jsx
│   │   ├── TaskList.test.js
│   │   └── TaskList.module.css
│   ├── AddTask/
│   │   ├── AddTask.jsx
│   │   ├── AddTask.test.js
│   │   └── AddTask.module.css
│   ├── Project/
│   │   ├── Project.jsx
│   │   ├── Project.test.js
│   │   └── Project.module.css
│   └── common/
│       ├── Button/
│       ├── Input/
│       └── Modal/
```

### Component Template

```jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './ComponentName.module.css';

/**
 * ComponentName - Brief description of what this component does
 * 
 * @param {Object} props - Component props
 * @param {string} props.requiredProp - Description of required prop
 * @param {string} [props.optionalProp] - Description of optional prop
 * @param {function} props.onAction - Description of callback function
 */
const ComponentName = ({ 
  requiredProp, 
  optionalProp = 'default value', 
  onAction 
}) => {
  const [localState, setLocalState] = useState(initialValue);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  const handleAction = (event) => {
    // Handle user interactions
    onAction?.(event);
  };

  return (
    <div className={styles.container}>
      {/* Component JSX */}
    </div>
  );
};

ComponentName.propTypes = {
  requiredProp: PropTypes.string.isRequired,
  optionalProp: PropTypes.string,
  onAction: PropTypes.func
};

ComponentName.defaultProps = {
  optionalProp: 'default value'
};

export default ComponentName;
```

## Core Components

### Task Component

**Location**: `src/components/Task/Task.jsx`

#### Purpose
Displays an individual task with actions for completion toggle and deletion.

#### Props
```typescript
interface TaskProps {
  task: {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    project_id?: string;
    created_at: string;
    updated_at: string;
  };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string, updates: object) => void;
}
```

#### Usage
```jsx
import Task from './components/Task/Task';

const MyComponent = () => {
  const handleToggle = (id) => {
    // Toggle task completion
  };

  const handleDelete = (id) => {
    // Delete task
  };

  return (
    <Task
      task={taskData}
      onToggle={handleToggle}
      onDelete={handleDelete}
    />
  );
};
```

#### State Management
- Internal state for edit mode
- Optimistic UI updates
- Loading states during API calls

#### Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- Focus management

#### Testing
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Task from './Task';

describe('Task Component', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false
  };

  test('renders task title and description', () => {
    render(<Task task={mockTask} onToggle={() => {}} onDelete={() => {}} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('calls onToggle when checkbox is clicked', () => {
    const onToggle = jest.fn();
    render(<Task task={mockTask} onToggle={onToggle} onDelete={() => {}} />);
    
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith('1');
  });
});
```

### TaskList Component

**Location**: `src/components/TaskList/TaskList.jsx`

#### Purpose
Renders a list of Task components with filtering and sorting capabilities.

#### Props
```typescript
interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string, updates: object) => void;
  filter?: 'all' | 'active' | 'completed';
  sortBy?: 'date' | 'title' | 'status';
  isLoading?: boolean;
}
```

#### Usage
```jsx
import TaskList from './components/TaskList/TaskList';

const MyComponent = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');

  return (
    <TaskList
      tasks={tasks}
      onToggle={handleToggle}
      onDelete={handleDelete}
      filter={filter}
      sortBy="date"
      isLoading={false}
    />
  );
};
```

#### Features
- Empty state display
- Loading skeleton
- Infinite scroll (future enhancement)
- Drag-and-drop reordering (future enhancement)

#### State Management
- Memoized filtered and sorted tasks
- Virtualization for large lists (future enhancement)

### AddTask Component

**Location**: `src/components/AddTask/AddTask.jsx`

#### Purpose
Form component for creating new tasks with validation.

#### Props
```typescript
interface AddTaskProps {
  onSubmit: (taskData: CreateTaskInput) => void;
  projects?: Project[];
  defaultProject?: string;
  isLoading?: boolean;
}
```

#### Usage
```jsx
import AddTask from './components/AddTask/AddTask';

const MyComponent = () => {
  const handleSubmit = (taskData) => {
    // Create new task
  };

  return (
    <AddTask
      onSubmit={handleSubmit}
      projects={availableProjects}
      isLoading={false}
    />
  );
};
```

#### Form Validation
- Required field validation
- Title length limits
- Description length limits
- Form submission handling

#### State Management
- Form state with controlled inputs
- Validation error states
- Submission loading state

### Project Component

**Location**: `src/components/Project/Project.jsx`

#### Purpose
Displays project information with task count and management actions.

#### Props
```typescript
interface ProjectProps {
  project: {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
  };
  taskCount?: number;
  onEdit?: (id: string, updates: object) => void;
  onDelete?: (id: string) => void;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}
```

#### Usage
```jsx
import Project from './components/Project/Project';

const MyComponent = () => {
  const handleEdit = (id, updates) => {
    // Update project
  };

  const handleDelete = (id) => {
    // Delete project
  };

  return (
    <Project
      project={projectData}
      taskCount={5}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isSelected={false}
    />
  );
};
```

## Common Components

### Button Component

**Location**: `src/components/common/Button/Button.jsx`

#### Purpose
Reusable button component with consistent styling and behavior.

#### Props
```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
```

#### Usage
```jsx
import Button from './components/common/Button/Button';

const MyComponent = () => {
  return (
    <Button
      variant="primary"
      size="medium"
      onClick={handleClick}
      loading={isLoading}
    >
      Save Task
    </Button>
  );
};
```

### Input Component

**Location**: `src/components/common/Input/Input.jsx`

#### Purpose
Reusable input component with validation and error handling.

#### Props
```typescript
interface InputProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}
```

#### Usage
```jsx
import Input from './components/common/Input/Input';

const MyComponent = () => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  return (
    <Input
      id="task-title"
      label="Task Title"
      value={title}
      onChange={setTitle}
      required
      error={error}
      placeholder="Enter task title..."
    />
  );
};
```

### Modal Component

**Location**: `src/components/common/Modal/Modal.jsx`

#### Purpose
Reusable modal component for dialogs and overlays.

#### Props
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  showCloseButton?: boolean;
}
```

#### Usage
```jsx
import Modal from './components/common/Modal/Modal';

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Delete Task"
      size="small"
    >
      <p>Are you sure you want to delete this task?</p>
      <div className="modal-actions">
        <Button onClick={() => setIsOpen(false)}>Cancel</Button>
        <Button variant="danger" onClick={handleDelete}>Delete</Button>
      </div>
    </Modal>
  );
};
```

## State Management Integration

### Context API Usage

```jsx
import { useContext } from 'react';
import { TaskContext } from '../contexts/TaskContext';

const MyComponent = () => {
  const {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask
  } = useContext(TaskContext);

  // Component logic
};
```

### Custom Hooks

```jsx
import { useTasks } from '../hooks/useTasks';

const MyComponent = () => {
  const {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask
  } = useTasks();

  // Component logic
};
```

## Styling Guidelines

### CSS Modules
Each component uses CSS Modules for scoped styling:

```css
/* Task.module.css */
.container {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 8px;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.completed {
  text-decoration: line-through;
  color: #888;
}

.actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}
```

### Theme System
```jsx
// Theme context
const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '992px',
    large: '1200px'
  }
};
```

## Performance Optimization

### React.memo Usage
```jsx
import React, { memo } from 'react';

const Task = memo(({ task, onToggle, onDelete }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison function
  return prevProps.task.id === nextProps.task.id &&
         prevProps.task.completed === nextProps.task.completed &&
         prevProps.task.title === nextProps.task.title;
});
```

### Callback Optimization
```jsx
import { useCallback } from 'react';

const TaskList = ({ tasks, onToggle, onDelete }) => {
  const handleToggle = useCallback((id) => {
    onToggle(id);
  }, [onToggle]);

  const handleDelete = useCallback((id) => {
    onDelete(id);
  }, [onDelete]);

  return (
    <div>
      {tasks.map(task => (
        <Task
          key={task.id}
          task={task}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};
```

## Testing Strategy

### Unit Testing
- Component rendering
- Props validation
- Event handling
- State management

### Integration Testing
- Component interaction
- API integration
- Context providers

### Testing Utilities
```jsx
// test-utils.js
import { render } from '@testing-library/react';
import { TaskProvider } from '../contexts/TaskContext';

const customRender = (ui, options) => {
  const Wrapper = ({ children }) => (
    <TaskProvider>
      {children}
    </TaskProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

export * from '@testing-library/react';
export { customRender as render };
```

## Accessibility Guidelines

### ARIA Labels
```jsx
<button
  aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
  onClick={() => onToggle(task.id)}
>
  {task.completed ? '✓' : '○'}
</button>
```

### Keyboard Navigation
```jsx
const handleKeyDown = (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onToggle(task.id);
  }
};
```

### Focus Management
```jsx
const inputRef = useRef(null);

useEffect(() => {
  if (isVisible) {
    inputRef.current?.focus();
  }
}, [isVisible]);
```

## Best Practices

1. **Component Composition**: Break down complex components into smaller, reusable pieces
2. **Props Validation**: Always use PropTypes or TypeScript for prop validation
3. **Error Boundaries**: Implement error boundaries for graceful error handling
4. **Loading States**: Show loading indicators during async operations
5. **Accessibility**: Ensure all components are accessible to screen readers
6. **Performance**: Use React.memo and useCallback for optimization
7. **Testing**: Write comprehensive tests for all components
8. **Documentation**: Keep this documentation updated with any changes