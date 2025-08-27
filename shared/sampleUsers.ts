export interface Student {
  enrollmentNumber: string;
  name: string;
  email: string;
  department: string;
  year: string;
  division: string;
  program: string;
}

export interface Teacher {
  facultyId: string;
  name: string;
  email: string;
  department: string;
  designation: string;
}

export interface Admin {
  adminId: string;
  name: string;
  email: string;
  role: string;
}

export const SAMPLE_STUDENTS: Student[] = [
  {
    enrollmentNumber: 'CSE-2021-001',
    name: 'Raj Patel',
    email: 'raj.patel@sanjivani.edu.in',
    department: 'Computer Science & Engineering',
    year: 'Final Year',
    division: 'Division A',
    program: 'B.Tech'
  },
  {
    enrollmentNumber: 'CSE-2021-045',
    name: 'Priya Sharma',
    email: 'priya.sharma@sanjivani.edu.in',
    department: 'Computer Science & Engineering',
    year: 'Final Year',
    division: 'Division B',
    program: 'B.Tech'
  },
  {
    enrollmentNumber: 'ECE-2022-012',
    name: 'Amit Kumar',
    email: 'amit.kumar@sanjivani.edu.in',
    department: 'Electronics & Telecommunication',
    year: 'Third Year',
    division: 'Division A',
    program: 'B.Tech'
  },
  {
    enrollmentNumber: 'MBA-2023-008',
    name: 'Sneha Desai',
    email: 'sneha.desai@sanjivani.edu.in',
    department: 'Management Studies (MBA)',
    year: 'Second Year',
    division: 'Division A',
    program: 'MBA'
  },
  {
    enrollmentNumber: 'MECH-2021-025',
    name: 'Rohit Singh',
    email: 'rohit.singh@sanjivani.edu.in',
    department: 'Mechanical Engineering',
    year: 'Final Year',
    division: 'Division C',
    program: 'B.Tech'
  }
];

export const SAMPLE_TEACHERS: Teacher[] = [
  {
    facultyId: 'FAC-CSE-001',
    name: 'Dr. Jane Smith',
    email: 'jane.smith@sanjivani.edu.in',
    department: 'Computer Science & Engineering',
    designation: 'Professor'
  },
  {
    facultyId: 'FAC-CSE-002',
    name: 'Prof. Rajesh Kumar',
    email: 'rajesh.kumar@sanjivani.edu.in',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor'
  },
  {
    facultyId: 'FAC-ECE-001',
    name: 'Dr. Priya Patel',
    email: 'priya.patel@sanjivani.edu.in',
    department: 'Electronics & Telecommunication',
    designation: 'Assistant Professor'
  },
  {
    facultyId: 'FAC-MECH-001',
    name: 'Prof. Amit Patil',
    email: 'amit.patil@sanjivani.edu.in',
    department: 'Mechanical Engineering',
    designation: 'Professor'
  },
  {
    facultyId: 'FAC-MBA-001',
    name: 'Dr. Sneha Joshi',
    email: 'sneha.joshi@sanjivani.edu.in',
    department: 'Management Studies (MBA)',
    designation: 'Associate Professor'
  }
];

export const SAMPLE_ADMINS: Admin[] = [
  {
    adminId: 'ADMIN-001',
    name: 'System Administrator',
    email: 'admin@sanjivani.edu.in',
    role: 'Super Admin'
  },
  {
    adminId: 'ADMIN-002',
    name: 'Academic Coordinator',
    email: 'academic@sanjivani.edu.in',
    role: 'Academic Admin'
  }
];

// Helper functions to get user data
export function getStudentByEnrollment(enrollmentNumber: string): Student | undefined {
  return SAMPLE_STUDENTS.find(student => student.enrollmentNumber === enrollmentNumber);
}

export function getTeacherByFacultyId(facultyId: string): Teacher | undefined {
  return SAMPLE_TEACHERS.find(teacher => teacher.facultyId === facultyId);
}

export function getAdminById(adminId: string): Admin | undefined {
  return SAMPLE_ADMINS.find(admin => admin.adminId === adminId);
}

// Department configuration
export const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Information Technology',
  'Electrical Engineering',
  'Management Studies (MBA)',
  'Master of Computer Applications (MCA)',
  'Artificial Intelligence & Machine Learning (AIML)',
  'Artificial Intelligence & Data Science (AIDS)',
  'Cyber Security',
  'Business Administration (BBA)'
];

export const ACADEMIC_YEARS = [
  'First Year',
  'Second Year',
  'Third Year',
  'Final Year'
];

export const DIVISIONS = [
  'Division A',
  'Division B',
  'Division C',
  'Division D'
];

export const PROGRAMS = [
  'B.Tech',
  'BCA',
  'MBA',
  'M.Tech',
  'MCA',
  'BBA'
];
