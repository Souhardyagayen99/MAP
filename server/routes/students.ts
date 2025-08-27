import { Router } from 'express';
import { StudentModel } from '../models/Student';
import { ActivityModel } from '../models/Activity';

export const studentsRouter = Router();

// Get student profile
studentsRouter.get('/:enrollmentNumber', async (req, res) => {
  try {
    const { enrollmentNumber } = req.params;
    const student = await StudentModel.findOne({ enrollmentNumber }).lean();
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch student' });
  }
});

// Update student profile (including SSC/HSC percentages)
studentsRouter.put('/:enrollmentNumber', async (req, res) => {
  try {
    const { enrollmentNumber } = req.params;
    const updateData = req.body;
    
    // Remove sensitive fields that shouldn't be updated
    delete updateData.enrollmentNumber;
    delete updateData.totalPoints;
    delete updateData.requiredPoints;
    
    const updated = await StudentModel.findOneAndUpdate(
      { enrollmentNumber },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update student' });
  }
});

// Get student's approved activities and points
studentsRouter.get('/:enrollmentNumber/activities', async (req, res) => {
  try {
    const { enrollmentNumber } = req.params;
    const { status = 'approved' } = req.query as any;
    
    // Find student first
    const student = await StudentModel.findOne({ enrollmentNumber });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    // Get activities
    const filter: any = { studentId: student._id };
    if (status !== 'all') filter.status = status;
    
    const activities = await ActivityModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    
    // Calculate total points
    const totalPoints = activities
      .filter(a => a.status === 'approved')
      .reduce((sum, a) => sum + (a.points || 0), 0);
    
    res.json({
      student: {
        enrollmentNumber: student.enrollmentNumber,
        name: student.name,
        totalPoints: student.totalPoints,
        requiredPoints: student.requiredPoints
      },
      activities,
      totalPoints
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch activities' });
  }
});

// Get student's points summary
studentsRouter.get('/:enrollmentNumber/points', async (req, res) => {
  try {
    const { enrollmentNumber } = req.params;
    
    const student = await StudentModel.findOne({ enrollmentNumber });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const approvedActivities = await ActivityModel.find({
      studentId: student._id,
      status: 'approved'
    }).lean();
    
    const totalPoints = approvedActivities.reduce((sum, a) => sum + (a.points || 0), 0);
    const pendingActivities = await ActivityModel.countDocuments({
      studentId: student._id,
      status: 'pending'
    });
    
    res.json({
      enrollmentNumber: student.enrollmentNumber,
      name: student.name,
      totalPoints,
      requiredPoints: student.requiredPoints,
      progress: Math.min((totalPoints / student.requiredPoints) * 100, 100),
      pendingActivities,
      approvedActivities: approvedActivities.length
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch points' });
  }
});
