# To-Do App Demo

## Overview
This project is a demo to-do application that allows users to capture and organize tasks efficiently. The application provides a simple interface for task management with project association capabilities.

## Technologies
- **Frontend**: React
- **Database**: Supabase
- **Authentication**: Supabase Auth (future consideration)
- **Styling**: TBD

## Core Features

### MVP Features
1. **Task Management**
   - Create new tasks with title and description
   - Mark tasks as complete/incomplete
   - Delete tasks
   - View all tasks in a list

2. **Project Association**
   - Associate tasks with projects
   - Create and manage projects
   - Filter tasks by project

### Data Models

#### Task
- `id` (UUID, primary key)
- `title` (string, required)
- `description` (text, optional)
- `completed` (boolean, default: false)
- `project_id` (UUID, foreign key)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### Project
- `id` (UUID, primary key)
- `name` (string, required)
- `description` (text, optional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## User Stories

### As a user, I want to:
1. Add new tasks so I can track what needs to be done
2. Mark tasks as complete so I can track my progress
3. Organize tasks by project so I can focus on specific areas
4. View all my tasks in one place
5. Delete tasks that are no longer relevant

## Technical Architecture

### Frontend (React)
- Component-based architecture
- State management for tasks and projects
- API integration with Supabase
- Responsive design

### Backend (Supabase)
- PostgreSQL database
- Real-time subscriptions
- Row Level Security (RLS)
- API endpoints for CRUD operations

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Supabase account
- Git

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase URL and anon key

# Start the development server
npm start
```

### Environment Variables
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development Roadmap

### Phase 1: Core Functionality
- [ ] Set up React application
- [ ] Configure Supabase connection
- [ ] Create database schema
- [ ] Implement task CRUD operations
- [ ] Basic UI for task management

### Phase 2: Project Management
- [ ] Create project management system
- [ ] Associate tasks with projects
- [ ] Project filtering and organization

### Phase 3: Enhanced Features
- [ ] Task due dates
- [ ] Priority levels
- [ ] Task categories/tags
- [ ] Search functionality

### Phase 4: Polish & Optimization
- [ ] Improved UI/UX
- [ ] Performance optimization
- [ ] Error handling
- [ ] Loading states

## Contributing
This is a demo project for learning and experimentation. Feel free to fork and modify as needed.

## License
MIT License - feel free to use this code for your own projects.