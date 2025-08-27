import { Router } from 'express';
import { StudentModel } from '../models/Student';
import { TeacherModel } from '../models/Teacher';
import { ActivityModel } from '../models/Activity';
import { ActivityTemplateModel } from '../models/ActivityTemplate';

export const adminRouter = Router();

// DEBUG: Get DB info and collection counts
adminRouter.get('/_debug/info', async (_req, res) => {
  try {
    const mongoose = (await import('mongoose')).default;
    const name = mongoose.connection.name;
    const host = (mongoose.connection as any).host;
    const counts = await Promise.all([
      StudentModel.countDocuments({}),
      TeacherModel.countDocuments({}),
      ActivityModel.countDocuments({}),
      ActivityTemplateModel.countDocuments({})
    ]);
    res.json({
      db: { name, host },
      counts: {
        students: counts[0],
        teachers: counts[1],
        activities: counts[2],
        activityTemplates: counts[3]
      }
    });
  } catch (error) {
    console.error('Error in debug info:', error);
    res.status(500).json({ error: 'Failed to fetch debug info' });
  }
});

// DEBUG: Seed a test student (random enrollmentNumber)
adminRouter.post('/_debug/seed-student', async (_req, res) => {
  try {
    const rand = Math.floor(Math.random() * 1_000_000);
    const doc = await StudentModel.create({
      enrollmentNumber: `DBG${rand}`,
      name: 'Debug Student',
      email: `debug${rand}@example.com`,
      department: 'CSE',
      year: 'SE',
      division: 'A',
      program: 'BTech'
    });
    res.status(201).json(doc);
  } catch (error: any) {
    console.error('Error seeding debug student:', error);
    res.status(500).json({ error: error?.message || 'Failed to seed student' });
  }
});

