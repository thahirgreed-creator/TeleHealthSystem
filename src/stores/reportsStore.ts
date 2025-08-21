import { create } from 'zustand';
import { SymptomReport } from '../types';
import { useAuthStore } from './authStore';
import { buildApiUrl, createAuthHeaders, API_ENDPOINTS } from '../config/api';

interface ReportsState {
  reports: SymptomReport[];
  currentReport: SymptomReport | null;
  isLoading: boolean;
  createReport: (reportData: Partial<SymptomReport>) => Promise<void>;
  getPatientReports: (patientId: string) => Promise<void>;
  getAllReports: () => Promise<void>;
  updateReportStatus: (reportId: string, status: SymptomReport['status']) => Promise<void>;
}

export const useReportsStore = create<ReportsState>((set, get) => ({
  reports: [],
  currentReport: null,
  isLoading: false,

  createReport: async (reportData) => {
    set({ isLoading: true });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(buildApiUrl(API_ENDPOINTS.REPORTS.BASE), {
        method: 'POST',
        headers: createAuthHeaders(token),
        body: JSON.stringify(reportData),
      });

      if (!response.ok) throw new Error('Failed to create report');
      
      const newReport = await response.json();
      set(state => ({
        reports: [newReport, ...state.reports],
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  getPatientReports: async (patientId: string) => {
    set({ isLoading: true });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(buildApiUrl(API_ENDPOINTS.REPORTS.PATIENT(patientId)), {
        headers: createAuthHeaders(token),
      });

      if (!response.ok) throw new Error('Failed to fetch reports');
      
      const reports = await response.json();
      set({ reports, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error fetching patient reports:', error);
    }
  },

  getAllReports: async () => {
    set({ isLoading: true });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(buildApiUrl(API_ENDPOINTS.REPORTS.BASE), {
        headers: createAuthHeaders(token),
      });

      if (!response.ok) throw new Error('Failed to fetch reports');
      
      const data = await response.json();
      const reports = data.reports || data;
      set({ reports, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error fetching all reports:', error);
    }
  },

  updateReportStatus: async (reportId: string, status: SymptomReport['status']) => {
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(buildApiUrl(`${API_ENDPOINTS.REPORTS.BASE}/${reportId}`), {
        method: 'PATCH',
        headers: createAuthHeaders(token),
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update report');
      
      const updatedReport = await response.json();
      set(state => ({
        reports: state.reports.map(report =>
          report._id === reportId ? updatedReport : report
        ),
      }));
    } catch (error) {
      throw error;
    }
  },
}));