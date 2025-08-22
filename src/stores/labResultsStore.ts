import { create } from 'zustand';
import { LabResult } from '../types';
import { useAuthStore } from './authStore';
import { buildApiUrl, createAuthHeaders, API_ENDPOINTS } from '../config/api';

interface LabResultsState {
  labResults: LabResult[];
  currentLabResult: LabResult | null;
  isLoading: boolean;
  createLabResult: (labResultData: Partial<LabResult>) => Promise<void>;
  getUserLabResults: () => Promise<void>;
  getAllLabResults: () => Promise<void>;
  updateLabResult: (id: string, data: Partial<LabResult>) => Promise<void>;
}

export const useLabResultsStore = create<LabResultsState>((set, get) => ({
  labResults: [],
  currentLabResult: null,
  isLoading: false,

  createLabResult: async (labResultData) => {
    set({ isLoading: true });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(buildApiUrl(API_ENDPOINTS.LAB_RESULTS.BASE), {
        method: 'POST',
        headers: createAuthHeaders(token),
        body: JSON.stringify(labResultData),
      });

      if (!response.ok) throw new Error('Failed to create lab result');
      
      const newLabResult = await response.json();
      set(state => ({
        labResults: [newLabResult, ...state.labResults],
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  getUserLabResults: async () => {
    set({ isLoading: true });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(buildApiUrl(API_ENDPOINTS.LAB_RESULTS.BASE), {
        headers: createAuthHeaders(token),
      });

      if (!response.ok) throw new Error('Failed to fetch lab results');
      
      const data = await response.json();
      const labResults = data.labResults || data;
      set({ labResults, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error fetching lab results:', error);
    }
  },

  getAllLabResults: async () => {
    set({ isLoading: true });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(buildApiUrl(API_ENDPOINTS.LAB_RESULTS.BASE), {
        headers: createAuthHeaders(token),
      });

      if (!response.ok) throw new Error('Failed to fetch lab results');
      
      const data = await response.json();
      const labResults = data.labResults || data;
      set({ labResults, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error fetching all lab results:', error);
    }
  },

  updateLabResult: async (id: string, data: Partial<LabResult>) => {
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(buildApiUrl(`${API_ENDPOINTS.LAB_RESULTS.BASE}/${id}`), {
        method: 'PATCH',
        headers: createAuthHeaders(token),
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update lab result');
      
      const updatedLabResult = await response.json();
      set(state => ({
        labResults: state.labResults.map(labResult =>
          labResult._id === id ? updatedLabResult : labResult
        ),
      }));
    } catch (error) {
      throw error;
    }
  },
}));