// Create student
adminRouter.post('/students', async (req, res) => {
  try {
    const {
      enrollmentNumber,
      name,
      email,
      phone,
      department,
      year,
      division,
      program,
      address,
      dateOfBirth,
      sscPercentage,
      hscPercentage,
      requiredPoints
    } = req.body;

    if (!enrollmentNumber || !name || !email || !department || !year || !division || !program) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const created = await StudentModel.create({
      enrollmentNumber,
      name,
      email,
      phone,
      department,
      year,
      division,
      program,
      address,
      dateOfBirth,
      sscPercentage,
      hscPercentage,
      requiredPoints
    });

    res.status(201).json(created);
  } catch (error: any) {
    if (error?.code === 11000) {
      return res.status(409).json({ error: 'Student with same enrollmentNumber or email already exists' });
    }
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Create teacher
adminRouter.post('/teachers', async (req, res) => {
  try {
    const {
      facultyId,
      name,
      email,
      phone,
      department,
      designation,
      profilePhoto
    } = req.body;

    if (!facultyId || !name || !email || !department || !designation) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const created = await TeacherModel.create({
      facultyId,
      name,
      email,
      phone,
      department,
      designation,
      profilePhoto
    });

    res.status(201).json(created);
  } catch (error: any) {
    if (error?.code === 11000) {
      return res.status(409).json({ error: 'Teacher with same facultyId or email already exists' });
    }
    console.error('Error creating teacher:', error);
    res.status(500).json({ error: 'Failed to create teacher' });
  }
});

// Get all students
adminRouter.get('/students', async (req, res) => {
  try {
    const students = await StudentModel.find({})
      .select('-__v')
      .sort({ createdAt: -1 });
    
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get all teachers
adminRouter.get('/teachers', async (req, res) => {
  try {
    const teachers = await TeacherModel.find({})
      .select('-__v')
      .populate('assignedStudents', 'name enrollmentNumber')
      .sort({ createdAt: -1 });
    
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
});

// Get all activities
adminRouter.get('/activities', async (req, res) => {
  try {
    const activities = await ActivityModel.find({})
      .select('-__v')
      .populate('studentId', 'name enrollmentNumber')
      .populate('approvedBy', 'name facultyId')
      .sort({ createdAt: -1 });
    
    // Transform the data to include student name directly
    const transformedActivities = activities.map(activity => ({
      _id: activity._id,
      studentId: activity.studentId._id || activity.studentId,
      studentName: activity.studentName || (activity.studentId as any)?.name || 'Unknown Student',
      activityName: activity.activityName,
      category: activity.category,
      subCategory: activity.subCategory,
      level: activity.level,
      points: activity.points,
      maxPoints: activity.maxPoints,
      status: activity.status,
      approvedBy: activity.approvedBy?._id || activity.approvedBy,
      approvedDate: activity.approvedDate,
      createdAt: activity.createdAt
    }));
    
    res.json(transformedActivities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// Get activity templates
adminRouter.get('/activity-templates', async (req, res) => {
  try {
    const templates = await ActivityTemplateModel.find({})
      .select('-__v')
      .populate('createdBy', 'name facultyId')
      .sort({ createdAt: -1 });
    
    res.json(templates);
  } catch (error) {
    console.error('Error fetching activity templates:', error);
    res.status(500).json({ error: 'Failed to fetch activity templates' });
  }
});

// Get system statistics
adminRouter.get('/stats', async (req, res) => {
  try {
    const [totalStudents, totalTeachers, totalActivities, totalTemplates] = await Promise.all([
      StudentModel.countDocuments({}),
      TeacherModel.countDocuments({}),
      ActivityModel.countDocuments({}),
      ActivityTemplateModel.countDocuments({})
    ]);

    const approvedActivities = await ActivityModel.countDocuments({ status: 'approved' });
    const pendingActivities = await ActivityModel.countDocuments({ status: 'pending' });
    const rejectedActivities = await ActivityModel.countDocuments({ status: 'rejected' });

    const totalPointsAwarded = await ActivityModel.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$points' } } }
    ]);

    const departmentStats = await StudentModel.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const activityCategoryStats = await ActivityModel.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      overview: {
        totalStudents,
        totalTeachers,
        totalActivities,
        totalTemplates,
        approvedActivities,
        pendingActivities,
        rejectedActivities,
        totalPointsAwarded: totalPointsAwarded[0]?.total || 0
      },
      departmentStats,
      activityCategoryStats
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get student by enrollment number
adminRouter.get('/students/:enrollmentNumber', async (req, res) => {
  try {
    const student = await StudentModel.findOne({ 
      enrollmentNumber: req.params.enrollmentNumber 
    }).select('-__v');
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Get teacher by faculty ID
adminRouter.get('/teachers/:facultyId', async (req, res) => {
  try {
    const teacher = await TeacherModel.findOne({ 
      facultyId: req.params.facultyId 
    })
    .select('-__v')
    .populate('assignedStudents', 'name enrollmentNumber department year');
    
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    res.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ error: 'Failed to fetch teacher' });
  }
});

// Update student status
adminRouter.patch('/students/:enrollmentNumber/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const student = await StudentModel.findOneAndUpdate(
      { enrollmentNumber: req.params.enrollmentNumber },
      { status },
      { new: true }
    ).select('-__v');
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Error updating student status:', error);
    res.status(500).json({ error: 'Failed to update student status' });
  }
});

// Update student profile
adminRouter.put('/students/:enrollmentNumber', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      department,
      year,
      division,
      program,
      address,
      dateOfBirth,
      sscPercentage,
      hscPercentage,
      requiredPoints
    } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (department) updateData.department = department;
    if (year) updateData.year = year;
    if (division) updateData.division = division;
    if (program) updateData.program = program;
    if (address !== undefined) updateData.address = address;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (sscPercentage !== undefined) updateData.sscPercentage = sscPercentage;
    if (hscPercentage !== undefined) updateData.hscPercentage = hscPercentage;
    if (requiredPoints !== undefined) updateData.requiredPoints = requiredPoints;

    const student = await StudentModel.findOneAndUpdate(
      { enrollmentNumber: req.params.enrollmentNumber },
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Update teacher status
adminRouter.patch('/teachers/:facultyId/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const teacher = await TeacherModel.findOneAndUpdate(
      { facultyId: req.params.facultyId },
      { status },
      { new: true }
    ).select('-__v');
    
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    res.json(teacher);
  } catch (error) {
    console.error('Error updating teacher status:', error);
    res.status(500).json({ error: 'Failed to update teacher status' });
  }
});

// Update teacher profile
adminRouter.put('/teachers/:facultyId', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      department,
      designation
    } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (department) updateData.department = department;
    if (designation) updateData.designation = designation;

    const teacher = await TeacherModel.findOneAndUpdate(
      { facultyId: req.params.facultyId },
      updateData,
      { new: true, runValidators: true }
    )
    .select('-__v')
    .populate('assignedStudents', 'name enrollmentNumber department year');
    
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    res.json(teacher);
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ error: 'Failed to update teacher' });
  }
});

export default adminRouter;
