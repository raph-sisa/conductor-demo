import React from 'react';

const StyleGuide = () => {
  const sampleTask = {
    id: 1,
    title: "Complete project documentation",
    description: "Write comprehensive documentation for the todo app project including API docs and user guide",
    completed: false,
    project: "Work Tasks",
    createdAt: "2024-01-15"
  };

  const sampleCompletedTask = {
    ...sampleTask,
    id: 2,
    title: "Setup development environment",
    completed: true
  };

  const sampleProject = {
    id: 1,
    name: "Work Tasks",
    description: "Professional work-related tasks and projects",
    taskCount: 8,
    completedCount: 3
  };

  return (
    <div className="container-md py-8">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Todo App Style Guide
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive styling system built with Tailwind CSS
          </p>
        </div>

        {/* Color Palette */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Color Palette</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Primary Colors */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Primary (Blue)</h3>
              <div className="space-y-2">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
                  <div key={shade} className="flex items-center space-x-3">
                    <div className={`w-12 h-6 rounded bg-primary-${shade} border border-gray-200`} />
                    <span className="text-sm font-mono">primary-{shade}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Colors */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Success (Green)</h3>
              <div className="space-y-2">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
                  <div key={shade} className="flex items-center space-x-3">
                    <div className={`w-12 h-6 rounded bg-success-${shade} border border-gray-200`} />
                    <span className="text-sm font-mono">success-{shade}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Colors */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Error (Red)</h3>
              <div className="space-y-2">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
                  <div key={shade} className="flex items-center space-x-3">
                    <div className={`w-12 h-6 rounded bg-error-${shade} border border-gray-200`} />
                    <span className="text-sm font-mono">error-{shade}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Typography</h2>
          <div className="space-y-4">
            <h1>Heading 1 - Main page titles</h1>
            <h2>Heading 2 - Section titles</h2>
            <h3>Heading 3 - Subsection titles</h3>
            <h4>Heading 4 - Component titles</h4>
            <h5>Heading 5 - Small headings</h5>
            <h6>Heading 6 - Smallest headings</h6>
            <p>Body text - Regular paragraph text with proper line height and spacing for optimal readability.</p>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Buttons</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Button Variants</h3>
              <div className="flex flex-wrap gap-3">
                <button className="btn btn-primary">Primary</button>
                <button className="btn btn-secondary">Secondary</button>
                <button className="btn btn-success">Success</button>
                <button className="btn btn-warning">Warning</button>
                <button className="btn btn-error">Error</button>
                <button className="btn btn-outline">Outline</button>
                <button className="btn btn-outline-primary">Outline Primary</button>
                <button className="btn btn-ghost">Ghost</button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Button Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <button className="btn btn-primary btn-sm">Small</button>
                <button className="btn btn-primary">Default</button>
                <button className="btn btn-primary btn-lg">Large</button>
              </div>
            </div>
          </div>
        </section>

        {/* Forms */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Form Elements</h2>
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Input
              </label>
              <input type="text" className="form-input" placeholder="Enter text..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Textarea
              </label>
              <textarea className="form-textarea" rows={3} placeholder="Enter description..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select
              </label>
              <select className="form-select">
                <option>Choose an option...</option>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <input type="checkbox" className="form-checkbox" />
              <label className="text-sm text-gray-700">
                Checkbox option
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input type="radio" className="form-radio" name="radio-example" />
              <label className="text-sm text-gray-700">
                Radio option
              </label>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold">Card with Header</h3>
              </div>
              <div className="card-body">
                <p className="text-gray-600">
                  This is a card with a header and body section. Cards are used throughout the application for containing related content.
                </p>
              </div>
              <div className="card-footer">
                <button className="btn btn-primary btn-sm">Action</button>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h3 className="text-lg font-semibold mb-3">Simple Card</h3>
                <p className="text-gray-600">
                  This is a simple card with just a body section. Perfect for basic content blocks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Badges</h2>
          <div className="flex flex-wrap gap-3">
            <span className="badge badge-primary">Primary</span>
            <span className="badge badge-secondary">Secondary</span>
            <span className="badge badge-success">Success</span>
            <span className="badge badge-warning">Warning</span>
            <span className="badge badge-error">Error</span>
          </div>
        </section>

        {/* Alerts */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Alerts</h2>
          <div className="space-y-4">
            <div className="alert alert-success">
              <strong>Success!</strong> Your task has been created successfully.
            </div>
            <div className="alert alert-warning">
              <strong>Warning!</strong> Please check your input before proceeding.
            </div>
            <div className="alert alert-error">
              <strong>Error!</strong> Something went wrong. Please try again.
            </div>
            <div className="alert alert-info">
              <strong>Info:</strong> This is some helpful information for the user.
            </div>
          </div>
        </section>

        {/* Loading States */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Loading States</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Spinner</h3>
              <div className="spinner w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Skeleton Loading</h3>
              <div className="space-y-3">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-4 w-1/2" />
                <div className="skeleton h-4 w-2/3" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Pulse Animation</h3>
              <div className="card loading">
                <div className="card-body">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Task Components */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Task Components</h2>
          <div className="space-y-4">
            <div className="task-card">
              <div className="card-body">
                <div className="flex items-start space-x-3">
                  <input type="checkbox" className="form-checkbox mt-1" />
                  <div className="flex-1">
                    <h3 className="task-title">Active Task</h3>
                    <p className="task-description">
                      This is an active task that needs to be completed.
                    </p>
                    <div className="task-meta">
                      <span>
                        <span className="badge badge-primary mr-2">Work</span>
                        Created Jan 15, 2024
                      </span>
                      <button className="text-error-600 hover:text-error-700 text-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="task-card completed">
              <div className="card-body">
                <div className="flex items-start space-x-3">
                  <input type="checkbox" className="form-checkbox mt-1" checked />
                  <div className="flex-1">
                    <h3 className="task-title">Completed Task</h3>
                    <p className="task-description">
                      This task has been completed and is struck through.
                    </p>
                    <div className="task-meta">
                      <span>
                        <span className="badge badge-success mr-2">Personal</span>
                        Created Jan 10, 2024
                      </span>
                      <button className="text-error-600 hover:text-error-700 text-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Components */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Project Components</h2>
          <div className="project-card">
            <div className="card-body">
              <h3 className="project-title">Work Tasks</h3>
              <p className="project-description">
                Professional work-related tasks and projects for the current sprint.
              </p>
              <div className="project-stats">
                <span>8 tasks</span>
                <span>3 completed</span>
                <span className="text-primary-600 font-medium">38% complete</span>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="text-gray-700">38%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: '38%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StyleGuide;