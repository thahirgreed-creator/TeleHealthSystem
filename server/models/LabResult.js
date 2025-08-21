import mongoose from 'mongoose';

const labResultSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  testName: {
    type: String,
    required: true,
    trim: true,
  },
  testDate: {
    type: Date,
    required: true,
  },
  results: {
    type: String,
    required: true,
    trim: true,
  },
  doctorNotes: {
    type: String,
    trim: true,
  },
  fileUrl: {
    type: String,
    trim: true,
  },
  normalRange: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['normal', 'abnormal', 'critical'],
  },
  orderedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  labFacility: {
    name: String,
    address: String,
    contact: String,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
labResultSchema.index({ patientId: 1, testDate: -1 });
labResultSchema.index({ status: 1, testDate: -1 });

export default mongoose.model('LabResult', labResultSchema);