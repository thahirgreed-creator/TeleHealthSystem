import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Mic, 
  Calendar, 
  FileText, 
  TestTube, 
  Bell,
  Users,
  ClipboardList,
  Video,
  AlertTriangle,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const patientNavItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/symptoms', icon: Mic, label: 'Report Symptoms' },
    { path: '/consultations', icon: Calendar, label: 'Consultations' },
    { path: '/history', icon: FileText, label: 'Medical History' },
    { path: '/lab-results', icon: TestTube, label: 'Lab Results' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
  ];

  const doctorNavItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/patients', icon: Users, label: 'Patients' },
    { path: '/reports', icon: ClipboardList, label: 'Symptom Reports' },
    { path: '/consultations', icon: Video, label: 'Consultations' },
    { path: '/alerts', icon: AlertTriangle, label: 'Outbreak Alerts' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
  ];

  const navItems = user?.role === 'patient' ? patientNavItems : doctorNavItems;

  return (
    <div className="bg-white h-full border-r border-gray-200 w-64 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">TeleHealth</h1>
        <p className="text-sm text-gray-600 mt-1">
          {user?.role === 'patient' ? 'Patient Portal' : 'Doctor Portal'}
        </p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;