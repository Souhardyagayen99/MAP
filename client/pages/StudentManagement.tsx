import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DEPARTMENTS } from '@shared/sampleUsers';
import UserProfileDropdown from '@/components/UserProfileDropdown';
import StudentPhotoGallery from '@/components/StudentPhotoGallery';
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Images
} from 'lucide-react';

interface Student {
  id: string;
  enrollmentNumber: string;
  name: string;
  email: string;
  program: string;
  year: string;
  department: string;
  totalPoints: number;
  requiredPoints: number;
  status: 'on_track' | 'at_risk' | 'completed';
  joinDate: string;
  lastActivity: string;
}

const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    enrollmentNumber: 'CSE-2021-001',
    name: 'Raj Patel',
    email: 'raj.patel@sanjivani.edu.in',
    program: 'B.Tech',
    year: 'Final Year',
    department: 'Computer Science',
    totalPoints: 45,
    requiredPoints: 60,
    status: 'on_track',
    joinDate: '2021-08-15',
    lastActivity: '2024-03-10'
  },
  {
    id: '2',
    enrollmentNumber: 'CSE-2021-023',
    name: 'Priya Sharma',
    email: 'priya.sharma@sanjivani.edu.in',
    program: 'B.Tech',
    year: 'Final Year',
    department: 'Computer Science',
    totalPoints: 58,
    requiredPoints: 60,
    status: 'on_track',
    joinDate: '2021-08-15',
    lastActivity: '2024-03-12'
  },
  {
    id: '3',
    enrollmentNumber: 'CSE-2020-045',
    name: 'Amit Kumar',
    email: 'amit.kumar@sanjivani.edu.in',
    program: 'B.Tech',
    year: 'Final Year',
    department: 'Computer Science',
    totalPoints: 28,
    requiredPoints: 60,
    status: 'at_risk',
    joinDate: '2020-08-15',
    lastActivity: '2024-02-28'
  },
  {
    id: '4',
    enrollmentNumber: 'MBA-2022-012',
    name: 'Sneha Desai',
    email: 'sneha.desai@sanjivani.edu.in',
    program: 'MBA',
    year: 'Second Year',
    department: 'Management',
    totalPoints: 72,
    requiredPoints: 70,
    status: 'completed',
    joinDate: '2022-08-10',
    lastActivity: '2024-03-08'
  },
  {
    id: '5',
    enrollmentNumber: 'ECE-2021-078',
    name: 'Rohit Singh',
    email: 'rohit.singh@sanjivani.edu.in',
    program: 'B.Tech',
    year: 'Third Year',
    department: 'Electronics',
    totalPoints: 35,
    requiredPoints: 60,
    status: 'on_track',
    joinDate: '2021-08-15',
    lastActivity: '2024-03-11'
  }
];

export default function StudentManagement() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPhotoGalleryOpen, setIsPhotoGalleryOpen] = useState(false);
  const [selectedStudentForPhotos, setSelectedStudentForPhotos] = useState<{ id: string; name: string } | null>(null);

  const getStatusBadge = (status: Student['status']) => {
    switch (status) {
      case 'on_track':
        return <Badge className="bg-green-100 text-green-800">On Track</Badge>;
      case 'at_risk':
        return <Badge className="bg-red-100 text-red-800">At Risk</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: Student['status']) => {
    switch (status) {
      case 'on_track':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'at_risk':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProgram = !filterProgram || student.program === filterProgram;
    const matchesStatus = !filterStatus || student.status === filterStatus;
    
    return matchesSearch && matchesProgram && matchesStatus;
  });

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handleViewPhotos = (studentId: string, studentName: string) => {
    setSelectedStudentForPhotos({ id: studentId, name: studentName });
    setIsPhotoGalleryOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/admin')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Student Management</h1>
                <p className="text-sm text-gray-600">Manage all students in the system</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import Students
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <UserProfileDropdown
                userType="admin"
                userName="System Administrator"
                userEmail="admin@sanjivani.edu.in"
                userId="ADMIN-001"
              />
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogDescription>
                      Create a new student account in the MAP system.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Enter full name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="enrollment">Enrollment Number</Label>
                        <Input id="enrollment" placeholder="e.g., CSE-2024-001" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="student@sanjivani.edu.in" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="program">Program</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select program" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="B.Tech">B.Tech</SelectItem>
                            <SelectItem value="BCA">BCA</SelectItem>
                            <SelectItem value="MBA">MBA</SelectItem>
                            <SelectItem value="M.Tech">M.Tech</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEPARTMENTS.map((dept) => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsAddDialogOpen(false)}>
                        Add Student
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, enrollment number, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={filterProgram} onValueChange={setFilterProgram}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Programs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Programs</SelectItem>
                    <SelectItem value="B.Tech">B.Tech</SelectItem>
                    <SelectItem value="BCA">BCA</SelectItem>
                    <SelectItem value="MBA">MBA</SelectItem>
                    <SelectItem value="M.Tech">M.Tech</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="on_track">On Track</SelectItem>
                    <SelectItem value="at_risk">At Risk</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {selectedStudents.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">
                    {selectedStudents.length} student(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Selected
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Bulk Edit
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-blue-600">{students.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">On Track</p>
                  <p className="text-2xl font-bold text-green-600">
                    {students.filter(s => s.status === 'on_track').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">At Risk</p>
                  <p className="text-2xl font-bold text-red-600">
                    {students.filter(s => s.status === 'at_risk').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {students.filter(s => s.status === 'completed').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Students List</CardTitle>
                <CardDescription>
                  Showing {filteredStudents.length} of {students.length} students
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                  onChange={handleSelectAll}
                  className="rounded"
                />
                <Label>Select All</Label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Select</th>
                    <th className="text-left p-2">Student</th>
                    <th className="text-left p-2">Program</th>
                    <th className="text-left p-2">Progress</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Last Activity</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => handleSelectStudent(student.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-gray-600">{student.enrollmentNumber}</div>
                          <div className="text-xs text-gray-500">{student.email}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{student.program}</div>
                          <div className="text-sm text-gray-600">{student.year}</div>
                          <div className="text-xs text-gray-500">{student.department}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min((student.totalPoints / student.requiredPoints) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-600">
                          {student.totalPoints}/{student.requiredPoints} points
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(student.status)}
                          {getStatusBadge(student.status)}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-sm text-gray-600">
                          {new Date(student.lastActivity).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewPhotos(student.id, student.name)}
                            title="View Photos"
                          >
                            <Images className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Student Photo Gallery Modal */}
      {selectedStudentForPhotos && (
        <StudentPhotoGallery
          studentId={selectedStudentForPhotos.id}
          studentName={selectedStudentForPhotos.name}
          isOpen={isPhotoGalleryOpen}
          onClose={() => {
            setIsPhotoGalleryOpen(false);
            setSelectedStudentForPhotos(null);
          }}
        />
      )}
    </div>
  );
}
