# Testing Guide

This document outlines the testing setup and best practices for the Todo App project.

## Testing Framework

The project uses the following testing stack:

- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **@testing-library/jest-dom**: Custom Jest matchers for DOM testing
- **@testing-library/user-event**: User interaction testing utilities

## Project Structure

```
src/
├── __tests__/               # Global tests
├── __mocks__/              # Mock files
│   └── fileMock.js         # Static asset mocks
├── components/
│   └── __tests__/          # Component tests
├── services/
│   └── __tests__/          # Service/API tests
├── utils/
│   ├── __tests__/          # Utility function tests
│   └── testUtils.js        # Testing utilities
└── setupTests.js           # Jest setup file
```

## Running Tests

### Development Commands

```bash
# Run tests in watch mode
npm test

# Run tests with coverage
npm run test:coverage

# Run tests for CI/CD
npm run test:ci
```

### Test Coverage

The project has the following coverage thresholds:

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

Coverage reports are generated in the `coverage/` directory.

## Testing Utilities

### Custom Render Function

The `testUtils.js` file provides a custom render function that includes necessary providers:

```javascript
import { render, screen } from '../utils/testUtils';

// This includes BrowserRouter and other providers
render(<MyComponent />);
```

### Mock Data Factories

Use the provided factory functions to create consistent test data:

```javascript
import { createMockTask, createMockProject } from '../utils/testUtils';

const mockTask = createMockTask({
  title: 'Custom title',
  completed: true,
});
```

### Mock Supabase Client

For testing API services:

```javascript
import { createMockSupabaseClient } from '../utils/testUtils';

const mockSupabase = createMockSupabaseClient();
```

## Testing Best Practices

### Component Testing

1. **Test behavior, not implementation**
2. **Use descriptive test names**
3. **Follow the Arrange-Act-Assert pattern**
4. **Test user interactions**
5. **Include accessibility tests**

Example component test structure:

```javascript
describe('ComponentName', () => {
  describe('Rendering', () => {
    // Test component rendering
  });
  
  describe('User Interactions', () => {
    // Test click, form submission, etc.
  });
  
  describe('Accessibility', () => {
    // Test ARIA attributes, keyboard navigation
  });
});
```

### Service Testing

1. **Mock external dependencies**
2. **Test both success and error scenarios**
3. **Validate input parameters**
4. **Test edge cases**

Example service test structure:

```javascript
describe('ServiceName', () => {
  describe('getData', () => {
    // Test successful data fetching
    // Test error handling
  });
  
  describe('createData', () => {
    // Test data creation
    // Test validation
  });
});
```

### Test Data Management

1. **Use factory functions for consistent data**
2. **Clear mocks between tests**
3. **Use realistic test data**
4. **Avoid test data coupling**

### Async Testing

For testing async operations:

```javascript
import { waitFor } from '@testing-library/react';

test('async operation', async () => {
  render(<AsyncComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Loaded data')).toBeInTheDocument();
  });
});
```

## Test Templates

The project includes test templates for common scenarios:

- `src/components/__tests__/ComponentTemplate.test.js` - Component testing template
- `src/services/__tests__/ServiceTemplate.test.js` - Service testing template

Copy these templates and modify them for your specific components and services.

## Example Tests

The project includes example tests for future components:

- `Task.test.js` - Individual task component tests
- `TaskList.test.js` - Task list component tests
- `AddTask.test.js` - Add task form tests
- `taskService.test.js` - Task API service tests

These tests demonstrate:

- Form validation testing
- User interaction testing
- API mocking
- Error handling
- Accessibility testing

## Mocking

### Static Assets

Static assets (images, fonts) are mocked using `src/__mocks__/fileMock.js`.

### External APIs

Supabase client is mocked using the `createMockSupabaseClient` utility.

### Browser APIs

Common browser APIs are mocked in `setupTests.js`:

- `IntersectionObserver`
- `ResizeObserver`
- `matchMedia`
- `localStorage`
- `sessionStorage`

## Debugging Tests

### Console Output

Use `screen.debug()` to see the current DOM state:

```javascript
import { screen } from '@testing-library/react';

test('debug example', () => {
  render(<MyComponent />);
  screen.debug(); // Prints current DOM
});
```

### Query Debugging

Use `screen.logTestingPlaygroundURL()` to get a URL for the Testing Playground:

```javascript
screen.logTestingPlaygroundURL();
```

## CI/CD Integration

The project is configured for CI/CD with:

- Coverage reporting
- Test result caching
- Parallel test execution
- Fail-fast on test failures

## Adding New Tests

When adding new components or services:

1. Copy the appropriate template
2. Update the test file name and imports
3. Modify test cases for your specific functionality
4. Ensure all test cases pass
5. Check coverage meets the threshold

## Common Testing Patterns

### Testing Forms

```javascript
test('form submission', async () => {
  const mockSubmit = jest.fn();
  render(<MyForm onSubmit={mockSubmit} />);
  
  fireEvent.change(screen.getByLabelText('Title'), {
    target: { value: 'Test' }
  });
  
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({ title: 'Test' });
  });
});
```

### Testing Error States

```javascript
test('error handling', async () => {
  const mockApi = jest.fn().mockRejectedValue(new Error('API Error'));
  
  render(<MyComponent apiCall={mockApi} />);
  
  await waitFor(() => {
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });
});
```

### Testing Loading States

```javascript
test('loading state', () => {
  render(<MyComponent loading={true} />);
  
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});
```

## Troubleshooting

### Common Issues

1. **Tests timeout**: Increase timeout or use `waitFor` correctly
2. **Element not found**: Use `screen.debug()` to inspect DOM
3. **Mock not working**: Ensure mocks are properly set up in `beforeEach`
4. **Async issues**: Use `waitFor` for async operations

### Performance

- Use `screen.getByRole` over `screen.getByText` when possible
- Avoid using `container.querySelector` - use Testing Library queries
- Clear mocks between tests to prevent memory leaks

## Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Best Practices](https://kentcdodds.com/blog/testing-implementation-details)