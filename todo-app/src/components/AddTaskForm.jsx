import React, { useState } from 'react';

const AddTaskForm = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onAdd(formData);
      setFormData({ title: '', description: '', project: '' });
      setIsOpen(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary w-full mb-6"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add New Task
      </button>
    );
  }

  return (
    <div className="card mb-6">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900">Add New Task</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title..."
              className="form-input"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description..."
              rows={3}
              className="form-textarea"
            />
          </div>

          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
              Project
            </label>
            <select
              id="project"
              name="project"
              value={formData.project}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select a project...</option>
              <option value="work">Work Tasks</option>
              <option value="personal">Personal</option>
              <option value="shopping">Shopping</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!formData.title.trim()}
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskForm;