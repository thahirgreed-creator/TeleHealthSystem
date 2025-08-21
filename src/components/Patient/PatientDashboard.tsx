import React, { useEffect } from 'react';
import { Calendar, FileText, AlertCircle, Clock, Thermometer, Heart } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useReportsStore } from '../../stores/reportsStore';
import { useConsultationsStore } from '../../stores/consultationsStore';
import { format } from 'date-fns';

const PatientDashboard = () => {
  const { user } = useAuthStore();
  const { reports, getPatientReports } = useReportsStore();
  const { consultations, getUserConsultations } = useConsultationsStore();

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          await getPatientReports(user._id);
          await getUserConsultations();
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      };
      fetchData();
    }
  }, [user, getPatientReports, getUserConsultations]);

  const recentReports = reports.slice(0, 3);
  const upcomingConsultations = consultations
    .filter(c => c.status === 'scheduled')
    .slice(0, 3);

  const stats = [
    {
      title: 'Active Reports',
      value: reports.filter(r => r.status === 'pending').length,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Upcoming Consultations',
      value: upcomingConsultations.length,
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      title: 'Health Alerts',
      value: 2, // Placeholder
      icon: AlertCircle,
      color: 'bg-orange-500',
    },
    {
      title: 'Lab Results',
      value: 4, // Placeholder
      icon: Heart,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white p-6">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-blue-100">
          Your health journey continues. Here's your latest health overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Symptom Reports</h2>
          </div>
          <div className="p-6">
            {recentReports.length > 0 ? (
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report._id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-lg ${
                      report.severity === 'severe' ? 'bg-red-100' :
                      report.severity === 'moderate' ? 'bg-orange-100' : 'bg-green-100'
                    }`}>
                      <Thermometer className={`w-4 h-4 ${
                        report.severity === 'severe' ? 'text-red-600' :
                        report.severity === 'moderate' ? 'text-orange-600' : 'text-green-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {report.symptoms.slice(0, 2).join(', ')}
                        {report.symptoms.length > 2 && ` +${report.symptoms.length - 2} more`}
                      </p>
                      <div className="flex items-center mt-1 space-x-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          report.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {report.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(report.createdAt), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No symptom reports yet</p>
                <p className="text-sm text-gray-400">Start by reporting your symptoms</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Consultations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Consultations</h2>
          </div>
          <div className="p-6">
            {upcomingConsultations.length > 0 ? (
              <div className="space-y-4">
                {upcomingConsultations.map((consultation) => (
                  <div key={consultation._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Dr. {typeof consultation.doctorId === 'string' ? consultation.doctorId.slice(-4) : 'Unknown'}
                      </p>
                      <div className="flex items-center mt-1 space-x-4">
                        <span className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {format(new Date(consultation.scheduledAt), 'MMM dd, yyyy HH:mm')}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          consultation.type === 'video' ? 'bg-green-100 text-green-800' :
                          consultation.type === 'audio' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {consultation.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No upcoming consultations</p>
                <p className="text-sm text-gray-400">Schedule a consultation with a doctor</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
            <Thermometer className="w-5 h-5 mr-2" />
            Report Symptoms
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-green-300 rounded-lg text-green-600 hover:bg-green-50 transition-colors">
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Consultation
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors">
            <FileText className="w-5 h-5 mr-2" />
            View Lab Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;