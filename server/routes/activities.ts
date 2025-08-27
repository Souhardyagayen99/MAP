import { Router } from 'express';
import { ActivityModel } from '../models/Activity';

export const activitiesRouter = Router();

// Create activity submission
activitiesRouter.post('/', async (req, res) => {
  try {
    const created = await ActivityModel.create(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create activity' });
  }
});

// List submissions (optionally filter by studentId)
activitiesRouter.get('/', async (req, res) => {
  try {
    const { studentId, status } = req.query as any;
    const filter: any = {};
    if (studentId) filter.studentId = studentId;
    if (status) filter.status = status;
    const items = await ActivityModel.find(filter).sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch activities' });
  }
});

// Get by id
activitiesRouter.get('/:id', async (req, res) => {
  try {
    const item = await ActivityModel.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to fetch activity' });
  }
});

// Update by id
activitiesRouter.put('/:id', async (req, res) => {
  try {
    const updated = await ActivityModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update activity' });
  }
});

// Teacher approve/reject
activitiesRouter.post('/:id/review', async (req, res) => {
  try {
    const { id } = req.params;
    const { approve, teacherRemarks, marksApproved, marksRemarks, approvedBy } = req.body;
    const update: any = {
      status: approve ? 'approved' : 'rejected',
      teacherRemarks,
      approvedBy: approvedBy || 'TEACHER',
      approvedDate: new Date().toISOString(),
    };
    if (typeof marksApproved === 'boolean') update.marksApproved = marksApproved;
    if (marksRemarks) update.marksEvidence = marksRemarks;
    const updated = await ActivityModel.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to review activity' });
  }
});


