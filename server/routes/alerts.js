import express from 'express';
import Alert from '../models/Alert.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Create alert (doctors/system only)
router.post('/', authenticateToken, requireRole(['doctor']), async (req, res) => {
  try {
    const {
      type,
      title,
      message,
      severity,
      targetUsers,
      targetRoles,
      geographicArea,
      metadata,
      expiresAt,
    } = req.body;

    const alert = new Alert({
      type,
      title,
      message,
      severity,
      targetUsers,
      targetRoles,
      geographicArea,
      metadata,
      expiresAt,
    });

    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get alerts
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type, severity, isActive = true, page = 1, limit = 20 } = req.query;
    
    const filter = { isActive };
    
    // Filter alerts relevant to the user
    const userFilter = {
      $or: [
        { targetUsers: req.user._id },
        { targetRoles: req.user.role },
        { targetUsers: { $size: 0 }, targetRoles: { $size: 0 } }, // Global alerts
      ]
    };
    
    Object.assign(filter, userFilter);
    
    if (type) filter.type = type;
    if (severity) filter.severity = severity;

    const alerts = await Alert.find(filter)
      .populate('targetUsers', 'firstName lastName role')
      .populate('metadata.relatedReports')
      .sort({ severity: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Alert.countDocuments(filter);

    res.json({
      alerts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single alert
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id)
      .populate('targetUsers', 'firstName lastName role')
      .populate('metadata.relatedReports');

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    // Check if user has access to this alert
    const hasAccess = 
      alert.targetUsers.some(user => user._id.toString() === req.user._id.toString()) ||
      alert.targetRoles.includes(req.user.role) ||
      (alert.targetUsers.length === 0 && alert.targetRoles.length === 0);

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark alert as read
router.patch('/:id/read', authenticateToken, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    alert.isRead.set(req.user._id.toString(), true);
    await alert.save();

    res.json({ message: 'Alert marked as read' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update alert (doctors only)
router.patch('/:id', authenticateToken, requireRole(['doctor']), async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    const allowedUpdates = ['title', 'message', 'severity', 'isActive', 'expiresAt', 'metadata'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    updates.forEach(update => {
      alert[update] = req.body[update];
    });

    await alert.save();
    res.json(alert);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete alert (doctors only)
router.delete('/:id', authenticateToken, requireRole(['doctor']), async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;