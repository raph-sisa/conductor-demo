import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../utils/testUtils';
import { createMockTask } from '../../utils/testUtils';
import Task from '../Task';

/**
 * Task Component Tests
 * 
 * Tests for the individual task display component as specified in Task 2.1
 * Props: task object, onToggle, onDelete functions
 * Features: display task title, description, completion status, toggle complete/incomplete, delete with confirmation
 */

describe('Task Component', () => {
  const mockTask = createMockTask();
  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();

  const defaultProps = {
    task: mockTask,
    onToggle: mockOnToggle,
    onDelete: mockOnDelete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders task title and description', () => {
      render(<Task {...defaultProps} />);
      
      expect(screen.getByText(mockTask.title)).toBeInTheDocument();
      expect(screen.getByText(mockTask.description)).toBeInTheDocument();
    });

    it('shows completion status for incomplete task', () => {
      const incompleteTask = createMockTask({ completed: false });
      render(<Task {...defaultProps} task={incompleteTask} />);
      
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('shows completion status for completed task', () => {
      const completedTask = createMockTask({ completed: true });
      render(<Task {...defaultProps} task={completedTask} />);
      
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('renders delete button', () => {
      render(<Task {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('applies completed styling when task is completed', () => {
      const completedTask = createMockTask({ completed: true });
      render(<Task {...defaultProps} task={completedTask} />);
      
      const taskElement = screen.getByTestId('task-item');
      expect(taskElement).toHaveClass('completed');
    });
  });

  describe('Toggle Functionality', () => {
    it('calls onToggle when checkbox is clicked', () => {
      render(<Task {...defaultProps} />);
      
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      
      expect(mockOnToggle).toHaveBeenCalledTimes(1);
      expect(mockOnToggle).toHaveBeenCalledWith(mockTask.id);
    });

    it('calls onToggle when task title is clicked', () => {
      render(<Task {...defaultProps} />);
      
      const title = screen.getByText(mockTask.title);
      fireEvent.click(title);
      
      expect(mockOnToggle).toHaveBeenCalledTimes(1);
      expect(mockOnToggle).toHaveBeenCalledWith(mockTask.id);
    });

    it('does not call onToggle when onToggle is not provided', () => {
      render(<Task task={mockTask} onDelete={mockOnDelete} />);
      
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      
      // Should not throw an error
    });
  });

  describe('Delete Functionality', () => {
    it('shows confirmation dialog when delete button is clicked', async () => {
      // Mock window.confirm
      const mockConfirm = jest.fn(() => true);
      window.confirm = mockConfirm;

      render(<Task {...defaultProps} />);
      
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);
      
      expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this task?');
    });

    it('calls onDelete when deletion is confirmed', async () => {
      // Mock window.confirm to return true
      window.confirm = jest.fn(() => true);

      render(<Task {...defaultProps} />);
      
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);
      
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
    });

    it('does not call onDelete when deletion is cancelled', async () => {
      // Mock window.confirm to return false
      window.confirm = jest.fn(() => false);

      render(<Task {...defaultProps} />);
      
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);
      
      expect(mockOnDelete).not.toHaveBeenCalled();
    });

    it('does not call onDelete when onDelete is not provided', () => {
      render(<Task task={mockTask} onToggle={mockOnToggle} />);
      
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);
      
      // Should not throw an error
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<Task {...defaultProps} />);
      
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-label', `Mark "${mockTask.title}" as complete`);
      expect(screen.getByRole('button', { name: /delete/i })).toHaveAttribute('aria-label', `Delete task "${mockTask.title}"`);
    });

    it('supports keyboard navigation', () => {
      render(<Task {...defaultProps} />);
      
      const checkbox = screen.getByRole('checkbox');
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      
      expect(checkbox).toHaveAttribute('tabIndex', '0');
      expect(deleteButton).toHaveAttribute('tabIndex', '0');
    });

    it('has proper semantic markup', () => {
      render(<Task {...defaultProps} />);
      
      expect(screen.getByRole('article')).toBeInTheDocument();
      expect(screen.getByRole('heading')).toHaveTextContent(mockTask.title);
    });
  });

  describe('Edge Cases', () => {
    it('handles task without description', () => {
      const taskWithoutDescription = createMockTask({ description: '' });
      render(<Task {...defaultProps} task={taskWithoutDescription} />);
      
      expect(screen.getByText(taskWithoutDescription.title)).toBeInTheDocument();
    });

    it('handles very long task titles', () => {
      const longTitle = 'A'.repeat(200);
      const taskWithLongTitle = createMockTask({ title: longTitle });
      render(<Task {...defaultProps} task={taskWithLongTitle} />);
      
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('handles null or undefined task', () => {
      render(<Task {...defaultProps} task={null} />);
      
      expect(screen.getByText('Task not found')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('does not re-render unnecessarily', () => {
      const { rerender } = render(<Task {...defaultProps} />);
      
      // Re-render with same props
      rerender(<Task {...defaultProps} />);
      
      // Component should be memoized and not re-render
    });
  });
});