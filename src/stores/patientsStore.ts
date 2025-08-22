import { create } from 'zustand';
import { User } from '../types';
import { useAuthStore } from './authStore';
import { buildApiUrl, createAuthHeaders } from '../config/api';

interface PatientsState {
  patients: User[];
  currentPatient: User | null;
  isLoading: boolean;
  getAllPatients: () => Promise<void>;
  getPatient: (patientId: string) => Promise<void>;
}

export const usePatientsStore = create<PatientsState>((set, get) => ({
  patients: [],
  currentPatient: null,
  isLoading: false,

  getAllPatients: async () => {
    set({ isLoading: true });
    try {
      const { token } = useAuthStore.getState();
      // For now, we'll simulate getting patients from reports
      // In a real app, you'd have a dedicated patients endpoint
      const response = await fetch(buildApiUrl('/reports'), {
        headers: createAuthHeaders(token),
      });

      if (!response.ok) throw new Error('Failed to fetch patients');
      
      const data = await response.json();
      const reports = data.reports || data;
      
      // Extract unique patients from reports
      const patientsMap = new Map();
      reports.forEach((report: any) => {
        if (report.patientId && typeof report.patientId === 'object') {
          patientsMap.set(report.patientId._id, report.patientId);
        }
      });
      
      const patients = Array.from(patientsMap.values());
      set({ patients, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error fetching patients:', error);
    }
  },

  getPatient: async (patientId: string) => {
    set({ isLoading: true });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(buildApiUrl(`/reports/patient/${patientId}`), {
        headers: createAuthHeaders(token),
      });

      if (!response.ok) throw new Error('Failed to fetch patient');
      
      const reports = await response.json();
      if (reports.length > 0 && typeof reports[0].patientId === 'object') {
        set({ currentPatient: reports[0].patientId, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
      console.error('Error fetching patient:', error);
    }
  },
}));