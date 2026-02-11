import { describe, it, expect } from 'vitest';
import { cn } from '../../src/lib/utils';

describe('Utils Module', () => {
  describe('cn - className merge function', () => {
    it('should merge simple class names', () => {
      const result = cn('px-2', 'py-1');
      expect(result).toContain('px-2');
      expect(result).toContain('py-1');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn(
        'base-class',
        isActive && 'active-class'
      );
      expect(result).toContain('base-class');
      expect(result).toContain('active-class');
    });

    it('should exclude falsy conditional classes', () => {
      const isActive = false;
      const result = cn(
        'base-class',
        isActive && 'active-class'
      );
      expect(result).toContain('base-class');
      expect(result).not.toContain('active-class');
    });

    it('should handle object notation', () => {
      const result = cn({
        'px-2': true,
        'py-1': true,
        'hidden': false,
      });
      expect(result).toContain('px-2');
      expect(result).toContain('py-1');
      expect(result).not.toContain('hidden');
    });

    it('should merge Tailwind classes correctly (avoiding conflicts)', () => {
      // Test that later padding values override earlier ones
      const result = cn('px-2', 'px-4');
      expect(result).toContain('px-4');
      // The implementation should use tailwind-merge to handle this
    });

    it('should handle array of classes', () => {
      const result = cn(['px-2', 'py-1']);
      expect(result).toContain('px-2');
      expect(result).toContain('py-1');
    });

    it('should handle mixed input types', () => {
      const isActive = true;
      const result = cn(
        'base',
        isActive && 'active',
        { 'hidden': false, 'visible': true },
        ['px-2', 'py-1']
      );
      expect(result).toContain('base');
      expect(result).toContain('active');
      expect(result).toContain('visible');
      expect(result).toContain('px-2');
      expect(result).not.toContain('hidden');
    });

    it('should return empty string for empty input', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle undefined and null values', () => {
      const result = cn(
        'px-2',
        undefined,
        'py-1',
        null
      );
      expect(result).toContain('px-2');
      expect(result).toContain('py-1');
    });

    it('should handle empty strings', () => {
      const result = cn('px-2', '', 'py-1');
      expect(result).toContain('px-2');
      expect(result).toContain('py-1');
    });

    it('should work with complex Tailwind utilities', () => {
      const result = cn(
        'flex items-center justify-between',
        'bg-white dark:bg-slate-900',
        'px-4 py-2 rounded-lg',
        'shadow-md hover:shadow-lg',
        'transition-shadow duration-200'
      );
      expect(result).toContain('flex');
      expect(result).toContain('items-center');
      expect(result).toContain('justify-between');
      expect(result).toContain('bg-white');
      expect(result).toContain('dark:bg-slate-900');
    });

    it('should handle responsive classes', () => {
      const result = cn(
        'px-2 sm:px-4 md:px-6 lg:px-8',
        'py-1 sm:py-2 md:py-3'
      );
      expect(result).toContain('px-2');
      expect(result).toContain('sm:px-4');
      expect(result).toContain('md:px-6');
    });

    it('should handle pseudo-classes', () => {
      const result = cn(
        'bg-blue-500 hover:bg-blue-600',
        'text-white focus:outline-none'
      );
      expect(result).toContain('bg-blue-500');
      expect(result).toContain('hover:bg-blue-600');
      expect(result).toContain('focus:outline-none');
    });

    it('should preserve whitelisted classes', () => {
      const result = cn(
        'w-full',
        'max-w-md',
        'h-auto',
        'min-h-screen'
      );
      expect(result).toContain('w-full');
      expect(result).toContain('max-w-md');
      expect(result).toContain('h-auto');
    });

    it('should handle ternary operators for conditional classes', () => {
      const variant = 'primary' as const;
      const result = cn(
        'btn',
        variant === 'primary' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
      );
      expect(result).toContain('btn');
      expect(result).toContain('bg-blue-600');
      expect(result).toContain('text-white');
    });

    it('should be consistent across multiple calls', () => {
      const classes = ['px-2', 'py-1', 'bg-white'];
      const result1 = cn(...classes);
      const result2 = cn(...classes);
      expect(result1).toBe(result2);
    });

    it('should handle special characters in custom classes', () => {
      const result = cn(
        'data-[state=open]:flex',
        'aria-disabled:opacity-50'
      );
      expect(result).toContain('data-[state=open]:flex');
      expect(result).toContain('aria-disabled:opacity-50');
    });
  });
});
