import React from 'react';
import { render } from '@testing-library/react';

// Custom render function that includes providers
const AllTheProviders = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Common test utilities
export const createMockTask = (overrides = {}) => ({
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  project_id: null,
  ...overrides,
});

export const createMockProject = (overrides = {}) => ({
  id: 1,
  name: 'Test Project',
  description: 'Test Project Description',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

// Mock API responses
export const mockApiResponse = (data, error = null) => {
  if (error) {
    return Promise.reject(error);
  }
  return Promise.resolve({ data });
};

// Wait for async operations
export const waitFor = (callback, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      try {
        callback();
        resolve();
      } catch (error) {
        if (Date.now() - startTime > timeout) {
          reject(error);
        } else {
          setTimeout(check, 10);
        }
      }
    };
    check();
  });
};

// Mock Supabase client
export const createMockSupabaseClient = () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  then: jest.fn(),
  catch: jest.fn(),
});

// Helper to mock console methods
export const mockConsole = (method = 'log') => {
  const originalMethod = console[method];
  const mockMethod = jest.fn();
  
  beforeEach(() => {
    console[method] = mockMethod;
  });
  
  afterEach(() => {
    console[method] = originalMethod;
    mockMethod.mockClear();
  });
  
  return mockMethod;
};