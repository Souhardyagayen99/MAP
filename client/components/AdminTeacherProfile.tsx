import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Hash, 
  Users, 
  Trophy, 
  X,
  Edit,
  Save,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Teacher {
  _id: string;
  facultyId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  profilePhoto: string;
  assignedStudents: Array<{
    _id: string;
    name: string;
    enrollmentNumber: string;
    department: string;
    year: string;
  }>;
  status: string;
  createdAt: string;
}

interface ActivityTemplate {
  _id: string;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  level: string;
  points: number;
  maxPoints: number;
  isActive: boolean;
  createdAt: string;
}

interface AdminTeacherProfileProps {
  teacher: Teacher;
  onClose: () => void;
  onTeacherUpdated: (teacher: Teacher) => void;
}

export default function AdminTeacherProfile({ teacher, onClose, onTeacherUpdated }: AdminTeacherProfileProps) {
  const { toast } = useToast();
  const [activityTemplates, setActivityTemplates] = useState<ActivityTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeacher, setEditedTeacher] = useState<Teacher>(teacher);

  useEffect(() => {
    fetchTeacherActivities();
  }, [teacher.facultyId]);

  const fetchTeacherActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/teachers/${teacher.facultyId}/activities`);
      if (response.ok) {
        const data = await response.json();
        setActivityTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching teacher activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/teachers/${teacher.facultyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedTeacher),
      });

      if (response.ok) {
        const updatedTeacher = await response.json();
        onTeacherUpdated(updatedTeacher);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Teacher profile updated successfully",
        });
      } else {
        throw new Error('Failed to update teacher');
      }
    } catch (error) {
      console.error('Error updating teacher:', error);
      toast({
        title: "Error",
        description: "Failed to update teacher profile",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (newStatus: 'active' | 'inactive') => {
    try {
      const response = await fetch(`/api/admin/teachers/${teacher.facultyId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedTeacher = await response.json();
        onTeacherUpdated(updatedTeacher);
        toast({
          title: "Success",
          description: `Teacher status updated to ${newStatus}`,
        });
      } else {
        throw new Error('Failed to update teacher status');
      }
    } catch (error) {
      console.error('Error updating teacher status:', error);
      toast({
        title: "Error",
        description: "Failed to update teacher status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={editedTeacher.profilePhoto} />
              <AvatarFallback>{editedTeacher.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{editedTeacher.name}</h2>
              <p className="text-gray-600">Faculty ID: {editedTeacher.facultyId}</p>
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
                    setEditedTeacher(teacher);
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
                  variant={editedTeacher.status === 'active' ? 'destructive' : 'default'}
                  onClick={() => handleStatusChange(editedTeacher.status === 'active' ? 'inactive' : 'active')}
                  size="sm"
                >
                  {editedTeacher.status === 'active' ? (
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
                    value={editedTeacher.name}
                    onChange={(e) => setEditedTeacher(prev => ({...prev, name: e.target.value}))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editedTeacher.email}
                    onChange={(e) => setEditedTeacher(prev => ({...prev, email: e.target.value}))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={editedTeacher.phone || ''}
                    onChange={(e) => setEditedTeacher(prev => ({...prev, phone: e.target.value}))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Faculty ID</label>
                  <input
                    type="text"
                    value={editedTeacher.facultyId}
                    disabled
                    className="w-full px-3 py-2 border rounded-md bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-green-600" />
                <span>Professional Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    value={editedTeacher.department}
                    onChange={(e) => setEditedTeacher(prev => ({...prev, department: e.target.value}))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Designation</label>
                  <input
                    type="text"
                    value={editedTeacher.designation}
                    onChange={(e) => setEditedTeacher(prev => ({...prev, designation: e.target.value}))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="flex items-center space-x-2">
                    <Badge variant={editedTeacher.status === 'active' ? 'default' : 'secondary'}>
                      {editedTeacher.status}
                    </Badge>
                    {!isEditing && (
                      <span className="text-sm text-gray-500">
                        {editedTeacher.status === 'active' ? 'Active faculty member' : 'Inactive faculty member'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Member Since</label>
                  <input
                    type="text"
                    value={new Date(editedTeacher.createdAt).toLocaleDateString()}
                    disabled
                    className="w-full px-3 py-2 border rounded-md bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Students */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span>Assigned Students ({editedTeacher.assignedStudents.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editedTeacher.assignedStudents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No students assigned to this teacher</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Enrollment</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Year</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editedTeacher.assignedStudents.map((student) => (
                        <TableRow key={student._id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell className="font-mono">{student.enrollmentNumber}</TableCell>
                          <TableCell>{student.department}</TableCell>
                          <TableCell>{student.year}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Created Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <span>Created Activities ({activityTemplates.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading activities...</p>
                </div>
              ) : activityTemplates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No activities created by this teacher</p>
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
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activityTemplates.map((template) => (
                        <TableRow key={template._id}>
                          <TableCell className="font-medium">{template.name}</TableCell>
                          <TableCell>
                            <div>
                              <div>{template.category}</div>
                              {template.subCategory && (
                                <div className="text-sm text-gray-500">{template.subCategory}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{template.points}</span>
                              <span className="text-sm text-gray-500">/ {template.maxPoints}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={template.isActive ? 'default' : 'secondary'}>
                              {template.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {new Date(template.createdAt).toLocaleDateString()}
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
