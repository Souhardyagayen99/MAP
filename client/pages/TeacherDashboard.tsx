import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserProfileDropdown from '@/components/UserProfileDropdown';
import NotificationDropdown from '@/components/NotificationDropdown';
import ActivityApprovalModal from '@/components/ActivityApprovalModal';
import TeacherActivityCreator from '@/components/TeacherActivityCreator';
import TeacherStudentProfile from '@/components/TeacherStudentProfile';
import { Users, CheckCircle, Clock, XCircle, Plus, Filter, Download, RefreshCw, Target, Award } from 'lucide-react';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  // Get user data from localStorage
  const getUserData = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      return JSON.parse(userData);
    }
    return {
      facultyId: 'FAC-CSE-001',
      department: 'Computer Science & Engineering'
    };
  };

  const userInfo = getUserData();

  // Sample activity data
  const sampleActivities = [
    {
      id: '1',
      studentName: 'Raj Patel',
      studentId: 'CSE-2021-001',
      activityName: 'Web Development Workshop',
      category: 'Technical Skills',
      level: 'College',
      date: '2024-03-10',
      marksObtained: '85',
      totalMarks: '100',
      grade: 'A',
      marksEvidence: 'Certificate with Marks',
      evidenceType: 'Certificate',
      remarks: 'Participated actively and completed all assignments',
      points: 5
    },
    {
      id: '2',
      studentName: 'Priya Sharma',
      studentId: 'CSE-2021-023',
      activityName: 'Inter-College Sports Competition',
      category: 'Sports & Cultural',
      level: 'District',
      date: '2024-03-11',
      marksObtained: '',
      totalMarks: '',
      grade: 'Runner-up',
      marksEvidence: 'Certificate',
      evidenceType: 'Certificate',
      remarks: 'Secured 2nd position in cricket tournament',
      points: 8
    }
  ];

  const handleViewActivity = (activityId: string) => {
    const activity = sampleActivities.find(a => a.id === activityId);
    setSelectedActivity(activity);
    setIsApprovalModalOpen(true);
  };

  const handleApproveActivity = (activityId: string, teacherRemarks: string, marksApproved: boolean, marksRemarks: string) => {
    console.log('Approving activity:', { activityId, teacherRemarks, marksApproved, marksRemarks });
    // In real app, this would call the API
    alert('Activity and marks approved successfully!');
  };

  const handleRejectActivity = (activityId: string, teacherRemarks: string) => {
    console.log('Rejecting activity:', { activityId, teacherRemarks });
    // In real app, this would call the API
    alert('Activity rejected.');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Teacher Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Prof. Jane Smith • {userInfo.department}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <NotificationDropdown userType="teacher" />
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
              <UserProfileDropdown
                userType="teacher"
                userName="Prof. Jane Smith"
                userEmail="jane.smith@sanjivani.edu.in"
                userId={userInfo.facultyId}
                department={userInfo.department}
                onThemeChange={handleThemeChange}
                currentTheme={theme}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activities">Create Activities</TabsTrigger>
            <TabsTrigger value="students">Student Management</TabsTrigger>
            <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-orange-600">24</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved Today</p>
                  <p className="text-2xl font-bold text-green-600">12</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Students at Risk</p>
                  <p className="text-2xl font-bold text-red-600">8</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-blue-600">156</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>



        {/* Class Compliance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Class Compliance Overview</CardTitle>
              <CardDescription>Student progress by year and department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">CSE Final Year</h4>
                    <p className="text-sm text-gray-600">45/48 students on track</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">94%</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">CSE Third Year</h4>
                    <p className="text-sm text-gray-600">38/42 students on track</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">90%</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">CSE Second Year</h4>
                    <p className="text-sm text-gray-600">35/44 students on track</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">80%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common teacher tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Create New Event
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Bulk Add Activities
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Class Report
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </CardContent>
          </Card>
            </div>
          </TabsContent>

          {/* Create Activities Tab */}
          <TabsContent value="activities">
            <TeacherActivityCreator 
              facultyId={userInfo.facultyId}
              onActivityCreated={() => {
                // Refresh data if needed
                console.log('Activity created successfully');
              }}
            />
          </TabsContent>

          {/* Student Management Tab */}
          <TabsContent value="students">
            <TeacherStudentProfile
              facultyId={userInfo.facultyId}
              enrollmentNumber=""
            />
          </TabsContent>

          {/* Pending Approvals Tab */}
          <TabsContent value="approvals">
            <Card>
          <CardHeader>
            <CardTitle>Pending Activity Approvals</CardTitle>
            <CardDescription>Review and approve student activity submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h4 className="font-medium">Raj Patel (CSE-2021-001)</h4>
                      <p className="text-sm text-gray-600">Web Development Workshop</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">Technical Skills</Badge>
                        <Badge variant="secondary">College Level</Badge>
                        <span className="text-xs text-gray-500">Submitted 2 days ago</span>
                      </div>
                      {/* Performance Details */}
                      <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium text-blue-800">Performance:</span>
                          <span>Marks: 85/100 (85%)</span>
                          <Badge variant="outline" className="text-xs">Grade: A</Badge>
                          <span className="text-orange-600">⚠️ Pending marks approval</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleViewActivity('1')}>
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600">
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button size="sm" onClick={() => handleViewActivity('1')}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Review & Approve
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h4 className="font-medium">Priya Sharma (CSE-2021-023)</h4>
                      <p className="text-sm text-gray-600">Inter-College Sports Competition</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">Sports & Cultural</Badge>
                        <Badge variant="secondary">District Level</Badge>
                        <span className="text-xs text-gray-500">Submitted 1 day ago</span>
                      </div>
                      {/* Performance Details */}
                      <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium text-green-800">Performance:</span>
                          <span>Position: 2nd Place</span>
                          <Badge variant="outline" className="text-xs">Grade: Runner-up</Badge>
                          <span className="text-orange-600">⚠️ Pending marks approval</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button size="sm" variant="outline" className="text-red-600">
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button size="sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h4 className="font-medium">Amit Kumar (CSE-2020-045)</h4>
                      <p className="text-sm text-gray-600">Blood Donation Camp Organization</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">Community Outreach</Badge>
                        <Badge variant="secondary">College Level</Badge>
                            <span className="text-xs text-gray-500">Submitted 3 days ago</span>
                      </div>
                      {/* Performance Details */}
                          <div className="mt-2 p-2 bg-purple-50 rounded text-xs">
                        <div className="flex items-center space-x-4">
                              <span className="font-medium text-purple-800">Performance:</span>
                              <span>Camp organized successfully</span>
                              <Badge variant="outline" className="text-xs">Grade: Excellent</Badge>
                              <span className="text-green-600">✅ Ready for approval</span>
                            </div>
                          </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">View Details</Button>
                  <Button size="sm" variant="outline" className="text-red-600">
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                      <Button size="sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Activity Approval Modal */}
      <ActivityApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        activity={selectedActivity}
        onApprove={handleApproveActivity}
        onReject={handleRejectActivity}
      />
    </div>
  );
}
