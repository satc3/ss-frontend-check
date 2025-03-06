import '@testing-library/jest-dom';
import { vi } from 'vitest';

// モジュール拡張を使用して型定義を拡張
declare module 'vitest' {
  interface Assertion {
    toBeInTheDocument(): void;
    toHaveClass(className: string): void;
    toBeDisabled(): void;
  }
  
  interface AsymmetricMatchersContaining {
    toBeInTheDocument(): void;
    toHaveClass(className: string): void;
    toBeDisabled(): void;
  }
}

// localstorage のモック
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(() => null),
    removeItem: vi.fn(() => null),
    clear: vi.fn(() => null),
  },
  writable: true
});

// matchMedia のモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
}); 