import React from 'react';

const Task = ({ task, onToggle, onDelete }) => {
  // Handle null or undefined task
  if (!task) {
    return (
      <div className="task-card">
        <div className="card-body">
          <p className="text-gray-500">Task not found</p>
        </div>
      </div>
    );
  }

  const { id, title, description, completed, priority, due_date } = task;

  const handleToggle = () => {
    if (onToggle) {
      onToggle(id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      const confirmed = window.confirm('Are you sure you want to delete this task?');
      if (confirmed) {
        onDelete(id);
      }
    }
  };

  const handleTitleClick = () => {
    handleToggle();
  };

  return (
    <article 
      className={`task-card ${completed ? 'completed' : ''}`}
      data-testid="task-item"
    >
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <input
              type="checkbox"
              checked={completed}
              onChange={handleToggle}
              className="form-checkbox mt-1"
              aria-label={`Mark "${title}" as complete`}
              tabIndex="0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 
                  className="task-title cursor-pointer" 
                  onClick={handleTitleClick}
                  role="heading"
                  aria-level="3"
                >
                  {title}
                </h3>
                {priority && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    priority === 'high' ? 'bg-error-100 text-error-800' :
                    priority === 'medium' ? 'bg-warning-100 text-warning-800' :
                    'bg-success-100 text-success-800'
                  }`}>
                    {priority}
                  </span>
                )}
              </div>
              {description && (
                <p className="task-description">{description}</p>
              )}
              {due_date && (
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-secondary-500">Due:</span>
                  <span className={`text-xs font-medium ${
                    new Date(due_date) < new Date() ? 'text-error-600' : 'text-secondary-600'
                  }`}>
                    {new Date(due_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDelete}
              className="text-error-600 hover:text-error-700 text-sm"
              aria-label={`Delete task "${title}"`}
              tabIndex="0"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Task;