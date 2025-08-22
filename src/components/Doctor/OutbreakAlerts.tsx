import React, { useEffect, useState } from 'react';
import { AlertTriangle, MapPin, Users, Calendar, Plus, Eye } from 'lucide-react';
import { useAlertsStore } from '../../stores/alertsStore';
import { format } from 'date-fns';

const OutbreakAlerts = () => {
  const { alerts, getAllAlerts, createAlert, isLoading } = useAlertsStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    type: 'outbreak',
    title: '',
    message: '',
    severity: 'medium',
    targetRoles: ['patient'],
    geographicArea: {
      region: '',
      city: '',
    }
  });

  useEffect(() => {
    getAllAlerts();
  }, [getAllAlerts]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    return <AlertTriangle className={`w-5 h-5 ${
      severity === 'critical' ? 'text-red-600' :
      severity === 'high' ? 'text-orange-600' :
      severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
    }`} />;
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAlert(newAlert);
      setShowCreateForm(false);
      setNewAlert({
        type: 'outbreak',
        title: '',
        message: '',
        severity: 'medium',
        targetRoles: ['patient'],
        geographicArea: {
          region: '',
          city: '',
        }
      });
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  const outbreakAlerts = alerts.filter(alert => alert.type === 'outbreak');

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
        <h2 className="text-2xl font-bold text-gray-900">Outbreak Alerts</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Alert
        </button>
      </div>

      {/* Create Alert Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Outbreak Alert</h3>
          <form onSubmit={handleCreateAlert} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alert Title *
                </label>
                <input
                  type="text"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Flu Outbreak in Downtown Area"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity Level *
                </label>
                <select
                  value={newAlert.severity}
                  onChange={(e) => setNewAlert({...newAlert, severity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alert Message *
              </label>
              <textarea
                value={newAlert.message}
                onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Describe the outbreak, symptoms to watch for, and recommended actions..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region
                </label>
                <input
                  type="text"
                  value={newAlert.geographicArea.region}
                  onChange={(e) => setNewAlert({
                    ...newAlert, 
                    geographicArea: {...newAlert.geographicArea, region: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Northern Province"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City/Area
                </label>
                <input
                  type="text"
                  value={newAlert.geographicArea.city}
                  onChange={(e) => setNewAlert({
                    ...newAlert, 
                    geographicArea: {...newAlert.geographicArea, city: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Downtown District"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Create Alert
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Alerts */}
      {outbreakAlerts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Outbreak Alerts</h3>
          <p className="text-gray-600 mb-4">
            No outbreak alerts are currently active. Create one if you detect concerning patterns.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Create First Alert
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {outbreakAlerts.map((alert) => (
            <div key={alert._id} className={`bg-white rounded-xl shadow-sm border-2 p-6 ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`p-3 rounded-lg ${
                    alert.severity === 'critical' ? 'bg-red-100' :
                    alert.severity === 'high' ? 'bg-orange-100' :
                    alert.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    {getSeverityIcon(alert.severity)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{alert.message}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(alert.createdAt), 'MMM dd, yyyy HH:mm')}
                      </div>
                      {alert.geographicArea && (alert.geographicArea.region || alert.geographicArea.city) && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {[alert.geographicArea.city, alert.geographicArea.region].filter(Boolean).join(', ')}
                        </div>
                      )}
                      {alert.metadata?.affectedCount && (
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {alert.metadata.affectedCount} affected
                        </div>
                      )}
                    </div>

                    {alert.metadata?.symptomPattern && alert.metadata.symptomPattern.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Common Symptoms:</p>
                        <div className="flex flex-wrap gap-1">
                          {alert.metadata.symptomPattern.map((symptom, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{outbreakAlerts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-gray-900">
                {outbreakAlerts.filter(a => a.severity === 'critical').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Affected Areas</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(outbreakAlerts.map(a => a.geographicArea?.city).filter(Boolean)).size}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {outbreakAlerts.filter(a => {
                  const alertDate = new Date(a.createdAt);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return alertDate >= weekAgo;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutbreakAlerts;