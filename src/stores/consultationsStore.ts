import { create } from 'zustand';
import { Consultation } from '../types';
import { useAuthStore } from './authStore';
import { buildApiUrl, createAuthHeaders, API_ENDPOINTS } from '../config/api';

interface ConsultationsState {
  consultations: Consultation[];
  currentConsultation: Consultation | null;
  isLoading: boolean;
  createConsultation: (consultationData: Partial<Consultation>) => Promise<void>;
  getUserConsultations: () => Promise<void>;
  updateConsultation: (id: string, data: Partial<Consultation>) => Promise<void>;
}

export const useConsultationsStore = create<ConsultationsState>((set, get) => ({
  consultations: [],
  currentConsultation: null,
  isLoading: false,

  createConsultation: async (consultationData) => {
    set({ isLoading: true });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(buildApiUrl(API_ENDPOINTS.CONSULTATIONS.BASE), {
        method: 'POST',
        headers: createAuthHeaders(token),
        body: JSON.stringify(consultationData),
      });

      if (!response.ok) throw new Error('Failed to create consultation');
      
      const newConsultation = await response.json();
      set(state => ({
        consultations: [newConsultation, ...state.consultations],
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  getUserConsultations: async () => {
    set({ isLoading: true });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(buildApiUrl(API_ENDPOINTS.CONSULTATIONS.BASE), {
        headers: createAuthHeaders(token),
      });

      if (!response.ok) throw new Error('Failed to fetch consultations');
      
      const data = await response.json();
      const consultations = data.consultations || data;
      set({ consultations, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error fetching consultations:', error);
    }
  },

  updateConsultation: async (id: string, data: Partial<Consultation>) => {
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(buildApiUrl(`${API_ENDPOINTS.CONSULTATIONS.BASE}/${id}`), {
        method: 'PATCH',
        headers: createAuthHeaders(token),
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update consultation');
      
      const updatedConsultation = await response.json();
      set(state => ({
        consultations: state.consultations.map(consultation =>
          consultation._id === id ? updatedConsultation : consultation
        ),
      }));
    } catch (error) {
      throw error;
    }
  },
}));