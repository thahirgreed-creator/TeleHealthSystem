import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SymptomReport',
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  type: {
    type: String,
    required: true,
    enum: ['video', 'audio', 'chat'],
  },
  notes: {
    type: String,
    trim: true,
  },
  prescription: {
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String,
    }],
    notes: String,
  },
  followUp: {
    required: {
      type: Boolean,
      default: false,
    },
    scheduledDate: Date,
    instructions: String,
  },
  duration: {
    type: Number, // in minutes
  },
  meetingUrl: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Indexes for efficient queries
consultationSchema.index({ patientId: 1, scheduledAt: -1 });
consultationSchema.index({ doctorId: 1, scheduledAt: -1 });
consultationSchema.index({ status: 1, scheduledAt: 1 });

export default mongoose.model('Consultation', consultationSchema);