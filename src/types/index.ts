export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'patient' | 'doctor';
  phone?: string;
  specialization?: string; // for doctors
  dateOfBirth?: string; // for patients
  gender?: 'male' | 'female' | 'other'; // for patients
  createdAt: string;
  updatedAt: string;
}

export interface SymptomReport {
  _id: string;
  patientId: string;
  symptoms: string[];
  description: string;
  audioTranscript?: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  status: 'pending' | 'reviewed' | 'consultation_requested';
  createdAt: string;
  updatedAt: string;
}

export interface Consultation {
  _id: string;
  patientId: string;
  doctorId: string;
  reportId?: string;
  scheduledAt: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  type: 'video' | 'audio' | 'chat';
  notes?: string;
  prescription?: string;
  followUp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabResult {
  _id: string;
  patientId: string;
  testName: string;
  testDate: string;
  results: string;
  doctorNotes?: string;
  fileUrl?: string;
  normalRange?: string;
  status: 'normal' | 'abnormal' | 'critical';
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  _id: string;
  type: 'outbreak' | 'appointment' | 'lab_result' | 'system';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  targetUsers: string[];
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'patient' | 'doctor';
  phone?: string;
  specialization?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}