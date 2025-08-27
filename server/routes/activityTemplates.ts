import { Router } from 'express';
import { ActivityTemplateModel } from '../models/ActivityTemplate';
import { ActivityModel } from '../models/Activity';
import { StudentModel } from '../models/Student';

export const activityTemplatesRouter = Router();

// Get available activities for students
activityTemplatesRouter.get('/', async (req, res) => {
  try {
    const { department, year, division, category, level } = req.query as any;
    
    const filter: any = { isActive: true };
    if (department) filter.department = department;
    if (year) filter.year = year;
    if (division) filter.division = division;
    if (category) filter.category = category;
    if (level) filter.level = level;
    
    const activities = await ActivityTemplateModel.find(filter)
      .populate('createdBy', 'name facultyId')
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(activities);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch activities' });
  }
});

// Get specific activity template
activityTemplatesRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await ActivityTemplateModel.findById(id)
      .populate('createdBy', 'name facultyId')
      .lean();
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    res.json(activity);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch activity' });
  }
});

// Student submits activity participation
activityTemplatesRouter.post('/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const { enrollmentNumber, evidenceUrl, remarks } = req.body;
    
    // Find student
    const student = await StudentModel.findOne({ enrollmentNumber });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    // Find activity template
    const template = await ActivityTemplateModel.findById(id);
    if (!template) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    // Check if student already submitted this activity
    const existingSubmission = await ActivityModel.findOne({
      studentId: student._id,
      activityTemplateId: template._id
    });
    
    if (existingSubmission) {
      return res.status(400).json({ error: 'Already submitted this activity' });
    }
    
    // Create activity submission
    const newActivity = await ActivityModel.create({
      studentId: student._id,
      studentName: student.name,
      activityTemplateId: template._id,
      activityName: template.name,
      category: template.category,
      subCategory: template.subCategory,
      level: template.level,
      date: new Date().toISOString().split('T')[0],
      evidenceType: template.evidenceType,
      evidenceUrl,
      remarks,
      points: template.points,
      maxPoints: template.maxPoints,
      status: 'pending'
    });
    
    res.status(201).json(newActivity);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to submit activity' });
  }
});

// Get student's submitted activities
activityTemplatesRouter.get('/student/:enrollmentNumber/submissions', async (req, res) => {
  try {
    const { enrollmentNumber } = req.params;
    
    const student = await StudentModel.findOne({ enrollmentNumber });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const submissions = await ActivityModel.find({ studentId: student._id })
      .populate('activityTemplateId', 'name category level points maxPoints')
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(submissions);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch submissions' });
  }
});
