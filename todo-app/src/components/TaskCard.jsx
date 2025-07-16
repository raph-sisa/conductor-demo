import React from 'react';

const TaskCard = ({ task, onToggle, onDelete }) => {
  const { id, title, description, completed, project, createdAt } = task;

  return (
    <div className={`task-card ${completed ? 'completed' : ''}`}>
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <input
              type="checkbox"
              checked={completed}
              onChange={() => onToggle(id)}
              className="form-checkbox mt-1"
            />
            <div className="flex-1">
              <h3 className="task-title">{title}</h3>
              {description && (
                <p className="task-description">{description}</p>
              )}
              <div className="task-meta">
                <span>
                  {project && (
                    <span className="badge badge-primary mr-2">
                      {project}
                    </span>
                  )}
                  {createdAt && (
                    <span className="text-gray-500">
                      Created {new Date(createdAt).toLocaleDateString()}
                    </span>
                  )}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onDelete(id)}
                    className="text-error-600 hover:text-error-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;