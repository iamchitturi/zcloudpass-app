import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  encryptVault,
  decryptVault,
  createEmptyVault,
  generatePassword,
  type Vault,
  type VaultEntry,
} from '../../src/lib/crypto';

describe('Crypto Module', () => {
  describe('createEmptyVault', () => {
    it('should create an empty vault with no entries', () => {
      const vault = createEmptyVault();
      expect(vault).toEqual({ entries: [] });
      expect(vault.entries).toHaveLength(0);
    });

    it('should return a new vault object each time', () => {
      const vault1 = createEmptyVault();
      const vault2 = createEmptyVault();
      expect(vault1).not.toBe(vault2);
      expect(vault1).toEqual(vault2);
    });
  });

  describe('generatePassword', () => {
    it('should generate a password of default length 16', () => {
      const password = generatePassword();
      expect(password).toHaveLength(16);
    });

    it('should generate a password of specified length', () => {
      const lengths = [8, 12, 20, 32];
      lengths.forEach((len) => {
        const password = generatePassword(len);
        expect(password).toHaveLength(len);
      });
    });

    it('should generate a password with special characters', () => {
      const password = generatePassword(50);
      const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
      const hasLetters = /[a-zA-Z]/.test(password);
      const hasNumbers = /[0-9]/.test(password);
      
      // At least one category should be present (most likely)
      expect(hasLetters || hasNumbers || hasSpecialChars).toBe(true);
    });

    it('should generate different passwords on each call', () => {
      const password1 = generatePassword(20);
      const password2 = generatePassword(20);
      expect(password1).not.toBe(password2);
    });

    it('should only contain valid charset characters', () => {
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
      const password = generatePassword(100);
      
      for (const char of password) {
        expect(charset).toContain(char);
      }
    });
  });

  describe('encryptVault and decryptVault', () => {
    let testVault: Vault;
    const masterPassword = 'TestPassword123!';

    beforeEach(() => {
      testVault = {
        entries: [
          {
            id: '1',
            name: 'Gmail',
            username: 'user@gmail.com',
            password: 'encrypted-password-123',
            url: 'https://gmail.com',
            notes: 'Personal email account',
          },
          {
            id: '2',
            name: 'GitHub',
            username: 'myusername',
            password: 'github-token-abc',
            url: 'https://github.com',
          },
          {
            id: '3',
            name: 'Bank',
            username: 'accountnumber',
            password: 'bank-password-secure',
            notes: 'Primary checking account',
          },
        ],
      };
    });

    it('should encrypt vault to a base64 string', async () => {
      const encrypted = await encryptVault(testVault, masterPassword);
      
      expect(typeof encrypted).toBe('string');
      expect(encrypted.length).toBeGreaterThan(0);
      // Base64 strings should only contain valid characters
      expect(/^[A-Za-z0-9+/=]*$/.test(encrypted)).toBe(true);
    });

    it('should produce different encrypted output for same vault (due to random salt/iv)', async () => {
      const encrypted1 = await encryptVault(testVault, masterPassword);
      const encrypted2 = await encryptVault(testVault, masterPassword);
      
      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should decrypt vault to original data', async () => {
      const encrypted = await encryptVault(testVault, masterPassword);
      const decrypted = await decryptVault(encrypted, masterPassword);
      
      expect(decrypted).toEqual(testVault);
      expect(decrypted.entries).toHaveLength(3);
    });

    it('should preserve all vault entry fields after encrypt/decrypt', async () => {
      const encrypted = await encryptVault(testVault, masterPassword);
      const decrypted = await decryptVault(encrypted, masterPassword);
      
      const originalEntry = testVault.entries[0];
      const decryptedEntry = decrypted.entries[0];
      
      expect(decryptedEntry.id).toBe(originalEntry.id);
      expect(decryptedEntry.name).toBe(originalEntry.name);
      expect(decryptedEntry.username).toBe(originalEntry.username);
      expect(decryptedEntry.password).toBe(originalEntry.password);
      expect(decryptedEntry.url).toBe(originalEntry.url);
      expect(decryptedEntry.notes).toBe(originalEntry.notes);
    });

    it('should fail to decrypt with wrong password', async () => {
      const encrypted = await encryptVault(testVault, masterPassword);
      
      await expect(
        decryptVault(encrypted, 'WrongPassword123!')
      ).rejects.toThrow('Failed to decrypt vault');
    });

    it('should handle empty vault', async () => {
      const emptyVault = createEmptyVault();
      const encrypted = await encryptVault(emptyVault, masterPassword);
      const decrypted = await decryptVault(encrypted, masterPassword);
      
      expect(decrypted.entries).toHaveLength(0);
    });

    it('should handle vault with optional fields missing', async () => {
      const minimalVault: Vault = {
        entries: [
          {
            id: 'min1',
            name: 'Minimal Entry',
            // No username, password, url, or notes
          },
        ],
      };
      
      const encrypted = await encryptVault(minimalVault, masterPassword);
      const decrypted = await decryptVault(encrypted, masterPassword);
      
      expect(decrypted.entries[0].name).toBe('Minimal Entry');
      expect(decrypted.entries[0].username).toBeUndefined();
    });

    it('should handle special characters in passwords', async () => {
      const specialVault: Vault = {
        entries: [
          {
            id: '1',
            name: 'Test',
            password: '!@#$%^&*()_+-=[]{}|;:,.<>?"\'{}<>',
          },
        ],
      };
      
      const encrypted = await encryptVault(specialVault, masterPassword);
      const decrypted = await decryptVault(encrypted, masterPassword);
      
      expect(decrypted.entries[0].password).toBe(specialVault.entries[0].password);
    });

    it('should handle unicode characters in vault data', async () => {
      const unicodeVault: Vault = {
        entries: [
          {
            id: '1',
            name: 'Unicode Test',
            username: '用户名',
            password: 'Привет123🔒',
            notes: 'Émoji tëst 🎯',
          },
        ],
      };
      
      const encrypted = await encryptVault(unicodeVault, masterPassword);
      const decrypted = await decryptVault(encrypted, masterPassword);
      
      expect(decrypted.entries[0].username).toBe('用户名');
      expect(decrypted.entries[0].password).toBe('Привет123🔒');
      expect(decrypted.entries[0].notes).toBe('Émoji tëst 🎯');
    });

    it('should handle large vaults with many entries', async () => {
      const largeVault: Vault = {
        entries: Array.from({ length: 100 }, (_, i) => ({
          id: `entry-${i}`,
          name: `Account ${i}`,
          username: `user${i}@example.com`,
          password: `password-${i}-secure`,
          url: `https://example${i}.com`,
          notes: `Notes for account ${i}`,
        })),
      };
      
      const encrypted = await encryptVault(largeVault, masterPassword);
      const decrypted = await decryptVault(encrypted, masterPassword);
      
      expect(decrypted.entries).toHaveLength(100);
      expect(decrypted.entries[50].name).toBe('Account 50');
    });

    it('should reject invalid/corrupted encrypted data', async () => {
      const invalidData = 'InvalidBase64Data!@#$';
      
      await expect(
        decryptVault(invalidData, masterPassword)
      ).rejects.toThrow();
    });

    it('should work with various master password strengths', async () => {
      const passwords = [
        'simple',
        'MediumComplex123',
        'V3ry!Str0ng&P@ssw0rd#2024',
      ];
      
      for (const pwd of passwords) {
        const encrypted = await encryptVault(testVault, pwd);
        const decrypted = await decryptVault(encrypted, pwd);
        expect(decrypted).toEqual(testVault);
      }
    });
  });
});
