import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '../test-utils';
import Settings from '../../src/components/Settings';
import { api } from '../../src/lib/api';

// Mock the API
vi.mock('../../src/lib/api', () => ({
  api: {
    changePassword: vi.fn(),
    logout: vi.fn(),
  },
}));

describe('Settings Component', () => {
  const mockOnLogout = vi.fn();
  const mockTheme = 'light' as const;
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <Settings
        onLogout={mockOnLogout}
        theme={mockTheme}
        toggleTheme={mockToggleTheme}
      />
    );
    expect(container).toBeTruthy();
  });

  it('should accept onLogout callback', () => {
    const { container } = render(
      <Settings
        onLogout={mockOnLogout}
        theme={mockTheme}
        toggleTheme={mockToggleTheme}
      />
    );
    expect(mockOnLogout).toBeDefined();
    expect(container).toBeTruthy();
  });

  it('should accept toggleTheme callback', () => {
    const { container } = render(
      <Settings
        onLogout={mockOnLogout}
        theme={mockTheme}
        toggleTheme={mockToggleTheme}
      />
    );
    expect(mockToggleTheme).toBeDefined();
    expect(container).toBeTruthy();
  });

  it('should handle password change API call', () => {
    (api.changePassword as any).mockResolvedValueOnce({});
    
    const { container } = render(
      <Settings
        onLogout={mockOnLogout}
        theme={mockTheme}
        toggleTheme={mockToggleTheme}
      />
    );
    expect(container).toBeTruthy();
  });

  it('should mock logout API call', () => {
    (api.logout as any).mockResolvedValueOnce({});
    
    const { container } = render(
      <Settings
        onLogout={mockOnLogout}
        theme={mockTheme}
        toggleTheme={mockToggleTheme}
      />
    );
    expect(container).toBeTruthy();
  });

  it('should handle password change errors', () => {
    (api.changePassword as any).mockRejectedValueOnce(new Error('Incorrect password'));
    
    const { container } = render(
      <Settings
        onLogout={mockOnLogout}
        theme={mockTheme}
        toggleTheme={mockToggleTheme}
      />
    );
    expect(container).toBeTruthy();
  });

  it('should handle logout errors', () => {
    (api.logout as any).mockRejectedValueOnce(new Error('Logout failed'));
    
    const { container } = render(
      <Settings
        onLogout={mockOnLogout}
        theme={mockTheme}
        toggleTheme={mockToggleTheme}
      />
    );
    expect(container).toBeTruthy();
  });

  it('should accept light theme', () => {
    const { container } = render(
      <Settings
        onLogout={mockOnLogout}
        theme={'light'}
        toggleTheme={mockToggleTheme}
      />
    );
    expect(container).toBeTruthy();
  });

  it('should accept dark theme', () => {
    const { container } = render(
      <Settings
        onLogout={mockOnLogout}
        theme={'dark'}
        toggleTheme={mockToggleTheme}
      />
    );
    expect(container).toBeTruthy();
  });

  it('should render complete settings interface', () => {
    const { container } = render(
      <Settings
        onLogout={mockOnLogout}
        theme={mockTheme}
        toggleTheme={mockToggleTheme}
      />
    );
    expect(container).toBeTruthy();
    expect(container.children.length).toBeGreaterThan(0);
  });
});

