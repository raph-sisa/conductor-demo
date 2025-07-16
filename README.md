# To-Do App Demo

## Overview
This project is a demo to-do application that allows users to capture and organize tasks efficiently. The application provides a simple interface for task management with project association capabilities.

## Technologies
- **Frontend**: React 18
- **Database**: Supabase
- **Authentication**: Supabase Auth (future consideration)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## Core Features

### ✅ Project Management
- **Project List Display**: Grid layout showing project cards with progress tracking
- **Search Functionality**: Filter projects by name and description
- **Sorting Options**: Sort by name, date created, date updated, or task count
- **Grid/List Toggle**: Switch between card grid and compact list view
- **Create New Project**: Modal form for adding new projects
- **Real-time Updates**: Live updates using Supabase subscriptions

### MVP Features
1. **Task Management**
   - Create new tasks with title and description
   - Mark tasks as complete/incomplete
   - Delete tasks
   - View all tasks in a list
   - Task due dates and priority levels

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
- `priority` (string, enum: low/medium/high)
- `due_date` (date, optional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### Project
- `id` (UUID, primary key)
- `name` (string, required)
- `description` (text, optional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Technical Architecture

### Frontend (React)
- Component-based architecture
- State management for tasks and projects
- API integration with Supabase
- Responsive design with Tailwind CSS

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
npm run dev
```

### Environment Variables
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development Roadmap

### Phase 1: Core Functionality ✅
- [x] Set up React application
- [x] Configure Supabase connection
- [x] Create database schema
- [x] Implement task CRUD operations
- [x] Basic UI for task management

### Phase 2: Project Management ✅
- [x] Create project management system
- [x] Associate tasks with projects
- [x] Project filtering and organization
- [x] Project list view with search and sorting

### Phase 3: Enhanced Features ✅
- [x] Task due dates
- [x] Priority levels
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
