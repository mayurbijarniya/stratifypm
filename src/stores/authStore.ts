import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  email: string;
  createdAt: Date | string;
}

interface AuthState {
  status: 'idle' | 'checking' | 'authenticated' | 'unauthenticated';
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string | null, user: AuthUser) => void;
  setStatus: (status: AuthState['status']) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      status: 'idle',
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user, status: 'authenticated' }),
      setStatus: (status) => set({ status }),
      clearAuth: () => set({ token: null, user: null, status: 'unauthenticated' }),
    }),
    {
      name: 'pm-ai-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
