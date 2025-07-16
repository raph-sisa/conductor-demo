import React from 'react';

const ProjectCard = ({ project, onClick }) => {
  const { id, name, description, taskCount, completedCount } = project;
  const completionPercentage = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

  return (
    <div className="project-card" onClick={() => onClick(id)}>
      <div className="card-body">
        <h3 className="project-title">{name}</h3>
        {description && (
          <p className="project-description">{description}</p>
        )}
        
        <div className="project-stats">
          <span>{taskCount} tasks</span>
          <span>{completedCount} completed</span>
          <span className="text-primary-600 font-medium">
            {completionPercentage}% complete
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-500">Progress</span>
            <span className="text-gray-700">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;