import React, { useEffect } from 'react';
import { Users, ClipboardList, Calendar, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useReportsStore } from '../../stores/reportsStore';
import { useConsultationsStore } from '../../stores/consultationsStore';
import { format } from 'date-fns';

const DoctorDashboard = () => {
  const { user } = useAuthStore();
  const { reports, getAllReports } = useReportsStore();
  const { consultations, getUserConsultations } = useConsultationsStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllReports();
        await getUserConsultations();
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, [getAllReports, getUserConsultations]);

  const pendingReports = reports.filter(r => r.status === 'pending');
  const todayConsultations = consultations.filter(c => 
    format(new Date(c.scheduledAt), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const stats = [
    {
      title: 'Pending Reports',
      value: pendingReports.length,
      icon: ClipboardList,
      color: 'bg-blue-500',
    },
    {
      title: 'Today\'s Consultations',
      value: todayConsultations.length,
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      title: 'Active Patients',
      value: 45, // Placeholder
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Outbreak Alerts',
      value: 3, // Placeholder
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-white p-6">
        <h1 className="text-2xl font-bold mb-2">
          Good morning, Dr. {user?.lastName}!
        </h1>
        <p className="text-green-100">
          Ready to help your patients today. Here's your practice overview.
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
        {/* Urgent Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Urgent Reports</h2>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {pendingReports.filter(r => r.severity === 'severe').length} Critical
              </span>
            </div>
          </div>
          <div className="p-6">
            {pendingReports.length > 0 ? (
              <div className="space-y-4">
                {pendingReports.slice(0, 4).map((report) => (
                  <div key={report._id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      report.severity === 'severe' ? 'bg-red-100' :
                      report.severity === 'moderate' ? 'bg-orange-100' : 'bg-green-100'
                    }`}>
                      <Activity className={`w-4 h-4 ${
                        report.severity === 'severe' ? 'text-red-600' :
                        report.severity === 'moderate' ? 'text-orange-600' : 'text-green-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Patient #{typeof report.patientId === 'string' ? report.patientId.slice(-4) : 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {report.symptoms.slice(0, 2).join(', ')}
                        {report.symptoms.length > 2 && ` +${report.symptoms.length - 2} more`}
                      </p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          report.severity === 'severe' ? 'bg-red-100 text-red-800' :
                          report.severity === 'moderate' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {report.severity}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(report.createdAt), 'MMM dd, HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No pending reports</p>
                <p className="text-sm text-gray-400">All reports have been reviewed</p>
              </div>
            )}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
          </div>
          <div className="p-6">
            {todayConsultations.length > 0 ? (
              <div className="space-y-4">
                {todayConsultations.slice(0, 4).map((consultation) => (
                  <div key={consultation._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Patient #{typeof consultation.patientId === 'string' ? consultation.patientId.slice(-4) : 'Unknown'}
                      </p>
                      <div className="flex items-center mt-1 space-x-4">
                        <span className="text-xs text-gray-500">
                          {format(new Date(consultation.scheduledAt), 'HH:mm')}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          consultation.type === 'video' ? 'bg-green-100 text-green-800' :
                          consultation.type === 'audio' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {consultation.type}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          consultation.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                          consultation.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {consultation.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No consultations today</p>
                <p className="text-sm text-gray-400">Enjoy your free day!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
            <ClipboardList className="w-5 h-5 mr-2" />
            Review Reports
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-green-300 rounded-lg text-green-600 hover:bg-green-50 transition-colors">
            <Calendar className="w-5 h-5 mr-2" />
            View Schedule
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors">
            <Users className="w-5 h-5 mr-2" />
            Patient Records
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Outbreak Alerts
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;