import React, { useEffect, useState } from 'react';
import { TestTube, Upload, Download, Eye, Calendar, AlertCircle } from 'lucide-react';
import { useLabResultsStore } from '../../stores/labResultsStore';
import { format } from 'date-fns';

const LabResults = () => {
  const { labResults, getUserLabResults, isLoading } = useLabResultsStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    getUserLabResults();
  }, [getUserLabResults]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'abnormal':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <TestTube className="w-4 h-4" />;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Here you would typically upload the file to your backend
      console.log('File selected:', file.name);
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
        <h2 className="text-2xl font-bold text-gray-900">Lab Results</h2>
        <div className="flex space-x-3">
          <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Upload Results
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {selectedFile && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Upload className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-800 font-medium">File ready to upload: {selectedFile.name}</span>
            </div>
            <div className="flex space-x-2">
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                Upload
              </button>
              <button 
                onClick={() => setSelectedFile(null)}
                className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {labResults.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <TestTube className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Lab Results Yet</h3>
          <p className="text-gray-600 mb-4">
            Your lab results will appear here once they're available. You can also upload your own results.
          </p>
          <label className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Upload First Result
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="grid gap-4">
          {labResults.map((result) => (
            <div key={result._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${
                    result.status === 'critical' ? 'bg-red-100' :
                    result.status === 'abnormal' ? 'bg-orange-100' : 'bg-green-100'
                  }`}>
                    {getStatusIcon(result.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{result.testName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                        {result.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(result.testDate), 'MMM dd, yyyy')}
                      </div>
                      {result.orderedBy && typeof result.orderedBy === 'object' && (
                        <div>
                          Ordered by: Dr. {result.orderedBy.firstName} {result.orderedBy.lastName}
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Results</p>
                          <p className="text-sm text-gray-900 mt-1">{result.results}</p>
                        </div>
                        {result.normalRange && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Normal Range</p>
                            <p className="text-sm text-gray-900 mt-1">{result.normalRange}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {result.doctorNotes && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-blue-800">Doctor's Notes</p>
                        <p className="text-sm text-blue-700 mt-1">{result.doctorNotes}</p>
                      </div>
                    )}

                    {result.labFacility && (
                      <div className="mt-3 text-xs text-gray-500">
                        Lab: {result.labFacility.name}
                        {result.labFacility.address && ` • ${result.labFacility.address}`}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {result.fileUrl && (
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lab Results Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Results Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Normal Results</p>
            <p className="text-2xl font-bold text-green-900">
              {labResults.filter(r => r.status === 'normal').length}
            </p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm text-orange-600 font-medium">Abnormal Results</p>
            <p className="text-2xl font-bold text-orange-900">
              {labResults.filter(r => r.status === 'abnormal').length}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-red-600 font-medium">Critical Results</p>
            <p className="text-2xl font-bold text-red-900">
              {labResults.filter(r => r.status === 'critical').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabResults;