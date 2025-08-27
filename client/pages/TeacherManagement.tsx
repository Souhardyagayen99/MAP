import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Users,
  CheckCircle,
  Clock,
  Shield,
  Mail,
  Phone,
  MoreHorizontal
} from 'lucide-react';
import { DEPARTMENTS } from '@shared/sampleUsers';

interface Teacher {
  id: string;
  facultyId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  experience: number;
  studentsAssigned: number;
  activitiesApproved: number;
  pendingApprovals: number;
  status: 'active' | 'inactive' | 'on_leave';
  joinDate: string;
  lastLogin: string;
  permissions: string[];
}

const MOCK_TEACHERS: Teacher[] = [
  {
    id: '1',
    facultyId: 'FAC-CSE-001',
    name: 'Dr. Jane Smith',
    email: 'jane.smith@sanjivani.edu.in',
    phone: '+91 9876543210',
    department: 'Computer Science',
    designation: 'Professor',
    experience: 15,
    studentsAssigned: 45,
    activitiesApproved: 234,
    pendingApprovals: 12,
    status: 'active',
    joinDate: '2015-07-01',
    lastLogin: '2024-03-12',
    permissions: ['approve_activities', 'manage_students', 'create_events']
  },
  {
    id: '2',
    facultyId: 'FAC-CSE-002',
    name: 'Prof. Rajesh Kumar',
    email: 'rajesh.kumar@sanjivani.edu.in',
    phone: '+91 9876543211',
    department: 'Computer Science',
    designation: 'Associate Professor',
    experience: 12,
    studentsAssigned: 38,
    activitiesApproved: 189,
    pendingApprovals: 8,
    status: 'active',
    joinDate: '2018-08-15',
    lastLogin: '2024-03-11',
    permissions: ['approve_activities', 'manage_students']
  },
  {
    id: '3',
    facultyId: 'FAC-ECE-001',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma.faculty@sanjivani.edu.in',
    phone: '+91 9876543212',
    department: 'Electronics',
    designation: 'Assistant Professor',
    experience: 8,
    studentsAssigned: 32,
    activitiesApproved: 145,
    pendingApprovals: 5,
    status: 'active',
    joinDate: '2020-01-10',
    lastLogin: '2024-03-10',
    permissions: ['approve_activities']
  },
  {
    id: '4',
    facultyId: 'FAC-MECH-001',
    name: 'Prof. Amit Patil',
    email: 'amit.patil@sanjivani.edu.in',
    phone: '+91 9876543213',
    department: 'Mechanical',
    designation: 'Professor',
    experience: 18,
    studentsAssigned: 42,
    activitiesApproved: 278,
    pendingApprovals: 15,
    status: 'active',
    joinDate: '2012-03-20',
    lastLogin: '2024-03-09',
    permissions: ['approve_activities', 'manage_students', 'create_events', 'system_admin']
  },
  {
    id: '5',
    facultyId: 'FAC-MBA-001',
    name: 'Dr. Sneha Desai',
    email: 'sneha.desai.faculty@sanjivani.edu.in',
    phone: '+91 9876543214',
    department: 'Management',
    designation: 'Associate Professor',
    experience: 10,
    studentsAssigned: 28,
    activitiesApproved: 167,
    pendingApprovals: 3,
    status: 'on_leave',
    joinDate: '2019-06-05',
    lastLogin: '2024-02-28',
    permissions: ['approve_activities', 'manage_students']
  }
];

export default function TeacherManagement() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getStatusBadge = (status: Teacher['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'on_leave':
        return <Badge className="bg-yellow-100 text-yellow-800">On Leave</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: Teacher['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inactive':
        return <Clock className="h-4 w-4 text-gray-600" />;
      case 'on_leave':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.facultyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !filterDepartment || teacher.department === filterDepartment;
    const matchesStatus = !filterStatus || teacher.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleSelectTeacher = (teacherId: string) => {
    setSelectedTeachers(prev => 
      prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTeachers.length === filteredTeachers.length) {
      setSelectedTeachers([]);
    } else {
      setSelectedTeachers(filteredTeachers.map(t => t.id));
    }
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
                <h1 className="text-lg font-bold text-gray-900">Teacher Management</h1>
                <p className="text-sm text-gray-600">Manage faculty members and their permissions</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import Teachers
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Teacher
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Teacher</DialogTitle>
                    <DialogDescription>
                      Create a new faculty account in the MAP system.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Enter full name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="facultyId">Faculty ID</Label>
                        <Input id="facultyId" placeholder="e.g., FAC-CSE-001" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="faculty@sanjivani.edu.in" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="+91 9876543210" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
                      <div className="space-y-2">
                        <Label htmlFor="designation">Designation</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select designation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Professor">Professor</SelectItem>
                            <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                            <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                            <SelectItem value="Lecturer">Lecturer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="permissions">Permissions</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="approve_activities" className="rounded" />
                          <Label htmlFor="approve_activities" className="text-sm">Approve Activities</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="manage_students" className="rounded" />
                          <Label htmlFor="manage_students" className="text-sm">Manage Students</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="create_events" className="rounded" />
                          <Label htmlFor="create_events" className="text-sm">Create Events</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="system_admin" className="rounded" />
                          <Label htmlFor="system_admin" className="text-sm">System Admin</Label>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsAddDialogOpen(false)}>
                        Add Teacher
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
                    placeholder="Search by name, faculty ID, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Departments</SelectItem>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {selectedTeachers.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">
                    {selectedTeachers.length} teacher(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Selected
                    </Button>
                    <Button size="sm" variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      Manage Permissions
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
                  <p className="text-sm text-gray-600">Total Teachers</p>
                  <p className="text-2xl font-bold text-blue-600">{teachers.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {teachers.filter(t => t.status === 'active').length}
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
                  <p className="text-sm text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {teachers.reduce((sum, t) => sum + t.pendingApprovals, 0)}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Approvals</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {teachers.reduce((sum, t) => sum + t.activitiesApproved, 0)}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teachers Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Teachers List</CardTitle>
                <CardDescription>
                  Showing {filteredTeachers.length} of {teachers.length} teachers
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedTeachers.length === filteredTeachers.length && filteredTeachers.length > 0}
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
                    <th className="text-left p-2">Teacher</th>
                    <th className="text-left p-2">Department</th>
                    <th className="text-left p-2">Performance</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Permissions</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={selectedTeachers.includes(teacher.id)}
                          onChange={() => handleSelectTeacher(teacher.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{teacher.name}</div>
                          <div className="text-sm text-gray-600">{teacher.facultyId}</div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {teacher.email}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {teacher.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{teacher.department}</div>
                          <div className="text-sm text-gray-600">{teacher.designation}</div>
                          <div className="text-xs text-gray-500">{teacher.experience} years exp.</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="space-y-1">
                          <div className="text-xs text-gray-600">
                            Students: {teacher.studentsAssigned}
                          </div>
                          <div className="text-xs text-gray-600">
                            Approved: {teacher.activitiesApproved}
                          </div>
                          <div className="text-xs text-orange-600">
                            Pending: {teacher.pendingApprovals}
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(teacher.status)}
                          {getStatusBadge(teacher.status)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Last login: {new Date(teacher.lastLogin).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex flex-wrap gap-1">
                          {teacher.permissions.slice(0, 2).map(permission => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission.replace('_', ' ')}
                            </Badge>
                          ))}
                          {teacher.permissions.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{teacher.permissions.length - 2}
                            </Badge>
                          )}
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
                          <Button size="sm" variant="outline">
                            <Shield className="h-4 w-4" />
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
    </div>
  );
}
