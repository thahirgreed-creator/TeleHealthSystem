import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['outbreak', 'appointment', 'lab_result', 'system'],
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
  },
  targetUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  targetRoles: [{
    type: String,
    enum: ['patient', 'doctor'],
  }],
  geographicArea: {
    country: String,
    region: String,
    city: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: [Number], // [longitude, latitude]
    },
    radius: Number, // in kilometers
  },
  isRead: {
    type: Map,
    of: Boolean,
    default: new Map(),
  },
  metadata: {
    symptomPattern: [String],
    affectedCount: Number,
    relatedReports: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SymptomReport',
    }],
  },
  expiresAt: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for geospatial queries
alertSchema.index({ 'geographicArea.coordinates': '2dsphere' });
alertSchema.index({ type: 1, severity: 1, isActive: 1 });
alertSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Alert', alertSchema);