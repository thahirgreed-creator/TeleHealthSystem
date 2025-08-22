import React, { useEffect, useState } from 'react';
import { ClipboardList, Search, Filter, Eye, User, Calendar, Activity } from 'lucide-react';
import { useReportsStore } from '../../stores/reportsStore';
import { format } from 'date-fns';

const ReportsList = () => {
  const { reports, getAllReports, updateReportStatus, isLoading } = useReportsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    getAllReports();
  }, [getAllReports]);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.symptoms.some(symptom => 
      symptom.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || report.severity === filterSeverity;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe':
        return 'bg-red-100 text-red-800';
      case 'moderate':
        return 'bg-orange-100 text-orange-800';
      case 'mild':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'consultation_requested':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (reportId: string, newStatus: string) => {
    try {
      await updateReportStatus(reportId, newStatus as any);
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Symptom Reports</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="consultation_requested">Consultation Requested</option>
          </select>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Severity</option>
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all' || filterSeverity !== 'all' 
              ? 'No reports match your current filters.' 
              : 'No symptom reports have been submitted yet.'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredReports.map((report) => (
            <div key={report._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`p-3 rounded-lg ${
                    report.severity === 'severe' ? 'bg-red-100' :
                    report.severity === 'moderate' ? 'bg-orange-100' : 'bg-green-100'
                  }`}>
                    <Activity className={`w-5 h-5 ${
                      report.severity === 'severe' ? 'text-red-600' :
                      report.severity === 'moderate' ? 'text-orange-600' : 'text-green-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {report.symptoms.slice(0, 3).join(', ')}
                        {report.symptoms.length > 3 && ` +${report.symptoms.length - 3} more`}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                        {report.severity}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {typeof report.patientId === 'object' 
                          ? `${report.patientId.firstName} ${report.patientId.lastName}`
                          : `Patient #${report.patientId.slice(-6)}`
                        }
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(report.createdAt), 'MMM dd, yyyy HH:mm')}
                      </div>
                      <div>Duration: {report.duration}</div>
                    </div>

                    {report.description && (
                      <p className="text-sm text-gray-700 mb-3 bg-gray-50 p-3 rounded-lg">
                        {report.description}
                      </p>
                    )}

                    {report.audioTranscript && (
                      <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800 font-medium">Audio Transcript:</p>
                        <p className="text-sm text-blue-700 mt-1">{report.audioTranscript}</p>
                      </div>
                    )}

                    {report.reviewNotes && (
                      <div className="mb-3 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800 font-medium">Review Notes:</p>
                        <p className="text-sm text-green-700 mt-1">{report.reviewNotes}</p>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      {report.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(report._id, 'reviewed')}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Mark Reviewed
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(report._id, 'consultation_requested')}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          >
                            Request Consultation
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors flex items-center"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reports Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <ClipboardList className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Severe Cases</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.severity === 'severe').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => 
                  format(new Date(r.createdAt), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                ).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsList;