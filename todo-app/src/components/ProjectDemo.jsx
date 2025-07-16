import React, { useState } from 'react';
import Project from './Project';

/**
 * Demo component to showcase the Project component
 */
const ProjectDemo = () => {
  const [projects, setProjects] = useState([
    {
      id: '1',
      name: 'Personal Website',
      description: 'Build a new personal portfolio website using React and Tailwind CSS',
      taskCount: 12
    },
    {
      id: '2',
      name: 'Mobile App',
      description: 'Develop a cross-platform mobile app for task management',
      taskCount: 8
    },
    {
      id: '3',
      name: 'API Integration',
      description: 'Integrate third-party APIs for weather and news data',
      taskCount: 5
    },
    {
      id: '4',
      name: 'Documentation',
      description: '',
      taskCount: 1
    }
  ]);

  const [deletingId, setDeletingId] = useState(null);

  const handleEdit = (project) => {
    console.log('Edit project:', project);
    alert(`Edit project: ${project.name}`);
  };

  const handleDelete = async (projectId) => {
    setDeletingId(projectId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setProjects(projects.filter(p => p.id !== projectId));
    setDeletingId(null);
    console.log('Deleted project:', projectId);
  };

  const handleClick = (project) => {
    console.log('Clicked project:', project);
    alert(`Clicked project: ${project.name}`);
  };

  return (
    <div className="container-md py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Project Component Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Project
            key={project.id}
            project={project}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClick={handleClick}
            isDeleting={deletingId === project.id}
          />
        ))}
      </div>
      
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Component Features:</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Click on any project card to trigger the onClick handler</li>
          <li>• Use the edit button to modify project details</li>
          <li>• Use the delete button to remove projects (with confirmation)</li>
          <li>• Shows loading state with spinner during deletion</li>
          <li>• Handles projects with and without descriptions</li>
          <li>• Displays task count with proper pluralization</li>
          <li>• Responsive design that works on different screen sizes</li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectDemo;