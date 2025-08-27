import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
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
  Eye
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
  address: string;
  dateOfBirth: string;
  profilePhoto: string;
  sscPercentage: number;
  hscPercentage: number;
  totalPoints: number;
  requiredPoints: number;
}

interface Activity {
  _id: string;
  activityName: string;
  category: string;
  subCategory?: string;
  level: string;
  date: string;
  points: number;
  maxPoints: number;
  status: string;
  evidenceUrl?: string;
  remarks?: string;
  teacherRemarks?: string;
  approvedDate?: string;
}

interface TeacherStudentProfileProps {
  facultyId: string;
  enrollmentNumber: string;
}

export default function TeacherStudentProfile({ facultyId, enrollmentNumber }: TeacherStudentProfileProps) {
  const [studentData, setStudentData] = useState<{ student: Student; activities: Activity[]; totalPoints: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudentData();
  }, [facultyId, enrollmentNumber]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/teachers/${facultyId}/students/${enrollmentNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch student data');
      }
      const data = await response.json();
      setStudentData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Error: {error}</p>
            <button 
              onClick={fetchStudentData}
              className="mt-2 text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!studentData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-600">
            <p>No student data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { student, activities, totalPoints } = studentData;
  const progress = Math.min((totalPoints / student.requiredPoints) * 100, 100);
  const approvedActivities = activities.filter(a => a.status === 'approved');
  const pendingActivities = activities.filter(a => a.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Student Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={student.profilePhoto} alt={student.name} />
              <AvatarFallback className="text-lg">
                {student.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{student.name}</CardTitle>
              <CardDescription className="text-lg">
                {student.enrollmentNumber} • {student.program}
              </CardDescription>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <Building className="h-4 w-4" />
                  <span>{student.department}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{student.year}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Hash className="h-4 w-4" />
                  <span>{student.division}</span>
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{student.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{student.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span>DOB: {new Date(student.dateOfBirth).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-4 w-4 text-gray-500" />
                <span>SSC: {student.sscPercentage || 'Not provided'}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-4 w-4 text-gray-500" />
                <span>HSC: {student.hscPercentage || 'Not provided'}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-gray-500" />
                <span>Points: {totalPoints} / {student.requiredPoints}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Points Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-600" />
            <span>Points Summary</span>
          </CardTitle>
          <CardDescription>Student's progress towards required points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalPoints}</div>
              <div className="text-sm text-gray-600">Current Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{student.requiredPoints}</div>
              <div className="text-sm text-gray-600">Required Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{Math.round(progress)}%</div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{approvedActivities.length}</div>
              <div className="text-sm text-gray-600">Approved Activities</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{totalPoints} / {student.requiredPoints} points</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Activities Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-600" />
            <span>Activities Overview</span>
          </CardTitle>
          <CardDescription>All student activities and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No activities submitted yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity._id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{activity.activityName}</div>
                        {activity.subCategory && (
                          <div className="text-sm text-gray-600">{activity.subCategory}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{activity.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          activity.level === 'advanced' ? 'default' : 
                          activity.level === 'intermediate' ? 'secondary' : 'outline'
                        }
                      >
                        {activity.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <span>{new Date(activity.date).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium text-green-600">{activity.points}</div>
                        <div className="text-xs text-gray-500">/ {activity.maxPoints}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          activity.status === 'approved' 
                            ? 'bg-green-100 text-green-800'
                            : activity.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {activity.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
