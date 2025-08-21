import express from 'express';
import LabResult from '../models/LabResult.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Create lab result (doctors only)
router.post('/', authenticateToken, requireRole(['doctor']), async (req, res) => {
  try {
    const {
      patientId,
      testName,
      testDate,
      results,
      doctorNotes,
      fileUrl,
      normalRange,
      status,
      labFacility,
    } = req.body;

    const labResult = new LabResult({
      patientId,
      testName,
      testDate,
      results,
      doctorNotes,
      fileUrl,
      normalRange,
      status,
      orderedBy: req.user._id,
      labFacility,
    });

    await labResult.save();
    
    await labResult.populate([
      { path: 'patientId', select: 'firstName lastName email' },
      { path: 'orderedBy', select: 'firstName lastName specialization' }
    ]);

    res.status(201).json(labResult);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get lab results
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { patientId, status, testName, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    
    // Role-based filtering
    if (req.user.role === 'patient') {
      filter.patientId = req.user._id;
    } else if (patientId) {
      filter.patientId = patientId;
    }
    
    if (status) filter.status = status;
    if (testName) filter.testName = { $regex: testName, $options: 'i' };

    const labResults = await LabResult.find(filter)
      .populate('patientId', 'firstName lastName email phone')
      .populate('orderedBy', 'firstName lastName specialization')
      .sort({ testDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LabResult.countDocuments(filter);

    res.json({
      labResults,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single lab result
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const labResult = await LabResult.findById(req.params.id)
      .populate('patientId', 'firstName lastName email phone')
      .populate('orderedBy', 'firstName lastName specialization');

    if (!labResult) {
      return res.status(404).json({ error: 'Lab result not found' });
    }

    // Check permissions
    if (req.user.role === 'patient' && labResult.patientId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(labResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update lab result (doctors only)
router.patch('/:id', authenticateToken, requireRole(['doctor']), async (req, res) => {
  try {
    const labResult = await LabResult.findById(req.params.id);
    if (!labResult) {
      return res.status(404).json({ error: 'Lab result not found' });
    }

    const allowedUpdates = ['results', 'doctorNotes', 'status', 'normalRange'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    updates.forEach(update => {
      labResult[update] = req.body[update];
    });

    await labResult.save();
    
    await labResult.populate([
      { path: 'patientId', select: 'firstName lastName email' },
      { path: 'orderedBy', select: 'firstName lastName specialization' }
    ]);

    res.json(labResult);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete lab result (doctors only)
router.delete('/:id', authenticateToken, requireRole(['doctor']), async (req, res) => {
  try {
    const labResult = await LabResult.findByIdAndDelete(req.params.id);
    if (!labResult) {
      return res.status(404).json({ error: 'Lab result not found' });
    }
    res.json({ message: 'Lab result deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;