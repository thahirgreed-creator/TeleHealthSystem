import express from 'express';
import SymptomReport from '../models/SymptomReport.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Create symptom report (patients only)
router.post('/', authenticateToken, requireRole(['patient']), async (req, res) => {
  try {
    const {
      symptoms,
      description,
      audioTranscript,
      severity,
      duration,
    } = req.body;

    const report = new SymptomReport({
      patientId: req.user._id,
      symptoms,
      description,
      audioTranscript,
      severity,
      duration,
    });

    await report.save();
    
    // Populate patient info
    await report.populate('patientId', 'firstName lastName email');

    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all reports (doctors only)
router.get('/', authenticateToken, requireRole(['doctor']), async (req, res) => {
  try {
    const { status, severity, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;

    const reports = await SymptomReport.find(filter)
      .populate('patientId', 'firstName lastName email phone dateOfBirth gender')
      .populate('reviewedBy', 'firstName lastName specialization')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SymptomReport.countDocuments(filter);

    res.json({
      reports,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get patient's reports
router.get('/patient/:patientId', authenticateToken, async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Patients can only view their own reports
    if (req.user.role === 'patient' && req.user._id.toString() !== patientId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const reports = await SymptomReport.find({ patientId })
      .populate('reviewedBy', 'firstName lastName specialization')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single report
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const report = await SymptomReport.findById(req.params.id)
      .populate('patientId', 'firstName lastName email phone dateOfBirth gender')
      .populate('reviewedBy', 'firstName lastName specialization');

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Check permissions
    if (req.user.role === 'patient' && report.patientId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update report (doctors only)
router.patch('/:id', authenticateToken, requireRole(['doctor']), async (req, res) => {
  try {
    const { status, reviewNotes, aiAnalysis } = req.body;
    
    const report = await SymptomReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    if (status) report.status = status;
    if (reviewNotes) report.reviewNotes = reviewNotes;
    if (aiAnalysis) report.aiAnalysis = aiAnalysis;
    
    report.reviewedBy = req.user._id;
    
    await report.save();
    await report.populate([
      { path: 'patientId', select: 'firstName lastName email' },
      { path: 'reviewedBy', select: 'firstName lastName specialization' }
    ]);

    res.json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete report (admin/system only - not exposed in UI)
router.delete('/:id', authenticateToken, requireRole(['doctor']), async (req, res) => {
  try {
    const report = await SymptomReport.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;