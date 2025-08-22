import React, { useEffect } from 'react';
import { Bell, AlertTriangle, Calendar, TestTube, CheckCircle, X } from 'lucide-react';
import { useAlertsStore } from '../../stores/alertsStore';
import { useAuthStore } from '../../stores/authStore';
import { format } from 'date-fns';

const NotificationCenter = () => {
  const { user } = useAuthStore();
  const { alerts, getAllAlerts, markAsRead, isLoading } = useAlertsStore();

  useEffect(() => {
    getAllAlerts();
  }, [getAllAlerts]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'outbreak':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'appointment':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'lab_result':
        return <TestTube className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string, severity?: string) => {
    if (type === 'outbreak') {
      switch (severity) {
        case 'critical':
          return 'border-l-red-500 bg-red-50';
        case 'high':
          return 'border-l-orange-500 bg-orange-50';
        default:
          return 'border-l-yellow-500 bg-yellow-50';
      }
    }
    switch (type) {
      case 'appointment':
        return 'border-l-blue-500 bg-blue-50';
      case 'lab_result':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await markAsRead(alertId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  const readAlerts = alerts.filter(alert => alert.isRead);

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
        <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
        <div className="flex items-center space-x-2">
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {unreadAlerts.length} unread
          </span>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
          <p className="text-gray-600">
            You're all caught up! New notifications will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Unread Notifications */}
          {unreadAlerts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Unread ({unreadAlerts.length})</h3>
              <div className="space-y-2">
                {unreadAlerts.map((alert) => (
                  <div
                    key={alert._id}
                    className={`bg-white rounded-lg shadow-sm border-l-4 p-4 ${getNotificationColor(alert.type, alert.severity)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(alert.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-semibold text-gray-900">{alert.title}</h4>
                            {alert.severity && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                                alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                                alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {alert.severity}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(alert.createdAt), 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <button
                          onClick={() => handleMarkAsRead(alert._id)}
                          className="p-1 text-green-600 hover:text-green-800 transition-colors"
                          title="Mark as read"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Read Notifications */}
          {readAlerts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Earlier ({readAlerts.length})
              </h3>
              <div className="space-y-2">
                {readAlerts.slice(0, 10).map((alert) => (
                  <div
                    key={alert._id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 opacity-75"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1 opacity-60">
                        {getNotificationIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-700">{alert.title}</h4>
                          {alert.severity && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              {alert.severity}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{alert.message}</p>
                        <p className="text-xs text-gray-400">
                          {format(new Date(alert.createdAt), 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Outbreak Alerts</p>
              <p className="text-xs text-gray-500">Get notified about health outbreaks in your area</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Appointment Reminders</p>
              <p className="text-xs text-gray-500">Receive reminders about upcoming consultations</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Lab Results</p>
              <p className="text-xs text-gray-500">Get notified when new lab results are available</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;