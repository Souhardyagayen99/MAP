import { Router } from 'express';
import { TeacherModel } from '../models/Teacher';
import { StudentModel } from '../models/Student';
import { ActivityTemplateModel } from '../models/ActivityTemplate';
import { ActivityModel } from '../models/Activity';

export const teachersRouter = Router();

// Get teacher profile
teachersRouter.get('/:facultyId', async (req, res) => {
  try {
    const { facultyId } = req.params;
    const teacher = await TeacherModel.findOne({ facultyId }).lean();
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch teacher' });
  }
});

// Get students assigned to teacher
teachersRouter.get('/:facultyId/students', async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { department, year, division } = req.query as any;
    
    const teacher = await TeacherModel.findOne({ facultyId });
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    // Build filter based on teacher's department and query params
    const filter: any = { department: teacher.department };
    if (year) filter.year = year;
    if (division) filter.division = division;
    
    const students = await StudentModel.find(filter)
      .select('enrollmentNumber name email department year division program totalPoints requiredPoints')
      .sort({ name: 1 })
      .lean();
    
    res.json(students);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch students' });
  }
});

// Get specific student profile (for teacher view)
teachersRouter.get('/:facultyId/students/:enrollmentNumber', async (req, res) => {
  try {
    const { facultyId, enrollmentNumber } = req.params;
    
    const teacher = await TeacherModel.findOne({ facultyId });
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    const student = await StudentModel.findOne({ enrollmentNumber }).lean();
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    // Check if teacher has access to this student's department
    if (student.department !== teacher.department) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get student's activities
    const activities = await ActivityModel.find({ studentId: student._id })
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({
      student,
      activities,
      totalPoints: activities
        .filter(a => a.status === 'approved')
        .reduce((sum, a) => sum + (a.points || 0), 0)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch student' });
  }
});

// Create activity template
teachersRouter.post('/:facultyId/activities', async (req, res) => {
  try {
    const { facultyId } = req.params;
    const activityData = req.body;
    
    const teacher = await TeacherModel.findOne({ facultyId });
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    const newActivity = await ActivityTemplateModel.create({
      ...activityData,
      createdBy: teacher._id,
      department: teacher.department
    });
    
    res.status(201).json(newActivity);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create activity' });
  }
});

// Get teacher's created activities
teachersRouter.get('/:facultyId/activities', async (req, res) => {
  try {
    const { facultyId } = req.params;
    
    const teacher = await TeacherModel.findOne({ facultyId });
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    const activities = await ActivityTemplateModel.find({ createdBy: teacher._id })
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(activities);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch activities' });
  }
});

// Update activity template
teachersRouter.put('/:facultyId/activities/:activityId', async (req, res) => {
  try {
    const { facultyId, activityId } = req.params;
    const updateData = req.body;
    
    const teacher = await TeacherModel.findOne({ facultyId });
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    const updated = await ActivityTemplateModel.findOneAndUpdate(
      { _id: activityId, createdBy: teacher._id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      return res.status(404).json({ error: 'Activity not found or access denied' });
    }
    
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update activity' });
  }
});

// Get pending activities for teacher to review
teachersRouter.get('/:facultyId/reviews', async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { status = 'pending' } = req.query as any;
    
    const teacher = await TeacherModel.findOne({ facultyId });
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    const filter: any = { status };
    if (status === 'pending') filter.status = 'pending';
    
    const activities = await ActivityModel.find(filter)
      .populate('studentId', 'enrollmentNumber name department year division')
      .populate('activityTemplateId', 'name category level points')
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(activities);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch reviews' });
  }
});
