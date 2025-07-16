import React, { useState } from 'react';

/**
 * AddTask Component
 * 
 * A form component for adding new tasks to the todo application.
 * Features:
 * - Form with title and description fields
 * - Form validation (title required, length limits)
 * - Submit handler that calls onSubmit prop
 * - Reset form after submission
 * - Loading state support
 * - Accessibility features
 * - Character counting
 * - Cancel functionality
 */
const AddTask = ({ onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation rules
  const validateForm = () => {
    const newErrors = {};
    
    // Title validation
    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      newErrors.title = 'Title is required';
    } else if (trimmedTitle.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (trimmedTitle.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    // Description validation
    const trimmedDescription = formData.description.trim();
    if (trimmedDescription.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    // Priority validation
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(formData.priority)) {
      newErrors.priority = 'Priority must be low, medium, or high';
    }
    
    // Due date validation
    if (formData.due_date) {
      const dueDate = new Date(formData.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (isNaN(dueDate.getTime())) {
        newErrors.due_date = 'Invalid date format';
      } else if (dueDate < today) {
        newErrors.due_date = 'Due date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Trim whitespace from inputs before submitting
      const trimmedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        due_date: formData.due_date || null
      };
      
      await onSubmit(trimmedData);
      
      // Reset form after successful submission
      setFormData({ title: '', description: '', priority: 'medium', due_date: '' });
      setErrors({});
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({ title: '', description: '', priority: 'medium', due_date: '' });
    setErrors({});
    onCancel();
  };

  // Handle Enter key submission
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isFormDisabled = loading || isSubmitting;

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-2xl font-semibold text-secondary-900">Add New Task</h2>
      </div>
      
      <div className="card-body">
        <form
          onSubmit={handleSubmit}
          noValidate
          role="form"
          aria-label="Add new task"
        >
          <div className="space-y-4">
            {/* Title Field */}
            <div>
              <label
                htmlFor="task-title"
                className="block text-sm font-medium text-secondary-700 mb-1"
              >
                Task Title <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                id="task-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isFormDisabled}
                className={`form-input ${errors.title ? 'border-error-500 focus:border-error-500' : ''}`}
                placeholder="Enter task title"
                maxLength={100}
                aria-describedby={errors.title ? 'title-error' : 'title-help'}
                aria-invalid={errors.title ? 'true' : 'false'}
                tabIndex={0}
              />
              
              {/* Character count for title */}
              <div className="flex justify-between items-center mt-1">
                <div id="title-help" className="text-xs text-secondary-500">
                  {formData.title.length}/100 characters
                </div>
                {errors.title && (
                  <div 
                    id="title-error" 
                    className="text-xs text-error-500"
                    role="alert"
                  >
                    {errors.title}
                  </div>
                )}
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label
                htmlFor="task-description"
                className="block text-sm font-medium text-secondary-700 mb-1"
              >
                Task Description
              </label>
              <textarea
                id="task-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={isFormDisabled}
                className={`form-textarea ${errors.description ? 'border-error-500 focus:border-error-500' : ''}`}
                placeholder="Enter task description (optional)"
                rows={3}
                maxLength={500}
                aria-describedby={errors.description ? 'description-error' : 'description-help'}
                aria-invalid={errors.description ? 'true' : 'false'}
                tabIndex={0}
              />
              
              {/* Character count for description */}
              <div className="flex justify-between items-center mt-1">
                <div id="description-help" className="text-xs text-secondary-500">
                  {formData.description.length}/500 characters
                </div>
                {errors.description && (
                  <div 
                    id="description-error" 
                    className="text-xs text-error-500"
                    role="alert"
                  >
                    {errors.description}
                  </div>
                )}
              </div>
            </div>

            {/* Priority Field */}
            <div>
              <label
                htmlFor="task-priority"
                className="block text-sm font-medium text-secondary-700 mb-1"
              >
                Priority
              </label>
              <select
                id="task-priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                disabled={isFormDisabled}
                className={`form-select ${errors.priority ? 'border-error-500 focus:border-error-500' : ''}`}
                aria-describedby={errors.priority ? 'priority-error' : 'priority-help'}
                aria-invalid={errors.priority ? 'true' : 'false'}
                tabIndex={0}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              
              <div className="flex justify-between items-center mt-1">
                <div id="priority-help" className="text-xs text-secondary-500">
                  Set task priority level
                </div>
                {errors.priority && (
                  <div 
                    id="priority-error" 
                    className="text-xs text-error-500"
                    role="alert"
                  >
                    {errors.priority}
                  </div>
                )}
              </div>
            </div>

            {/* Due Date Field */}
            <div>
              <label
                htmlFor="task-due-date"
                className="block text-sm font-medium text-secondary-700 mb-1"
              >
                Due Date
              </label>
              <input
                type="date"
                id="task-due-date"
                name="due_date"
                value={formData.due_date}
                onChange={handleInputChange}
                disabled={isFormDisabled}
                className={`form-input ${errors.due_date ? 'border-error-500 focus:border-error-500' : ''}`}
                aria-describedby={errors.due_date ? 'due-date-error' : 'due-date-help'}
                aria-invalid={errors.due_date ? 'true' : 'false'}
                tabIndex={0}
              />
              
              <div className="flex justify-between items-center mt-1">
                <div id="due-date-help" className="text-xs text-secondary-500">
                  Optional: Set when task should be completed
                </div>
                {errors.due_date && (
                  <div 
                    id="due-date-error" 
                    className="text-xs text-error-500"
                    role="alert"
                  >
                    {errors.due_date}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isFormDisabled}
              className="btn btn-secondary"
              tabIndex={0}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isFormDisabled}
              className="btn btn-primary"
              tabIndex={0}
            >
              {isSubmitting || loading ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;