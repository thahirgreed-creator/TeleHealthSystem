import express from 'express';
import Consultation from '../models/Consultation.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Create consultation
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      reportId,
      scheduledAt,
      type,
    } = req.body;

    // Patients can only create consultations for themselves
    if (req.user.role === 'patient') {
      if (req.user._id.toString() !== patientId) {
        return res.status(403).json({ error: 'You can only create consultations for yourself' });
      }
    }

    const consultation = new Consultation({
      patientId: req.user.role === 'patient' ? req.user._id : patientId,
      doctorId,
      reportId,
      scheduledAt,
      type,
    });

    await consultation.save();
    
    await consultation.populate([
      { path: 'patientId', select: 'firstName lastName email phone' },
      { path: 'doctorId', select: 'firstName lastName specialization' },
      { path: 'reportId' }
    ]);

    res.status(201).json(consultation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get consultations
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, type, date, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    
    // Role-based filtering
    if (req.user.role === 'patient') {
      filter.patientId = req.user._id;
    } else if (req.user.role === 'doctor') {
      filter.doctorId = req.user._id;
    }
    
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.scheduledAt = { $gte: startOfDay, $lte: endOfDay };
    }

    const consultations = await Consultation.find(filter)
      .populate('patientId', 'firstName lastName email phone dateOfBirth gender')
      .populate('doctorId', 'firstName lastName specialization')
      .populate('reportId', 'symptoms severity status')
      .sort({ scheduledAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Consultation.countDocuments(filter);

    res.json({
      consultations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single consultation
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('patientId', 'firstName lastName email phone dateOfBirth gender')
      .populate('doctorId', 'firstName lastName specialization')
      .populate('reportId');

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    // Check permissions
    const isPatient = req.user.role === 'patient' && consultation.patientId._id.toString() === req.user._id.toString();
    const isDoctor = req.user.role === 'doctor' && consultation.doctorId._id.toString() === req.user._id.toString();
    
    if (!isPatient && !isDoctor) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(consultation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update consultation
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    // Check permissions
    const isPatient = req.user.role === 'patient' && consultation.patientId.toString() === req.user._id.toString();
    const isDoctor = req.user.role === 'doctor' && consultation.doctorId.toString() === req.user._id.toString();
    
    if (!isPatient && !isDoctor) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const allowedUpdates = ['status', 'notes', 'prescription', 'followUp', 'duration', 'meetingUrl'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    // Patients can only update certain fields
    if (req.user.role === 'patient') {
      const patientAllowed = ['status']; // Patients can cancel consultations
      const isValidPatientOperation = updates.every(update => 
        patientAllowed.includes(update) && 
        (update !== 'status' || req.body.status === 'cancelled')
      );
      
      if (!isValidPatientOperation) {
        return res.status(403).json({ error: 'Patients can only cancel consultations' });
      }
    }

    updates.forEach(update => {
      consultation[update] = req.body[update];
    });

    await consultation.save();
    
    await consultation.populate([
      { path: 'patientId', select: 'firstName lastName email phone' },
      { path: 'doctorId', select: 'firstName lastName specialization' },
      { path: 'reportId' }
    ]);

    res.json(consultation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete consultation
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    // Only allow deletion by the patient or doctor involved
    const isPatient = req.user.role === 'patient' && consultation.patientId.toString() === req.user._id.toString();
    const isDoctor = req.user.role === 'doctor' && consultation.doctorId.toString() === req.user._id.toString();
    
    if (!isPatient && !isDoctor) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Consultation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Consultation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;