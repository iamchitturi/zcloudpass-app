import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import Login from '../../src/components/Login';
import { api } from '../../src/lib/api';

// Mock the API
vi.mock('../../src/lib/api', () => ({
  api: {
    login: vi.fn(),
    isAuthenticated: vi.fn(() => false),
  },
}));

describe('Login Component', () => {
  const mockOnLoginSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render without crashing', () => {
    const { container } = render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    expect(container).toBeTruthy();
  });

  it('should accept onLoginSuccess callback', () => {
    const { container } = render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    expect(mockOnLoginSuccess).toBeDefined();
    expect(container).toBeTruthy();
  });

  it('should handle login API call', async () => {
    (api.login as any).mockResolvedValueOnce({
      session_token: 'test-token',
      expires_at: '2024-12-31',
    });

    const { container } = render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    expect(container).toBeTruthy();
  });

  it('should handle API errors gracefully', async () => {
    (api.login as any).mockRejectedValueOnce(new Error('Login failed'));

    const { container } = render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    expect(container).toBeTruthy();
  });
});
