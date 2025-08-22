import React, { useEffect } from 'react';
import { Calendar, Clock, Video, Phone, MessageCircle, User } from 'lucide-react';
import { useConsultationsStore } from '../../stores/consultationsStore';
import { format } from 'date-fns';

const ConsultationsList = () => {
  const { consultations, getUserConsultations, isLoading } = useConsultationsStore();

  useEffect(() => {
    getUserConsultations();
  }, [getUserConsultations]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'audio':
        return <Phone className="w-4 h-4" />;
      case 'chat':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
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
        <h2 className="text-2xl font-bold text-gray-900">My Consultations</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Request Consultation
        </button>
      </div>

      {consultations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Consultations Yet</h3>
          <p className="text-gray-600 mb-4">
            You haven't scheduled any consultations yet. Request one to get started.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Request First Consultation
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {consultations.map((consultation) => (
            <div key={consultation._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    {getTypeIcon(consultation.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {typeof consultation.doctorId === 'object' 
                          ? `Dr. ${consultation.doctorId.firstName} ${consultation.doctorId.lastName}`
                          : 'Doctor'
                        }
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                        {consultation.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    {typeof consultation.doctorId === 'object' && consultation.doctorId.specialization && (
                      <p className="text-sm text-gray-600 mb-2">
                        {consultation.doctorId.specialization}
                      </p>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {format(new Date(consultation.scheduledAt), 'MMM dd, yyyy HH:mm')}
                      </div>
                      <div className="flex items-center capitalize">
                        {getTypeIcon(consultation.type)}
                        <span className="ml-1">{consultation.type}</span>
                      </div>
                    </div>

                    {consultation.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{consultation.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {consultation.status === 'scheduled' && (
                    <>
                      <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                        Join
                      </button>
                      <button className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                        Reschedule
                      </button>
                    </>
                  )}
                  {consultation.status === 'completed' && (
                    <button className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultationsList;