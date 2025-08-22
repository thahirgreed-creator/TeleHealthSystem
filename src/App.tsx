import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Components
import Layout from './components/Layout/Layout';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import ProtectedRoute from './components/ProtectedRoute';
import PatientDashboard from './components/Patient/PatientDashboard';
import DoctorDashboard from './components/Doctor/DoctorDashboard';
import SymptomRecorder from './components/Patient/SymptomRecorder';
import ConsultationsList from './components/Patient/ConsultationsList';
import MedicalHistory from './components/Patient/MedicalHistory';
import LabResults from './components/Patient/LabResults';
import PatientsList from './components/Doctor/PatientsList';
import ReportsList from './components/Doctor/ReportsList';
import OutbreakAlerts from './components/Doctor/OutbreakAlerts';
import NotificationCenter from './components/Shared/NotificationCenter';

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } 
        />
        
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route 
            path="dashboard" 
            element={
              user?.role === 'patient' ? <PatientDashboard /> : <DoctorDashboard />
            } 
          />
          
          {/* Patient Routes */}
          <Route path="symptoms" element={
            <ProtectedRoute requiredRole="patient">
              <SymptomRecorder />
            </ProtectedRoute>
          } />
          
          <Route path="consultations" element={
            <ProtectedRoute requiredRole="patient">
              <ConsultationsList />
            </ProtectedRoute>
          } />
          
          <Route path="history" element={
            <ProtectedRoute requiredRole="patient">
              <MedicalHistory />
            </ProtectedRoute>
          } />
          
          <Route path="lab-results" element={
            <ProtectedRoute requiredRole="patient">
              <LabResults />
            </ProtectedRoute>
          } />
          
          {/* Doctor Routes */}
          <Route path="patients" element={
            <ProtectedRoute requiredRole="doctor">
              <PatientsList />
            </ProtectedRoute>
          } />
          
          <Route path="reports" element={
            <ProtectedRoute requiredRole="doctor">
              <ReportsList />
            </ProtectedRoute>
          } />
          
          <Route path="alerts" element={
            <ProtectedRoute requiredRole="doctor">
              <OutbreakAlerts />
            </ProtectedRoute>
          } />
          
          {/* Shared Routes */}
          <Route path="notifications" element={
            <ProtectedRoute>
              <NotificationCenter />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;