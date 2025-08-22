import React, { useEffect } from 'react';
import { FileText, Calendar, User, Activity } from 'lucide-react';
import { useReportsStore } from '../../stores/reportsStore';
import { useConsultationsStore } from '../../stores/consultationsStore';
import { useAuthStore } from '../../stores/authStore';
import { format } from 'date-fns';

const MedicalHistory = () => {
  const { user } = useAuthStore();
  const { reports, getPatientReports, isLoading: reportsLoading } = useReportsStore();
  const { consultations, getUserConsultations, isLoading: consultationsLoading } = useConsultationsStore();

  useEffect(() => {
    if (user) {
      getPatientReports(user._id);
      getUserConsultations();
    }
  }, [user, getPatientReports, getUserConsultations]);

  const completedConsultations = consultations.filter(c => c.status === 'completed');

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

  if (reportsLoading || consultationsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Medical History</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Symptom Reports History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Symptom Reports
            </h3>
          </div>
          <div className="p-6">
            {reports.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No symptom reports yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.slice(0, 5).map((report) => (
                  <div key={report._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {report.symptoms.slice(0, 2).join(', ')}
                          {report.symptoms.length > 2 && ` +${report.symptoms.length - 2} more`}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {format(new Date(report.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                        {report.severity}
                      </span>
                    </div>
                    
                    {report.description && (
                      <p className="text-sm text-gray-700 mb-2">{report.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        report.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {report.status.replace('_', ' ')}
                      </span>
                      
                      {report.reviewNotes && (
                        <button className="text-xs text-blue-600 hover:text-blue-800">
                          View Doctor Notes
                        </button>
                      )}
                    </div>

                    {report.reviewNotes && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800 font-medium">Doctor's Notes:</p>
                        <p className="text-sm text-blue-700 mt-1">{report.reviewNotes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Consultation History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              Consultation History
            </h3>
          </div>
          <div className="p-6">
            {completedConsultations.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No completed consultations yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedConsultations.slice(0, 5).map((consultation) => (
                  <div key={consultation._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {typeof consultation.doctorId === 'object' 
                              ? `Dr. ${consultation.doctorId.firstName} ${consultation.doctorId.lastName}`
                              : 'Doctor'
                            }
                          </p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(consultation.scheduledAt), 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Completed
                      </span>
                    </div>

                    {consultation.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{consultation.notes}</p>
                      </div>
                    )}

                    {consultation.prescription && consultation.prescription.medications.length > 0 && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800 font-medium">Prescription:</p>
                        <ul className="text-sm text-green-700 mt-1 space-y-1">
                          {consultation.prescription.medications.map((med, index) => (
                            <li key={index}>
                              {med.name} - {med.dosage} ({med.frequency})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Health Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-purple-600" />
          Health Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">Total Reports</p>
            <p className="text-2xl font-bold text-blue-900">{reports.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Consultations</p>
            <p className="text-2xl font-bold text-green-900">{completedConsultations.length}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-600 font-medium">Last Visit</p>
            <p className="text-sm font-medium text-purple-900">
              {completedConsultations.length > 0 
                ? format(new Date(completedConsultations[0].scheduledAt), 'MMM dd, yyyy')
                : 'No visits yet'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;