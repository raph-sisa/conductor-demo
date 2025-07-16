import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Project from './Project';

describe('Project Component', () => {
  const mockProject = {
    id: '1',
    name: 'Test Project',
    description: 'This is a test project description',
    taskCount: 5
  };

  const mockProps = {
    project: mockProject,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onClick: jest.fn(),
    isDeleting: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders project name and description', () => {
      render(<Project {...mockProps} />);
      
      expect(screen.getByText('Test Project')).toBeInTheDocument();
      expect(screen.getByText('This is a test project description')).toBeInTheDocument();
    });

    test('renders task count correctly', () => {
      render(<Project {...mockProps} />);
      
      expect(screen.getByText('5 tasks')).toBeInTheDocument();
    });

    test('renders singular task count', () => {
      const projectWithOneTask = { ...mockProject, taskCount: 1 };
      render(<Project {...mockProps} project={projectWithOneTask} />);
      
      expect(screen.getByText('1 task')).toBeInTheDocument();
    });

    test('renders zero task count', () => {
      const projectWithNoTasks = { ...mockProject, taskCount: 0 };
      render(<Project {...mockProps} project={projectWithNoTasks} />);
      
      expect(screen.getByText('0 tasks')).toBeInTheDocument();
    });

    test('renders without description', () => {
      const projectWithoutDescription = { ...mockProject, description: '' };
      render(<Project {...mockProps} project={projectWithoutDescription} />);
      
      expect(screen.getByText('Test Project')).toBeInTheDocument();
      expect(screen.queryByText('This is a test project description')).not.toBeInTheDocument();
    });

    test('renders edit and delete buttons', () => {
      render(<Project {...mockProps} />);
      
      expect(screen.getByTitle('Edit project')).toBeInTheDocument();
      expect(screen.getByTitle('Delete project')).toBeInTheDocument();
    });

    test('applies cursor-pointer class when onClick is provided', () => {
      const { container } = render(<Project {...mockProps} />);
      const projectCard = container.querySelector('.project-card');
      
      expect(projectCard).toHaveClass('cursor-pointer');
    });

    test('does not apply cursor-pointer class when onClick is not provided', () => {
      const { container } = render(<Project {...mockProps} onClick={undefined} />);
      const projectCard = container.querySelector('.project-card');
      
      expect(projectCard).not.toHaveClass('cursor-pointer');
    });
  });

  describe('Interactions', () => {
    test('calls onClick when project card is clicked', () => {
      render(<Project {...mockProps} />);
      
      const projectCard = screen.getByText('Test Project').closest('.project-card');
      fireEvent.click(projectCard);
      
      expect(mockProps.onClick).toHaveBeenCalledWith(mockProject);
    });

    test('calls onEdit when edit button is clicked', () => {
      render(<Project {...mockProps} />);
      
      const editButton = screen.getByTitle('Edit project');
      fireEvent.click(editButton);
      
      expect(mockProps.onEdit).toHaveBeenCalledWith(mockProject);
    });

    test('edit button click does not trigger card click', () => {
      render(<Project {...mockProps} />);
      
      const editButton = screen.getByTitle('Edit project');
      fireEvent.click(editButton);
      
      expect(mockProps.onClick).not.toHaveBeenCalled();
    });

    test('shows delete confirmation modal when delete button is clicked', () => {
      render(<Project {...mockProps} />);
      
      const deleteButton = screen.getByTitle('Delete project');
      fireEvent.click(deleteButton);
      
      expect(screen.getByText('Delete Project')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete "Test Project"? This action cannot be undone.')).toBeInTheDocument();
    });

    test('delete button click does not trigger card click', () => {
      render(<Project {...mockProps} />);
      
      const deleteButton = screen.getByTitle('Delete project');
      fireEvent.click(deleteButton);
      
      expect(mockProps.onClick).not.toHaveBeenCalled();
    });

    test('confirms delete when confirm button is clicked', () => {
      render(<Project {...mockProps} />);
      
      // Open delete confirmation
      const deleteButton = screen.getByTitle('Delete project');
      fireEvent.click(deleteButton);
      
      // Confirm delete
      const confirmButton = screen.getByText('Delete');
      fireEvent.click(confirmButton);
      
      expect(mockProps.onDelete).toHaveBeenCalledWith('1');
    });

    test('cancels delete when cancel button is clicked', () => {
      render(<Project {...mockProps} />);
      
      // Open delete confirmation
      const deleteButton = screen.getByTitle('Delete project');
      fireEvent.click(deleteButton);
      
      // Cancel delete
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      
      expect(mockProps.onDelete).not.toHaveBeenCalled();
      expect(screen.queryByText('Delete Project')).not.toBeInTheDocument();
    });

    test('modal clicks do not trigger card click', () => {
      render(<Project {...mockProps} />);
      
      // Open delete confirmation
      const deleteButton = screen.getByTitle('Delete project');
      fireEvent.click(deleteButton);
      
      // Click cancel button
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      
      expect(mockProps.onClick).not.toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    test('shows spinner when isDeleting is true', () => {
      render(<Project {...mockProps} isDeleting={true} />);
      
      const deleteButton = screen.getByTitle('Delete project');
      expect(deleteButton.querySelector('.spinner')).toBeInTheDocument();
    });

    test('disables buttons when isDeleting is true', () => {
      render(<Project {...mockProps} isDeleting={true} />);
      
      const editButton = screen.getByTitle('Edit project');
      const deleteButton = screen.getByTitle('Delete project');
      
      expect(editButton).toBeDisabled();
      expect(deleteButton).toBeDisabled();
    });

    test('does not show spinner when isDeleting is false', () => {
      render(<Project {...mockProps} isDeleting={false} />);
      
      const deleteButton = screen.getByTitle('Delete project');
      expect(deleteButton.querySelector('.spinner')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('buttons have proper titles for screen readers', () => {
      render(<Project {...mockProps} />);
      
      expect(screen.getByTitle('Edit project')).toBeInTheDocument();
      expect(screen.getByTitle('Delete project')).toBeInTheDocument();
    });

    test('delete confirmation modal has proper heading', () => {
      render(<Project {...mockProps} />);
      
      const deleteButton = screen.getByTitle('Delete project');
      fireEvent.click(deleteButton);
      
      const heading = screen.getByRole('heading', { level: 4 });
      expect(heading).toHaveTextContent('Delete Project');
    });

    test('buttons are keyboard accessible', () => {
      render(<Project {...mockProps} />);
      
      const editButton = screen.getByTitle('Edit project');
      const deleteButton = screen.getByTitle('Delete project');
      
      // HTML button elements are keyboard accessible by default
      expect(editButton.tagName).toBe('BUTTON');
      expect(deleteButton.tagName).toBe('BUTTON');
      
      // Test that they can be focused
      editButton.focus();
      expect(editButton).toHaveFocus();
      
      deleteButton.focus();
      expect(deleteButton).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    test('handles undefined taskCount', () => {
      const projectWithUndefinedTaskCount = { ...mockProject, taskCount: undefined };
      render(<Project {...mockProps} project={projectWithUndefinedTaskCount} />);
      
      expect(screen.getByText('0 tasks')).toBeInTheDocument();
    });

    test('handles null description', () => {
      const projectWithNullDescription = { ...mockProject, description: null };
      render(<Project {...mockProps} project={projectWithNullDescription} />);
      
      expect(screen.getByText('Test Project')).toBeInTheDocument();
      expect(screen.queryByText('This is a test project description')).not.toBeInTheDocument();
    });

    test('handles missing onEdit callback', () => {
      const propsWithoutOnEdit = { ...mockProps, onEdit: undefined };
      render(<Project {...propsWithoutOnEdit} />);
      
      const editButton = screen.getByTitle('Edit project');
      expect(() => fireEvent.click(editButton)).not.toThrow();
    });

    test('handles missing onDelete callback', () => {
      const propsWithoutOnDelete = { ...mockProps, onDelete: undefined };
      render(<Project {...propsWithoutOnDelete} />);
      
      const deleteButton = screen.getByTitle('Delete project');
      fireEvent.click(deleteButton);
      
      const confirmButton = screen.getByText('Delete');
      expect(() => fireEvent.click(confirmButton)).not.toThrow();
    });

    test('handles missing onClick callback', () => {
      const propsWithoutOnClick = { ...mockProps, onClick: undefined };
      render(<Project {...propsWithoutOnClick} />);
      
      const projectCard = screen.getByText('Test Project').closest('.project-card');
      expect(() => fireEvent.click(projectCard)).not.toThrow();
    });
  });
});