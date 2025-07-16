import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../utils/testUtils';
import AddTask from '../AddTask';

/**
 * AddTask Component Tests
 * 
 * Tests for the form for adding new tasks as specified in Task 2.3
 * Features: form with title and description fields, form validation, submit handler, reset form after submission
 */

describe('AddTask Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders form with title and description fields', () => {
      render(<AddTask {...defaultProps} />);
      
      expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/task description/i)).toBeInTheDocument();
    });

    it('renders submit and cancel buttons', () => {
      render(<AddTask {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('has proper form attributes', () => {
      render(<AddTask {...defaultProps} />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('noValidate');
    });

    it('shows required field indicators', () => {
      render(<AddTask {...defaultProps} />);
      
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('shows error when title is empty', async () => {
      render(<AddTask {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument();
      });
    });

    it('shows error when title is too short', async () => {
      render(<AddTask {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/task title/i);
      fireEvent.change(titleInput, { target: { value: 'a' } });
      
      const submitButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Title must be at least 3 characters')).toBeInTheDocument();
      });
    });

    it('shows error when title is too long', async () => {
      render(<AddTask {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/task title/i);
      fireEvent.change(titleInput, { target: { value: 'a'.repeat(101) } });
      
      const submitButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Title must be less than 100 characters')).toBeInTheDocument();
      });
    });

    it('shows error when description is too long', async () => {
      render(<AddTask {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/task title/i);
      const descriptionInput = screen.getByLabelText(/task description/i);
      
      fireEvent.change(titleInput, { target: { value: 'Valid Title' } });
      fireEvent.change(descriptionInput, { target: { value: 'a'.repeat(501) } });
      
      const submitButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Description must be less than 500 characters')).toBeInTheDocument();
      });
    });

    it('does not submit form when validation fails', async () => {
      render(<AddTask {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument();
      });
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('clears validation errors when input changes', async () => {
      render(<AddTask {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument();
      });
      
      const titleInput = screen.getByLabelText(/task title/i);
      fireEvent.change(titleInput, { target: { value: 'Valid Title' } });
      
      expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('submits form with valid data', async () => {
      render(<AddTask {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/task title/i);
      const descriptionInput = screen.getByLabelText(/task description/i);
      
      fireEvent.change(titleInput, { target: { value: 'New Task' } });
      fireEvent.change(descriptionInput, { target: { value: 'Task description' } });
      
      const submitButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'New Task',
          description: 'Task description',
        });
      });
    });

    it('submits form with only title when description is empty', async () => {
      render(<AddTask {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/task title/i);
      fireEvent.change(titleInput, { target: { value: 'New Task' } });
      
      const submitButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'New Task',
          description: '',
        });
      });
    });

    it('resets form after successful submission', async () => {
      render(<AddTask {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/task title/i);
      const descriptionInput = screen.getByLabelText(/task description/i);
      
      fireEvent.change(titleInput, { target: { value: 'New Task' } });
      fireEvent.change(descriptionInput, { target: { value: 'Task description' } });
      
      const submitButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(titleInput.value).toBe('');
        expect(descriptionInput.value).toBe('');
      });
    });

    it('handles form submission with Enter key', async () => {
      render(<AddTask {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/task title/i);
      fireEvent.change(titleInput, { target: { value: 'New Task' } });
      
      fireEvent.keyDown(titleInput, { key: 'Enter', code: 'Enter' });
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'New Task',
          description: '',
        });
      });
    });

    it('prevents default form submission', () => {
      render(<AddTask {...defaultProps} />);
      
      const form = screen.getByRole('form');
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      const spy = jest.spyOn(submitEvent, 'preventDefault');
      
      fireEvent(form, submitEvent);
      
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Form Cancellation', () => {
    it('calls onCancel when cancel button is clicked', () => {
      render(<AddTask {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);
      
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('resets form when cancelled', () => {
      render(<AddTask {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/task title/i);
      const descriptionInput = screen.getByLabelText(/task description/i);
      
      fireEvent.change(titleInput, { target: { value: 'New Task' } });
      fireEvent.change(descriptionInput, { target: { value: 'Task description' } });
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);
      
      expect(titleInput.value).toBe('');
      expect(descriptionInput.value).toBe('');
    });

    it('clears validation errors when cancelled', async () => {
      render(<AddTask {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument();
      });
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);
      
      expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading state during submission', async () => {
      render(<AddTask {...defaultProps} loading={true} />);
      
      const submitButton = screen.getByRole('button', { name: /adding/i });
      expect(submitButton).toBeDisabled();
      expect(screen.getByText('Adding...')).toBeInTheDocument();
    });

    it('disables form fields during loading', () => {
      render(<AddTask {...defaultProps} loading={true} />);
      
      const titleInput = screen.getByLabelText(/task title/i);
      const descriptionInput = screen.getByLabelText(/task description/i);
      
      expect(titleInput).toBeDisabled();
      expect(descriptionInput).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      render(<AddTask {...defaultProps} />);
      
      expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/task description/i)).toBeInTheDocument();
    });

    it('associates error messages with form fields', async () => {
      render(<AddTask {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const titleInput = screen.getByLabelText(/task title/i);
        const errorMessage = screen.getByText('Title is required');
        expect(titleInput).toHaveAttribute('aria-describedby', errorMessage.id);
      });
    });

    it('has proper ARIA attributes', () => {
      render(<AddTask {...defaultProps} />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label', 'Add new task');
    });

    it('supports keyboard navigation', () => {
      render(<AddTask {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/task title/i);
      const descriptionInput = screen.getByLabelText(/task description/i);
      const submitButton = screen.getByRole('button', { name: /add task/i });
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      
      expect(titleInput).toHaveAttribute('tabIndex', '0');
      expect(descriptionInput).toHaveAttribute('tabIndex', '0');
      expect(submitButton).toHaveAttribute('tabIndex', '0');
      expect(cancelButton).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Character Counting', () => {
    it('shows character count for title field', () => {
      render(<AddTask {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/task title/i);
      fireEvent.change(titleInput, { target: { value: 'Hello' } });
      
      expect(screen.getByText('5/100 characters')).toBeInTheDocument();
    });

    it('shows character count for description field', () => {
      render(<AddTask {...defaultProps} />);
      
      const descriptionInput = screen.getByLabelText(/task description/i);
      fireEvent.change(descriptionInput, { target: { value: 'Hello world' } });
      
      expect(screen.getByText('11/500 characters')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles special characters in input', async () => {
      render(<AddTask {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/task title/i);
      const specialTitle = 'Task with special chars: @#$%^&*()';
      fireEvent.change(titleInput, { target: { value: specialTitle } });
      
      const submitButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: specialTitle,
          description: '',
        });
      });
    });

    it('trims whitespace from inputs', async () => {
      render(<AddTask {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/task title/i);
      fireEvent.change(titleInput, { target: { value: '  Trimmed Task  ' } });
      
      const submitButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'Trimmed Task',
          description: '',
        });
      });
    });
  });
});