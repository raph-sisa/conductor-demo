import React from 'react';
import Task from './Task';

const TaskList = ({ 
  tasks = [], 
  onToggle, 
  onDelete, 
  loading = false, 
  error = null, 
  onRetry = null,
  emptyMessage = 'No tasks found'
}) => {
  // Handle loading state
  if (loading) {
    return (
      <div className="task-list-container" role="status" aria-live="polite">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="spinner w-8 h-8 mb-4" role="progressbar" aria-label="Loading tasks"></div>
          <p className="text-gray-500">Loading tasks...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="task-list-container">
        <div className="alert alert-error mb-4" role="alert">
          <div className="flex items-center justify-between">
            <p className="text-error-800">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="btn btn-sm btn-outline-primary ml-4"
                aria-label="Retry loading tasks"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Handle empty state
  if (!tasks || tasks.length === 0) {
    return (
      <div className="task-list-container">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg 
              className="w-16 h-16 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{emptyMessage}</h3>
          <p className="text-gray-500">Add your first task to get started!</p>
        </div>
      </div>
    );
  }

  // Render task list
  return (
    <div className="task-list-container">
      <ul 
        className="task-list space-y-4" 
        role="list"
        aria-label="Task list"
        aria-live="polite"
      >
        {tasks.map((task) => (
          <li key={task.id} className="task-list-item">
            <Task
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;