import { create } from 'zustand';
import { SymptomReport } from '../types';
import { useAuthStore } from './authStore';

const API_URL = 'http://localhost:5000/api';

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
      const response = await fetch(`${API_URL}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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
      const response = await fetch(`${API_URL}/reports/patient/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch reports');
      
      const reports = await response.json();
      set({ reports, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  getAllReports: async () => {
    set({ isLoading: true });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_URL}/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch reports');
      
      const reports = await response.json();
      set({ reports, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateReportStatus: async (reportId: string, status: SymptomReport['status']) => {
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${API_URL}/reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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