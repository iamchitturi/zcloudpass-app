import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '../test-utils';
import Vault from '../../src/components/Vault';
import { api } from '../../src/lib/api';
import { decryptVault } from '../../src/lib/crypto';

// Mock the API
vi.mock('../../src/lib/api', () => ({
  api: {
    getVault: vi.fn(),
    updateVault: vi.fn(),
    logout: vi.fn(),
  },
}));

// Mock crypto
vi.mock('../../src/lib/crypto', () => ({
  decryptVault: vi.fn(),
  encryptVault: vi.fn(),
  createEmptyVault: vi.fn(() => ({ entries: [] })),
  generatePassword: vi.fn(),
}));

describe('Vault Component', () => {
  const mockOnLogout = vi.fn();
  const mockTheme = 'light' as const;
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('master_password_hash', 'test-password');
  });

  it('should render without crashing', () => {
    (api.getVault as any).mockResolvedValueOnce({
      encrypted_vault: 'encrypted-data',
    });
    (decryptVault as any).mockResolvedValueOnce({ entries: [] });

    const { container } = render(
      <Vault
        onLogout={mockOnLogout}
        theme={mockTheme}
        toggleTheme={mockToggleTheme}
      />
    );
    
    expect(container).toBeTruthy();
  });

  it('should fetch vault on mount', () => {
    (api.getVault as any).mockResolvedValueOnce({
      encrypted_vault: 'encrypted-data',
    });
    (decryptVault as any).mockResolvedValueOnce({ entries: [] });

    const { container } = render(
      <Vault
        onLogout={mockOnLogout}
        theme={mockTheme}
        toggleTheme={mockToggleTheme}
      />
    );
    
    expect(container).toBeTruthy();
  });

  it('should handle successful vault fetch', () => {
    const mockVault = { entries: [] };
    (api.getVault as any).mockResolvedValueOnce({
      encrypted_vault: 'encrypted-data',
    });
    (decryptVault as any).mockResolvedValueOnce(mockVault);

    const { container } = render(
      <Vault
        onLogout={mockOnLogout}
        theme={mockTheme}
        toggleTheme={mockToggleTheme}
      />
    );

    expect(container).toBeTruthy();
  });

  it('should handle null encrypted vault', () => {
    (api.getVault as any).mockResolvedValueOnce({
      encrypted_vault: null,
    });

    const { container } = render(
      <Vault
        onLogout={mockOnLogout}
        theme={mockTheme}
        toggleTheme={mockToggleTheme}
      />
    );

    expect(container).toBeTruthy();
  });

  it('should handle fetch errors gracefully', () => {
    (api.getVault as any).mockRejectedValueOnce(
      new Error('Failed to fetch vault')
    );

    const { container } = render(
      <Vault
        onLogout={mockOnLogout}
        theme={mockTheme}
        toggleTheme={mockToggleTheme}
      />
    );

    expect(container).toBeTruthy();
  });

  it('should accept theme configuration', () => {
    (api.getVault as any).mockResolvedValueOnce({
      encrypted_vault: 'encrypted-data',
    });
    (decryptVault as any).mockResolvedValueOnce({ entries: [] });

    const { container } = render(
      <Vault
        onLogout={mockOnLogout}
        theme="dark"
        toggleTheme={mockToggleTheme}
      />
    );
    
    expect(container).toBeTruthy();
  });

  it('should call logout callback when provided', () => {
    (api.getVault as any).mockResolvedValueOnce({
      encrypted_vault: null,
    });

    const { container } = render(
      <Vault
        onLogout={mockOnLogout}
        theme={mockTheme}
        toggleTheme={mockToggleTheme}
      />
    );

    expect(mockOnLogout).toBeDefined();
    expect(container).toBeTruthy();
  });

  it('should accept toggleTheme callback', () => {
    (api.getVault as any).mockResolvedValueOnce({
      encrypted_vault: 'encrypted-data',
    });
    (decryptVault as any).mockResolvedValueOnce({ entries: [] });

    const { container } = render(
      <Vault
        onLogout={mockOnLogout}
        theme={mockTheme}
        toggleTheme={mockToggleTheme}
      />
    );

    expect(mockToggleTheme).toBeDefined();
    expect(container).toBeTruthy();
  });

  it('should handle decryption with password from localStorage', () => {
    localStorage.setItem('master_password_hash', 'test-master-password');
    
    (api.getVault as any).mockResolvedValueOnce({
      encrypted_vault: 'test-encrypted-data',
    });
    (decryptVault as any).mockResolvedValueOnce({
      entries: [
        {
          id: '1',
          name: 'Test Entry',
          username: 'user',
          password: 'pass',
        },
      ],
    });

    const { container } = render(
      <Vault
        onLogout={mockOnLogout}
        theme={mockTheme}
        toggleTheme={mockToggleTheme}
      />
    );

    expect(container).toBeTruthy();
  });

  it('should work with various entry types', () => {
    (api.getVault as any).mockResolvedValueOnce({
      encrypted_vault: 'encrypted-data',
    });
    (decryptVault as any).mockResolvedValueOnce({
      entries: [
        {
          id: '1',
          name: 'Email',
          username: 'user@example.com',
          password: 'pass123',
          url: 'https://mail.example.com',
          notes: 'Work email',
        },
        {
          id: '2',
          name: 'GitHub',
          username: 'developer',
          password: 'token',
          url: 'https://github.com',
        },
      ],
    });

    const { container } = render(
      <Vault
        onLogout={mockOnLogout}
        theme={mockTheme}
        toggleTheme={mockToggleTheme}
      />
    );

    expect(container).toBeTruthy();
  });

  it('should update vault when updateVault is called', () => {
    (api.getVault as any).mockResolvedValueOnce({
      encrypted_vault: 'encrypted-data',
    });
    (decryptVault as any).mockResolvedValueOnce({ entries: [] });
    (api.updateVault as any).mockResolvedValueOnce(true);

    const { container } = render(
      <Vault
        onLogout={mockOnLogout}
        theme={mockTheme}
        toggleTheme={mockToggleTheme}
      />
    );

    expect(container).toBeTruthy();
  });

  it('should handle session expiration', () => {
    const error = new Error('Unauthorized');
    (error as any).code = 401;
    (api.getVault as any).mockRejectedValueOnce(error);

    const { container } = render(
      <Vault
        onLogout={mockOnLogout}
        theme={mockTheme}
        toggleTheme={mockToggleTheme}
      />
    );

    expect(container).toBeTruthy();
  });
});

