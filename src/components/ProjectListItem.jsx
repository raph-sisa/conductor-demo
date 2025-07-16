import React from 'react';

const ProjectListItem = ({ project, onClick }) => {
  const { id, name, description, taskCount, completedCount, created_at } = project;
  const completionPercentage = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

  return (
    <div 
      className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(id)}
    >
      <div className="flex-1">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{name}</h3>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="text-center">
              <div className="font-medium text-gray-900">{taskCount}</div>
              <div>Tasks</div>
            </div>
            
            <div className="text-center">
              <div className="font-medium text-gray-900">{completedCount}</div>
              <div>Completed</div>
            </div>
            
            <div className="text-center">
              <div className="font-medium text-primary-600">{completionPercentage}%</div>
              <div>Complete</div>
            </div>
            
            <div className="text-center">
              <div className="font-medium text-gray-900">
                {new Date(created_at).toLocaleDateString()}
              </div>
              <div>Created</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="ml-4 w-24">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectListItem;