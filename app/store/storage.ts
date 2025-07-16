import { type StateStorage, createJSONStorage } from 'zustand/middleware';

// Create a localStorage-powered storage object that handles SSR environments
const createSSRSafeStorage = (): StateStorage => {
  return {
    getItem: (name: string): string | null => {
      if (typeof window === 'undefined') {
        return null;
      }
      return localStorage.getItem(name);
    },
    setItem: (name: string, value: string): void => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(name, value);
      }
    },
    removeItem: (name: string): void => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(name);
      }
    },
  };
};

// Export ready-to-use storage for Zustand persist middleware
export const storage = createJSONStorage(() => createSSRSafeStorage());
