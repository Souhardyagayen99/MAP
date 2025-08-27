import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AdminStudentProfile from '@/components/AdminStudentProfile';
import AdminTeacherProfile from '@/components/AdminTeacherProfile';
import { 
  Users, 
  GraduationCap, 
  Building, 
  Search, 
  Filter, 
  Eye, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Hash,
  Trophy,
  Award,
  Target,
  BarChart3,
  Clock
} from 'lucide-react';

interface Student {
  _id: string;
  enrollmentNumber: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  division: string;
  program: string;
  sscPercentage?: number;
  hscPercentage?: number;
  totalPoints: number;
  requiredPoints: number;
  status: string;
  createdAt: string;
  profilePhoto?: string; // Added for avatar
}

interface Teacher {
  _id: string;
  facultyId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  status: string;
  assignedStudents: string[];
  createdAt: string;
  profilePhoto?: string; // Added for avatar
}

interface Activity {
  _id: string;
  studentId: string;
  studentName: string;
  activityName: string;
  category: string;
  subCategory: string;
  level: string;
  points: number;
  maxPoints: number;
  status: string;
  approvedBy?: string;
  approvedDate?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch students
      const studentsResponse = await fetch('/api/admin/students');
      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json();
        setStudents(studentsData);
      }

      // Fetch teachers
      const teachersResponse = await fetch('/api/admin/teachers');
      if (teachersResponse.ok) {
        const teachersData = await teachersResponse.json();
        setTeachers(teachersData);
      }

      // Fetch activities
      const activitiesResponse = await fetch('/api/admin/activities');
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !departmentFilter || student.department === departmentFilter;
    const matchesYear = !yearFilter || student.year === yearFilter;
    
    return matchesSearch && matchesDepartment && matchesYear;
  });

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.facultyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !departmentFilter || teacher.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  const departments = Array.from(new Set([...students.map(s => s.department), ...teachers.map(t => t.department)]));
  const years = Array.from(new Set(students.map(s => s.year)));

  const getStats = () => {
    const totalStudents = students.length;
    const totalTeachers = teachers.length;
    const totalActivities = activities.length;
    const approvedActivities = activities.filter(a => a.status === 'approved').length;
    const pendingActivities = activities.filter(a => a.status === 'pending').length;
    const totalPointsAwarded = activities
      .filter(a => a.status === 'approved')
      .reduce((sum, a) => sum + a.points, 0);

    return {
      totalStudents,
      totalTeachers,
      totalActivities,
      approvedActivities,
      pendingActivities,
      totalPointsAwarded
    };
  };

  const stats = getStats();

  const handleStudentUpdated = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => 
      s._id === updatedStudent._id ? updatedStudent : s
    ));
    setSelectedStudent(updatedStudent);
  };

  const handleTeacherUpdated = (updatedTeacher: Teacher) => {
    setTeachers(prev => prev.map(t => 
      t._id === updatedTeacher._id ? updatedTeacher : t
    ));
    setSelectedTeacher(updatedTeacher);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex h-16 items-center gap-4 border-b bg-gray-50/40 px-4 dark:bg-gray-800/40">
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold">MAP Sanjivani - Admin Dashboard</h1>
          </div>
        </div>
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex h-16 items-center gap-4 border-b bg-gray-50/40 px-4 dark:bg-gray-800/40">
        <div className="flex items-center gap-2">
          <Building className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-semibold">MAP Sanjivani - Admin Dashboard</h1>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalStudents}</div>
                  <p className="text-xs text-muted-foreground">Registered students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTeachers}</div>
                  <p className="text-xs text-muted-foreground">Faculty members</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalActivities}</div>
                  <p className="text-xs text-muted-foreground">Submitted activities</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved Activities</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.approvedActivities}</div>
                  <p className="text-xs text-muted-foreground">Successfully approved</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Activities</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingActivities}</div>
                  <p className="text-xs text-muted-foreground">Awaiting approval</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Points Awarded</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalPointsAwarded}</div>
                  <p className="text-xs text-muted-foreground">Points distributed</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <span>Student Management</span>
                </CardTitle>
                <CardDescription>View and manage all student profiles and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Departments</SelectItem>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={yearFilter} onValueChange={setYearFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Years</SelectItem>
                        {years.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Enrollment</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student._id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={student.profilePhoto} />
                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-gray-500">{student.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">{student.enrollmentNumber}</TableCell>
                          <TableCell>{student.department}</TableCell>
                          <TableCell>{student.year}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{student.totalPoints}</span>
                              <span className="text-sm text-gray-500">/ {student.requiredPoints}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                              {student.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedStudent(student)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Teacher Management</span>
                </CardTitle>
                <CardDescription>View and manage all teacher profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search teachers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Departments</SelectItem>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Teacher</TableHead>
                        <TableHead>Faculty ID</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Designation</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTeachers.map((teacher) => (
                        <TableRow key={teacher._id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={teacher.profilePhoto} />
                                <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{teacher.name}</div>
                                <div className="text-sm text-gray-500">{teacher.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">{teacher.facultyId}</TableCell>
                          <TableCell>{teacher.department}</TableCell>
                          <TableCell>{teacher.designation}</TableCell>
                          <TableCell>{teacher.assignedStudents.length}</TableCell>
                          <TableCell>
                            <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                              {teacher.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedTeacher(teacher)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-blue-600" />
                  <span>Activity Overview</span>
                </CardTitle>
                <CardDescription>Monitor all student activity submissions and approvals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activities.map((activity) => (
                        <TableRow key={activity._id}>
                          <TableCell className="font-medium">{activity.studentName}</TableCell>
                          <TableCell>{activity.activityName}</TableCell>
                          <TableCell>
                            <div>
                              <div>{activity.category}</div>
                              {activity.subCategory && (
                                <div className="text-sm text-gray-500">{activity.subCategory}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{activity.points}</span>
                              <span className="text-sm text-gray-500">/ {activity.maxPoints}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                activity.status === 'approved' ? 'default' : 
                                activity.status === 'rejected' ? 'destructive' : 'secondary'
                              }
                            >
                              {activity.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <AdminStudentProfile
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onStudentUpdated={handleStudentUpdated}
        />
      )}

      {/* Teacher Profile Modal */}
      {selectedTeacher && (
        <AdminTeacherProfile
          teacher={selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
          onTeacherUpdated={handleTeacherUpdated}
        />
      )}
    </div>
  );
}
