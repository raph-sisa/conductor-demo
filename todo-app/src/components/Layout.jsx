import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="main-header">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">
                Todo App
              </h1>
            </div>
            <nav className="nav">
              <a href="#" className="nav-link active">
                Tasks
              </a>
              <a href="#" className="nav-link">
                Projects
              </a>
              <a href="#" className="nav-link">
                Settings
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sidebar p-0 bg-transparent border-0">
              <div className="sidebar-nav">
                <a href="#" className="sidebar-nav-item active">
                  All Tasks
                </a>
                <a href="#" className="sidebar-nav-item">
                  Today
                </a>
                <a href="#" className="sidebar-nav-item">
                  Upcoming
                </a>
                <a href="#" className="sidebar-nav-item">
                  Completed
                </a>
              </div>
              
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Projects
                </h3>
                <div className="space-y-2">
                  <a href="#" className="block text-sm text-gray-700 hover:text-primary-600">
                    Work Tasks
                  </a>
                  <a href="#" className="block text-sm text-gray-700 hover:text-primary-600">
                    Personal
                  </a>
                  <a href="#" className="block text-sm text-gray-700 hover:text-primary-600">
                    Shopping
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;