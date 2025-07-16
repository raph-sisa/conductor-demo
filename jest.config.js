module.exports = {
  // The test environment that will be used for testing
  testEnvironment: 'jsdom',
  
  // Setup files to run before tests
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  
  // Module file extensions for importing
  moduleFileExtensions: ['js', 'jsx', 'json'],
  
  // Transform files before testing
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  
  // Module name mapping for CSS modules and static assets
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
  
  // Files to collect coverage from
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/setupTests.js',
    '!src/**/*.test.{js,jsx}',
    '!src/**/*.spec.{js,jsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Coverage reporters
  coverageReporters: ['json', 'lcov', 'text', 'html'],
  
  // Test match patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx}',
  ],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/build/',
  ],
  
  // Watch ignore patterns
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/build/',
  ],
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Verbose output
  verbose: true,
};