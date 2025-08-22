import { create } from 'zustand';
import { Alert } from '../types';
import { useAuthStore } from './authStore';
import { buildApiUrl, createAuthHeaders, API_ENDPOINTS } from '../config/api';

interface AlertsState {
  alerts: Alert[];
  currentAlert: Alert | null;
  isLoading: boolean;
  createAlert: (alertData: Partial<Alert>) => Promise<void>;
  getAllAlerts: () => Promise<void>;
  markAsRead: (alertId: string) => Promise<void>;
  updateAlert: (id: string, data: Partial<Alert>) => Promise<void>;
}

export const useAlertsStore = create<AlertsState>((set, get) => ({
  alerts: [],
  currentAlert: null,
  isLoading: false,

  createAlert: async (alertData) => {
    set({ isLoading: true });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(buildApiUrl(API_ENDPOINTS.ALERTS.BASE), {
        method: 'POST',
        headers: createAuthHeaders(token),
        body: JSON.stringify(alertData),
      });

      if (!response.ok) throw new Error('Failed to create alert');
      
      const newAlert = await response.json();
      set(state => ({
        alerts: [newAlert, ...state.alerts],
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  getAllAlerts: async () => {
    set({ isLoading: true });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(buildApiUrl(API_ENDPOINTS.ALERTS.BASE), {
        headers: createAuthHeaders(token),
      });

      if (!response.ok) throw new Error('Failed to fetch alerts');
      
      const data = await response.json();
      const alerts = data.alerts || data;
      set({ alerts, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error fetching alerts:', error);
    }
  },

  markAsRead: async (alertId: string) => {
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(buildApiUrl(`${API_ENDPOINTS.ALERTS.BASE}/${alertId}/read`), {
        method: 'PATCH',
        headers: createAuthHeaders(token),
      });

      if (!response.ok) throw new Error('Failed to mark alert as read');
      
      set(state => ({
        alerts: state.alerts.map(alert =>
          alert._id === alertId ? { ...alert, isRead: true } : alert
        ),
      }));
    } catch (error) {
      throw error;
    }
  },

  updateAlert: async (id: string, data: Partial<Alert>) => {
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(buildApiUrl(`${API_ENDPOINTS.ALERTS.BASE}/${id}`), {
        method: 'PATCH',
        headers: createAuthHeaders(token),
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update alert');
      
      const updatedAlert = await response.json();
      set(state => ({
        alerts: state.alerts.map(alert =>
          alert._id === id ? updatedAlert : alert
        ),
      }));
    } catch (error) {
      throw error;
    }
  },
}));