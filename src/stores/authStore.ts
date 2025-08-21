import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, RegisterData } from '../types';
import { buildApiUrl, createAuthHeaders, API_ENDPOINTS } from '../config/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await fetch(buildApiUrl(API_ENDPOINTS.AUTH.LOGIN), {
            method: 'POST',
            headers: createAuthHeaders(null),
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Login failed');
          }

          set({ user: data.user, token: data.token, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true });
        try {
          const response = await fetch(buildApiUrl(API_ENDPOINTS.AUTH.REGISTER), {
            method: 'POST',
            headers: createAuthHeaders(null),
            body: JSON.stringify(userData),
          });

          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
          }

          set({ user: data.user, token: data.token, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);