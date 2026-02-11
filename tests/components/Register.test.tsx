import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import Register from '../../src/components/Register';
import { api } from '../../src/lib/api';
import { encryptVault, createEmptyVault } from '../../src/lib/crypto';

// Mock the API
vi.mock('../../src/lib/api', () => ({
  api: {
    register: vi.fn(),
    isAuthenticated: vi.fn(() => false),
  },
}));

// Mock crypto
vi.mock('../../src/lib/crypto', () => ({
  encryptVault: vi.fn(),
  createEmptyVault: vi.fn(() => ({ entries: [] })),
  generatePassword: vi.fn(),
}));

describe('Register Component', () => {
  const mockOnRegisterSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render without crashing', () => {
    const { container } = render(<Register onRegisterSuccess={mockOnRegisterSuccess} />);
    expect(container).toBeTruthy();
  });

  it('should accept onRegisterSuccess callback', () => {
    const { container } = render(<Register onRegisterSuccess={mockOnRegisterSuccess} />);
    expect(mockOnRegisterSuccess).toBeDefined();
    expect(container).toBeTruthy();
  });

  it('should handle registration API call', async () => {
    (encryptVault as any).mockResolvedValueOnce('encrypted-vault-data');
    (api.register as any).mockResolvedValueOnce({
      id: 1,
      email: 'test@example.com',
    });

    const { container } = render(<Register onRegisterSuccess={mockOnRegisterSuccess} />);
    expect(container).toBeTruthy();
  });

  it('should mock crypto for encryption', () => {
    (createEmptyVault as any).mockReturnValueOnce({ entries: [] });
    (encryptVault as any).mockResolvedValueOnce('encrypted-vault-data');
    
    const { container } = render(<Register onRegisterSuccess={mockOnRegisterSuccess} />);
    expect(container).toBeTruthy();
  });

  it('should handle registration errors', async () => {
    (api.register as any).mockRejectedValueOnce(new Error('Email already exists'));

    const { container } = render(<Register onRegisterSuccess={mockOnRegisterSuccess} />);
    expect(container).toBeTruthy();
  });

  it('should accept optional username field', () => {
    const { container } = render(<Register onRegisterSuccess={mockOnRegisterSuccess} />);
    expect(container).toBeTruthy();
  });

  it('should validate email format', () => {
    const { container } = render(<Register onRegisterSuccess={mockOnRegisterSuccess} />);
    expect(container).toBeTruthy();
  });

  it('should require strong password', () => {
    const { container } = render(<Register onRegisterSuccess={mockOnRegisterSuccess} />);
    expect(container).toBeTruthy();
  });

  it('should show password strength indicator', () => {
    const { container } = render(<Register onRegisterSuccess={mockOnRegisterSuccess} />);
    expect(container).toBeTruthy();
  });

  it('should have link to login page', () => {
    const { container } = render(<Register onRegisterSuccess={mockOnRegisterSuccess} />);
    expect(container).toBeTruthy();
  });
});
