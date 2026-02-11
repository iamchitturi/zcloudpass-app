# Test Structure

This directory contains all unit tests for the zCloudPass application.

## Directory Structure

```
tests/
├── lib/
│   ├── crypto.test.ts          # Tests for encryption/decryption logic
│   ├── api.test.ts             # Tests for API client
│   └── utils.test.ts           # Tests for utility functions
├── components/
│   ├── Login.test.tsx          # Tests for Login component
│   ├── Register.test.tsx       # Tests for Register component
│   ├── Vault.test.tsx          # Tests for Vault component
│   ├── Passwordgenerator.test.tsx # Tests for Password Generator
│   └── Settings.test.tsx       # Tests for Settings component
└── setup.test.ts               # Test environment setup verification
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (re-run on file changes)
```bash
npm test -- --watch
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage report
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test -- crypto.test.ts
```

## Test Coverage

The test suite covers:

### **Crypto Module** (`lib/crypto.test.ts`)
- Vault creation
- Password generation
- Vault encryption/decryption
- Encryption with different password strengths
- Handling special characters and Unicode
- Large vault handling
- Error cases (wrong password, corrupted data)

### **API Client** (`lib/api.test.ts`)
- User registration
- User login
- Vault operations (fetch, update)
- Password changes
- Health checks
- Authentication status
- Session management
- Error handling

### **Utils** (`lib/utils.test.ts`)
- Class name merging (Tailwind utilities)
- Conditional CSS classes
- Complex class combinations
- Responsive classes
- Pseudo-classes

### **Login Component** (`components/Login.test.tsx`)
- Form rendering
- Successful login
- Error handling
- Password visibility toggle
- Registration link
- Form validation
- Loading states

### **Register Component** (`components/Register.test.tsx`)
- Registration form rendering
- Successful registration
- Error handling
- Password strength indicator
- Vault encryption before registration
- Form validation

### **Vault Component** (`components/Vault.test.tsx`)
- Vault fetching and decryption
- Password entry display
- Empty vault handling
- Error handling
- Add password functionality

### **Password Generator** (`components/Passwordgenerator.test.tsx`)
- Password generation
- Customizable length
- Copy to clipboard
- Special character inclusion
- UI interactions

### **Settings Component** (`components/Settings.test.tsx`)
- Password change form
- Success/error messages
- Logout functionality
- Theme toggle
- Form validation

## Technology Stack

- **Test Runner**: Vitest
- **DOM Testing**: React Testing Library
- **DOM Environment**: jsdom
- **Coverage**: @vitest/coverage-v8

## Writing New Tests

When adding new features, follow these patterns:

### Basic Test Structure
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Feature Name', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup code
  });

  it('should do something', () => {
    // Arrange
    const value = 'test';
    
    // Act
    const result = someFunction(value);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### Mocking API Calls
```typescript
vi.mock('../../src/lib/api', () => ({
  api: {
    login: vi.fn(),
  },
}));

// In your test
(api.login as any).mockResolvedValueOnce({ token: 'test' });
```

### Testing Async Code
```typescript
it('should handle async operations', async () => {
  await someAsyncFunction();
  
  await waitFor(() => {
    expect(screen.getByText('loaded')).toBeTruthy();
  });
});
```

## Best Practices

1. **Use descriptive test names**: Test names should clearly describe what is being tested
2. **Follow AAA pattern**: Arrange, Act, Assert
3. **Mock external dependencies**: Mock API calls, crypto operations, and routing
4. **Test user interactions**: Focus on how users interact with components
5. **Test error cases**: Always test error handling
6. **Keep tests isolated**: Each test should be independent
7. **Use beforeEach**: Set up common test state
8. **Clear mocks**: Always clear mocks between tests

## Debugging Tests

### Run a single test
```typescript
it.only('specific test', () => {
  // Only this test will run
});
```

### Skip a test
```typescript
it.skip('test to skip', () => {
  // This test will be skipped
});
```

### Debug output
```typescript
console.log('debug value:', value);
screen.debug(); // Print DOM
```

## Continuous Integration

These tests are designed to run in CI/CD pipelines:
- All tests must pass before code can be merged
- Coverage reports are generated automatically
- Tests run on every commit

## Known Limitations

- Component tests mock API calls and crypto operations
- UI tests focus on user interactions, not styling
- Some advanced UI interactions may require additional setup

## Contributing

When contributing new tests:
1. Follow existing test patterns
2. Ensure tests are deterministic (no random failures)
3. Add tests for new features
4. Update this README if adding new test categories
5. Aim for high coverage but focus on meaningful tests
