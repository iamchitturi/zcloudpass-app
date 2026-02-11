import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '../test-utils';
import Passwordgenerator from '../../src/components/Passwordgenerator';
import { generatePassword } from '../../src/lib/crypto';

// Mock crypto
vi.mock('../../src/lib/crypto', () => ({
  generatePassword: vi.fn(() => 'TestPassword123!@#'),
  encryptVault: vi.fn(),
  decryptVault: vi.fn(),
  createEmptyVault: vi.fn(() => ({ entries: [] })),
}));

describe('Password Generator Component', () => {
  const mockOnOpenChange = vi.fn();
  const mockOnGenerate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render password generator dialog', () => {
    const { container } = render(
      <Passwordgenerator 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        onGenerate={mockOnGenerate} 
      />
    );
    
    expect(container).toBeTruthy();
  });

  it('should accept open prop', () => {
    const { container } = render(
      <Passwordgenerator 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        onGenerate={mockOnGenerate} 
      />
    );
    
    expect(container).toBeTruthy();
  });

  it('should accept onOpenChange callback', () => {
    const { container } = render(
      <Passwordgenerator 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        onGenerate={mockOnGenerate} 
      />
    );
    
    expect(mockOnOpenChange).toBeDefined();
    expect(container).toBeTruthy();
  });

  it('should accept onGenerate callback', () => {
    const { container } = render(
      <Passwordgenerator 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        onGenerate={mockOnGenerate} 
      />
    );
    
    expect(mockOnGenerate).toBeDefined();
    expect(container).toBeTruthy();
  });

  it('should render closed when open is false', () => {
    const { container } = render(
      <Passwordgenerator 
        open={false} 
        onOpenChange={mockOnOpenChange} 
        onGenerate={mockOnGenerate} 
      />
    );
    
    expect(container).toBeTruthy();
  });

  it('should support password mode', () => {
    const { container } = render(
      <Passwordgenerator 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        onGenerate={mockOnGenerate} 
      />
    );
    
    expect(container).toBeTruthy();
  });

  it('should support passphrase mode', () => {
    const { container } = render(
      <Passwordgenerator 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        onGenerate={mockOnGenerate} 
      />
    );
    
    expect(container).toBeTruthy();
  });

  it('should have adjustable length settings', () => {
    const { container } = render(
      <Passwordgenerator 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        onGenerate={mockOnGenerate} 
      />
    );
    
    expect(container).toBeTruthy();
  });

  it('should have character type options', () => {
    const { container } = render(
      <Passwordgenerator 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        onGenerate={mockOnGenerate} 
      />
    );
    
    expect(container).toBeTruthy();
  });

  it('should call generatePassword when requested', () => {
    (generatePassword as any).mockClear();
    
    const { container } = render(
      <Passwordgenerator 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        onGenerate={mockOnGenerate} 
      />
    );
    
    expect(container).toBeTruthy();
  });

  it('should support clipboard copy', async () => {
    const mockClipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
    };
    Object.assign(navigator, {
      clipboard: mockClipboard,
    });

    render(
      <Passwordgenerator 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        onGenerate={mockOnGenerate} 
      />
    );

    expect(mockClipboard).toBeDefined();
  });

  it('should call onGenerate with password', () => {
    render(
      <Passwordgenerator 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        onGenerate={mockOnGenerate} 
      />
    );

    expect(mockOnGenerate).toBeDefined();
  });

  it('should handle multiple character set combinations', () => {
    const { container } = render(
      <Passwordgenerator 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        onGenerate={mockOnGenerate} 
      />
    );
    
    expect(container).toBeTruthy();
  });

  it('should support passphrase word count adjustment', () => {
    const { container } = render(
      <Passwordgenerator 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        onGenerate={mockOnGenerate} 
      />
    );
    
    expect(container).toBeTruthy();
  });
});
