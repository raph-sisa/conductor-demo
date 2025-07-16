# Setup Instructions

## Overview

This document provides comprehensive setup instructions for the To-Do App development environment. Follow these steps to get the application running locally.

## Prerequisites

Before starting, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (v16 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

2. **Git**
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify installation: `git --version`

3. **Code Editor**
   - Recommended: [Visual Studio Code](https://code.visualstudio.com/)
   - Alternative: WebStorm, Sublime Text, or any preferred editor

### Recommended VS Code Extensions

If using VS Code, install these extensions for better development experience:

```json
{
  "recommendations": [
    "es7-react-js-snippets",
    "prettier",
    "eslint",
    "bracket-pair-colorizer-2",
    "auto-rename-tag",
    "gitlens",
    "thunder-client"
  ]
}
```

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd todo-app
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- React and React DOM
- Supabase JavaScript client
- Testing libraries
- Development tools

### 3. Environment Configuration

#### Create Environment File

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

#### Configure Environment Variables

Edit `.env.local` with your Supabase credentials:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Development Settings
REACT_APP_ENVIRONMENT=development
REACT_APP_API_BASE_URL=http://localhost:3000
```

**Getting Supabase Credentials:**

1. Go to [supabase.com](https://supabase.com/)
2. Create a new account or sign in
3. Create a new project
4. Go to Settings → API
5. Copy your Project URL and anon/public key

### 4. Supabase Database Setup

#### Create Database Tables

Execute the following SQL in your Supabase SQL editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### Set Up Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations)
-- Note: In production, you'd implement proper user authentication
CREATE POLICY "Allow all operations on projects" ON projects
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on tasks" ON tasks
  FOR ALL USING (true);
```

#### Insert Sample Data (Optional)

```sql
-- Insert sample projects
INSERT INTO projects (name, description) VALUES
  ('Personal', 'Personal tasks and reminders'),
  ('Work', 'Work-related tasks and projects'),
  ('Learning', 'Educational and learning goals');

-- Insert sample tasks
INSERT INTO tasks (title, description, project_id, completed) VALUES
  ('Complete React tutorial', 'Finish the official React tutorial', 
   (SELECT id FROM projects WHERE name = 'Learning'), false),
  ('Set up development environment', 'Configure VS Code and extensions',
   (SELECT id FROM projects WHERE name = 'Work'), true),
  ('Plan weekend activities', 'Research and plan weekend activities',
   (SELECT id FROM projects WHERE name = 'Personal'), false);
```

### 5. Start Development Server

```bash
npm start
```

The application will start on `http://localhost:3000` and automatically open in your browser.

## Development Environment Setup

### Package Scripts

Available npm scripts:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src/**/*.{js,jsx}",
    "lint:fix": "eslint src/**/*.{js,jsx} --fix",
    "format": "prettier --write src/**/*.{js,jsx,css,md}"
  }
}
```

### Code Quality Tools

#### ESLint Configuration

Create `.eslintrc.json`:

```json
{
  "extends": [
    "react-app",
    "react-app/jest"
  ],
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "warn",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

#### Prettier Configuration

Create `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

#### Pre-commit Hooks

Install Husky for pre-commit hooks:

```bash
npm install --save-dev husky lint-staged
npx husky install
```

Add to `package.json`:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "src/**/*.{js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## Testing Setup

### Jest Configuration

Create `jest.config.js`:

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Testing Libraries

Testing utilities are already configured with Create React App:

- Jest (test runner)
- React Testing Library (component testing)
- jsdom (DOM simulation)

### Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## Project Structure

```
todo-app/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Task/
│   │   ├── TaskList/
│   │   ├── AddTask/
│   │   ├── Project/
│   │   └── common/
│   ├── contexts/
│   ├── hooks/
│   ├── services/
│   ├── lib/
│   │   └── supabase.js
│   ├── utils/
│   ├── styles/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── docs/
│   ├── API.md
│   ├── COMPONENTS.md
│   ├── SETUP.md
│   └── DEPLOYMENT.md
├── .env.local
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── TASKS.md
```

## Debugging Setup

### Browser DevTools

1. Install React Developer Tools browser extension
2. Use Redux DevTools (if implementing Redux)
3. Enable source maps for debugging

### VS Code Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug React App",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/react-scripts",
      "args": ["start"],
      "env": {
        "BROWSER": "none"
      },
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## Common Issues and Solutions

### 1. Port Already in Use

```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or start on different port
PORT=3001 npm start
```

### 2. Node Modules Issues

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 3. Environment Variables Not Loading

- Ensure `.env.local` is in root directory
- Restart development server after adding variables
- Variables must start with `REACT_APP_`

### 4. Supabase Connection Issues

- Verify URL and API key are correct
- Check network connectivity
- Ensure Supabase project is active

### 5. CORS Issues

- Ensure Supabase CORS settings allow your domain
- Check if running on correct port

## Performance Optimization

### Development Build

```bash
# Run development build
npm start
```

### Production Build

```bash
# Create optimized production build
npm run build

# Serve production build locally
npx serve -s build
```

### Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Analyze bundle
npm run build && npx webpack-bundle-analyzer build/static/js/*.js
```

## Additional Tools

### Recommended Development Tools

1. **Postman/Thunder Client** - API testing
2. **React DevTools** - Component debugging
3. **Redux DevTools** - State debugging (if using Redux)
4. **Lighthouse** - Performance auditing

### Optional Enhancements

1. **TypeScript** - Type safety
2. **Storybook** - Component documentation
3. **Cypress** - End-to-end testing
4. **Docker** - Containerization

## Next Steps

After completing the setup:

1. Verify the application runs without errors
2. Test the database connection
3. Create your first task
4. Explore the codebase structure
5. Review the API documentation
6. Start implementing features according to TASKS.md

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review the console for error messages
3. Consult the official documentation:
   - [React Documentation](https://reactjs.org/docs/)
   - [Supabase Documentation](https://supabase.com/docs)
   - [Create React App Documentation](https://create-react-app.dev/docs/)

4. Check the project's GitHub issues
5. Ask for help in the project's discussion forum or chat

## Summary

You should now have:
- ✅ Node.js and development tools installed
- ✅ Repository cloned and dependencies installed
- ✅ Environment variables configured
- ✅ Supabase database set up
- ✅ Development server running
- ✅ Code quality tools configured
- ✅ Testing environment ready

Your development environment is now ready for building the To-Do App!