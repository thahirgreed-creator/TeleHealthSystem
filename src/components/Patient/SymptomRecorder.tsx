import React, { useState, useRef } from 'react';
import { Mic, MicOff, Play, Square, Upload } from 'lucide-react';
import { useReportsStore } from '../../stores/reportsStore';
import { useAuthStore } from '../../stores/authStore';

const SymptomRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [duration, setDuration] = useState('');
  const [newSymptom, setNewSymptom] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { createReport, isLoading } = useReportsStore();
  const { user } = useAuthStore();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        const audioBlob = new Blob([event.data], { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const addSymptom = () => {
    if (newSymptom.trim() && !symptoms.includes(newSymptom.trim())) {
      setSymptoms([...symptoms, newSymptom.trim()]);
      setNewSymptom('');
    }
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || symptoms.length === 0) {
      alert('Please add at least one symptom');
      return;
    }

    try {
      await createReport({
        symptoms,
        description,
        severity,
        duration,
        audioTranscript: audioURL ? 'Audio recording available' : undefined,
      });

      // Reset form
      setSymptoms([]);
      setDescription('');
      setSeverity('mild');
      setDuration('');
      setAudioURL(null);
      alert('Symptom report submitted successfully!');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Report Your Symptoms</h2>
          <p className="text-gray-600 mt-1">
            Describe your symptoms using voice recording or text entry
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Voice Recording Section */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Mic className="w-5 h-5 mr-2 text-blue-600" />
              Voice Recording (Optional)
            </h3>
            
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  isRecording
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isRecording ? (
                  <>
                    <Square className="w-4 h-4 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Start Recording
                  </>
                )}
              </button>

              {audioURL && (
                <div className="flex items-center space-x-2">
                  <audio controls src={audioURL} className="h-10" />
                  <p className="text-sm text-green-600 font-medium">Recording saved</p>
                </div>
              )}
            </div>

            {isRecording && (
              <div className="mt-4 flex items-center text-red-600">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm font-medium">Recording in progress...</span>
              </div>
            )}

            <p className="text-sm text-gray-600 mt-3">
              💡 Tip: Speak clearly in your preferred language. Our AI will transcribe and translate your symptoms.
            </p>
          </div>

          {/* Symptoms Entry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Symptoms *
            </label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newSymptom}
                onChange={(e) => setNewSymptom(e.target.value)}
                placeholder="Enter a symptom (e.g., headache, fever)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSymptom())}
              />
              <button
                type="button"
                onClick={addSymptom}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            
            {symptoms.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {symptom}
                    <button
                      type="button"
                      onClick={() => removeSymptom(symptom)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Please describe your symptoms in detail..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Severity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity Level *
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as 'mild' | 'moderate' | 'severe')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="mild">Mild - Minor discomfort</option>
                <option value="moderate">Moderate - Noticeable symptoms</option>
                <option value="severe">Severe - Significant impact</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration *
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 2 days, 1 week"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => {
                setSymptoms([]);
                setDescription('');
                setSeverity('mild');
                setDuration('');
                setAudioURL(null);
              }}
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={isLoading || symptoms.length === 0}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isLoading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SymptomRecorder;