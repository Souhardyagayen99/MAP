import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Hash, 
  GraduationCap, 
  Trophy, 
  Award, 
  Target, 
  X,
  Edit,
  Save,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  address: string;
  dateOfBirth: string;
  profilePhoto: string;
  sscPercentage: number;
  hscPercentage: number;
  totalPoints: number;
  requiredPoints: number;
  status: string;
  createdAt: string;
}

interface Activity {
  _id: string;
  activityName: string;
  category: string;
  subCategory: string;
  level: string;
  points: number;
  maxPoints: number;
  status: string;
  date: string;
  approvedBy?: string;
  approvedDate?: string;
  createdAt: string;
}

interface AdminStudentProfileProps {
  student: Student;
  onClose: () => void;
  onStudentUpdated: (student: Student) => void;
}

export default function AdminStudentProfile({ student, onClose, onStudentUpdated }: AdminStudentProfileProps) {
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState<Student>(student);

  useEffect(() => {
    fetchStudentActivities();
  }, [student.enrollmentNumber]);

  const fetchStudentActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/students/${student.enrollmentNumber}/activities`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Error fetching student activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/students/${student.enrollmentNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedStudent),
      });

      if (response.ok) {
        const updatedStudent = await response.json();
        onStudentUpdated(updatedStudent);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Student profile updated successfully",
        });
      } else {
        throw new Error('Failed to update student');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Error",
        description: "Failed to update student profile",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (newStatus: 'active' | 'inactive') => {
    try {
      const response = await fetch(`/api/admin/students/${student.enrollmentNumber}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedStudent = await response.json();
        onStudentUpdated(updatedStudent);
        toast({
          title: "Success",
          description: `Student status updated to ${newStatus}`,
        });
      } else {
        throw new Error('Failed to update student status');
      }
    } catch (error) {
      console.error('Error updating student status:', error);
      toast({
        title: "Error",
        description: "Failed to update student status",
        variant: "destructive",
      });
    }
  };

  const progressPercentage = (editedStudent.totalPoints / editedStudent.requiredPoints) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={editedStudent.profilePhoto} />
              <AvatarFallback>{editedStudent.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{editedStudent.name}</h2>
              <p className="text-gray-600">Enrollment: {editedStudent.enrollmentNumber}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditedStudent(student);
                    setIsEditing(false);
                  }} 
                  size="sm"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditing(true)} size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant={editedStudent.status === 'active' ? 'destructive' : 'default'}
                  onClick={() => handleStatusChange(editedStudent.status === 'active' ? 'inactive' : 'active')}
                  size="sm"
                >
                  {editedStudent.status === 'active' ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Activate
                    </>
                  )}
                </Button>
              </>
            )}
            <Button variant="outline" onClick={onClose} size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={editedStudent.name}
                    onChange={(e) => setEditedStudent(prev => ({...prev, name: e.target.value}))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editedStudent.email}
                    onChange={(e) => setEditedStudent(prev => ({...prev, email: e.target.value}))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={editedStudent.phone || ''}
                    onChange={(e) => setEditedStudent(prev => ({...prev, phone: e.target.value}))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    value={editedStudent.dateOfBirth || ''}
                    onChange={(e) => setEditedStudent(prev => ({...prev, dateOfBirth: e.target.value}))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-green-600" />
                <span>Academic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    value={editedStudent.department}
                    onChange={(e) => setEditedStudent(prev => ({...prev, department: e.target.value}))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Program</label>
                  <input
                    type="text"
                    value={editedStudent.program}
                    onChange={(e) => setEditedStudent(prev => ({...prev, program: e.target.value}))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Year</label>
                  <input
                    type="text"
                    value={editedStudent.year}
                    onChange={(e) => setEditedStudent(prev => ({...prev, year: e.target.value}))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Division</label>
                  <input
                    type="text"
                    value={editedStudent.division}
                    onChange={(e) => setEditedStudent(prev => ({...prev, division: e.target.value}))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Records */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-600" />
                <span>Academic Records</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">SSC Percentage</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={editedStudent.sscPercentage || ''}
                    onChange={(e) => setEditedStudent(prev => ({...prev, sscPercentage: parseFloat(e.target.value) || 0}))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
                    placeholder="Enter SSC percentage"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">HSC Percentage</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={editedStudent.hscPercentage || ''}
                    onChange={(e) => setEditedStudent(prev => ({...prev, hscPercentage: parseFloat(e.target.value) || 0}))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
                    placeholder="Enter HSC percentage"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Points Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <span>Points Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Current Points</span>
                  <span className="text-2xl font-bold text-blue-600">{editedStudent.totalPoints}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Required Points</span>
                  <span className="text-lg text-gray-600">{editedStudent.requiredPoints}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <Badge variant={editedStudent.status === 'active' ? 'default' : 'secondary'}>
                    {editedStudent.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-red-600" />
                <span>Activities ({activities.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading activities...</p>
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No activities found for this student</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Activity</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activities.map((activity) => (
                        <TableRow key={activity._id}>
                          <TableCell className="font-medium">{activity.activityName}</TableCell>
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
                            {new Date(activity.date).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
