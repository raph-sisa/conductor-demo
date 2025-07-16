import React, { useState } from 'react';

/**
 * Project Component
 * 
 * Displays individual project information with edit/delete functionality
 * 
 * @param {Object} props - Component props
 * @param {Object} props.project - Project data object
 * @param {string} props.project.id - Project ID
 * @param {string} props.project.name - Project name
 * @param {string} props.project.description - Project description
 * @param {number} props.project.taskCount - Number of tasks in the project
 * @param {Function} props.onEdit - Function called when edit button is clicked
 * @param {Function} props.onDelete - Function called when delete button is clicked
 * @param {Function} props.onClick - Function called when project card is clicked
 * @param {boolean} props.isDeleting - Whether the project is being deleted
 */
const Project = ({ 
  project, 
  onEdit, 
  onDelete, 
  onClick, 
  isDeleting = false 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(project);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(project.id);
    }
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(project);
    }
  };

  return (
    <div 
      className={`project-card ${onClick ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
    >
      <div className="card-body">
        {/* Project Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="project-title">{project.name}</h3>
            {project.description && (
              <p className="project-description">{project.description}</p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2 ml-4">
            <button
              onClick={handleEditClick}
              className="btn btn-ghost btn-sm"
              title="Edit project"
              disabled={isDeleting}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <button
              onClick={handleDeleteClick}
              className="btn btn-ghost btn-sm text-error-600 hover:text-error-700 hover:bg-error-50"
              title="Delete project"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="spinner w-4 h-4"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Project Stats */}
        <div className="project-stats">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span>
              {project.taskCount || 0} task{project.taskCount !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1h4z" />
            </svg>
            <span>Project</span>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Delete Project
              </h4>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{project.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelDelete}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="btn btn-error"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Project;