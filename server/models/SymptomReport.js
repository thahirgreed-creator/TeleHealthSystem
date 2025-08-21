import mongoose from 'mongoose';

const symptomReportSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  symptoms: [{
    type: String,
    required: true,
    trim: true,
  }],
  description: {
    type: String,
    trim: true,
  },
  audioTranscript: {
    type: String,
    trim: true,
  },
  severity: {
    type: String,
    required: true,
    enum: ['mild', 'moderate', 'severe'],
  },
  duration: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'reviewed', 'consultation_requested'],
    default: 'pending',
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewNotes: {
    type: String,
    trim: true,
  },
  aiAnalysis: {
    possibleConditions: [String],
    recommendedActions: [String],
    urgencyLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
    },
  },
}, {
  timestamps: true,
});

// Index for efficient queries
symptomReportSchema.index({ patientId: 1, createdAt: -1 });
symptomReportSchema.index({ status: 1, severity: 1 });

export default mongoose.model('SymptomReport', symptomReportSchema);