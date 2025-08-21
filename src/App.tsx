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
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Consultations</h2>
                <p className="text-gray-600">Patient consultations view - Coming soon</p>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="history" element={
            <ProtectedRoute requiredRole="patient">
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Medical History</h2>
                <p className="text-gray-600">Medical history view - Coming soon</p>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="lab-results" element={
            <ProtectedRoute requiredRole="patient">
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Lab Results</h2>
                <p className="text-gray-600">Lab results view - Coming soon</p>
              </div>
            </ProtectedRoute>
          } />
          
          {/* Doctor Routes */}
          <Route path="patients" element={
            <ProtectedRoute requiredRole="doctor">
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Patients</h2>
                <p className="text-gray-600">Patient management view - Coming soon</p>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="reports" element={
            <ProtectedRoute requiredRole="doctor">
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Symptom Reports</h2>
                <p className="text-gray-600">Symptom reports review - Coming soon</p>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="alerts" element={
            <ProtectedRoute requiredRole="doctor">
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Outbreak Alerts</h2>
                <p className="text-gray-600">Outbreak monitoring - Coming soon</p>
              </div>
            </ProtectedRoute>
          } />
          
          {/* Shared Routes */}
          <Route path="notifications" element={
            <ProtectedRoute>
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Notifications</h2>
                <p className="text-gray-600">Notification center - Coming soon</p>
              </div>
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;