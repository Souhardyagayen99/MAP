import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserProfileDropdown from '@/components/UserProfileDropdown';
import NotificationDropdown from '@/components/NotificationDropdown';
import AdvancedSearch from '@/components/AdvancedSearch';
import UserInfoCard from '@/components/UserInfoCard';
import StudentPointsTable from '@/components/StudentPointsTable';
import StudentActivityBrowser from '@/components/StudentActivityBrowser';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  GraduationCap,
  Plus,
  Trophy,
  Calendar,
  FileText,
  BarChart3,
  MapPin,
  Search,
  Filter,
  RefreshCw,
  Award,
  Target,
  Eye,
  Pencil
} from 'lucide-react';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);

  // Get user data from localStorage
  const getUserData = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      return JSON.parse(userData);
    }
    return {
      enrollmentNumber: 'CSE-2021-001',
      name: 'Demo Student',
      email: 'demo.student@sanjivani.edu.in',
      department: 'Computer Science & Engineering',
      year: 'Final Year',
      division: 'Division A'
    };
  };

  const userInfo = getUserData();

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
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Student Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {userInfo.department} • {userInfo.year} • {userInfo.division}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <AdvancedSearch userType="student" />
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <NotificationDropdown userType="student" />
              <Button size="sm" onClick={() => navigate('/student/activities')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
              <UserProfileDropdown
                userType="student"
                userName={userInfo.name || 'Student User'}
                userEmail={userInfo.email || 'student@sanjivani.edu.in'}
                userId={userInfo.enrollmentNumber}
                department={userInfo.department}
                year={userInfo.year}
                division={userInfo.division}
                onThemeChange={handleThemeChange}
                currentTheme={theme}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="points">Points & Activities</TabsTrigger>
            <TabsTrigger value="browse">Browse Activities</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            {/* Welcome Section with User Info */}
            <div className="mb-8">
              <UserInfoCard
                userType="student"
                userName={userInfo.name || 'Student User'}
                userEmail={userInfo.email || 'student@sanjivani.edu.in'}
                userId={userInfo.enrollmentNumber}
                department={userInfo.department}
                year={userInfo.year}
                division={userInfo.division}
              />
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Yearly Progress</CardTitle>
                  <CardDescription>Track your MAP points for Academic Year 2023-24</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Total Points Earned</span>
                        <span className="font-medium">45 / 100</span>
                      </div>
                      <Progress value={75} className="h-3" />
                    </div>
                    
                    <div className="grid grid-cols-5 gap-4 mt-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">12</div>
                        <div className="text-xs text-gray-600">Technical</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-accent">8</div>
                        <div className="text-xs text-gray-600">Sports</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">10</div>
                        <div className="text-xs text-gray-600">Community</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">9</div>
                        <div className="text-xs text-gray-600">Innovation</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">6</div>
                        <div className="text-xs text-gray-600">Leadership</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pending Approvals</span>
                    <Badge variant="secondary">3</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Approved Activities</span>
                    <Badge variant="outline">18</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Submissions</span>
                    <Badge variant="outline">22</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Compliance Status</span>
                    <Badge className="bg-green-100 text-green-800">On Track</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Your latest submissions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const activities = JSON.parse(localStorage.getItem('studentActivities') || '[]');
                      const recentActivities = activities.slice(-3).reverse();

                      if (recentActivities.length === 0) {
                        return (
                          <div className="text-center py-6 text-gray-500">
                            <Trophy className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No activities submitted yet</p>
                            <p className="text-xs">Click "Add Activity" to get started</p>
                          </div>
                        );
                      }

                      return recentActivities.map((activity: any, index: number) => (
                        <div key={activity.id || index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Trophy className={`h-5 w-5 mt-1 ${
                            activity.status === 'approved' ? 'text-green-600' :
                            activity.status === 'rejected' ? 'text-red-600' : 'text-accent'
                          }`} />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{activity.activityName}</h4>
                            <p className="text-xs text-gray-600">
                              {activity.categoryId === 'A' ? 'Technical Skills' :
                               activity.categoryId === 'B' ? 'Sports & Cultural' :
                               activity.categoryId === 'C' ? 'Community Outreach' :
                               activity.categoryId === 'D' ? 'Innovation/IPR' : 'Leadership'} • {activity.level} Level
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <Badge
                                className={`text-xs ${
                                  activity.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  activity.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {activity.status === 'pending' ? 'Pending' :
                                 activity.status === 'approved' ? 'Approved' : 'Rejected'}
                              </Badge>
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="outline" onClick={() => { setSelectedActivity(activity); setViewOpen(true); }}>
                                  <Eye className="h-4 w-4 mr-1" /> View
                                </Button>
                                <Button size="sm" variant="secondary" onClick={() => navigate(`/student/activities?editId=${activity.id}`)}>
                                  <Pencil className="h-4 w-4 mr-1" /> Edit
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Activities you can participate in</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Calendar className="h-5 w-5 text-primary mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Annual Tech Fest</h4>
                        <p className="text-xs text-gray-600">Multiple categories available</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">March 15-17, 2024</span>
                          <Button size="sm" variant="outline">Register</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Calendar className="h-5 w-5 text-primary mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Startup Pitch Competition</h4>
                        <p className="text-xs text-gray-600">Innovation & Entrepreneurship</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">March 20, 2024</span>
                          <Button size="sm" variant="outline">Register</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Calendar className="h-5 w-5 text-primary mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">NSS Community Service</h4>
                        <p className="text-xs text-gray-600">Community Outreach</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">March 25, 2024</span>
                          <Button size="sm" variant="outline">Join</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button className="h-16 flex-col space-y-2" onClick={() => navigate('/student/activities')}>
                <Plus className="h-6 w-6" />
                <span>Add Activity</span>
              </Button>

              <Button variant="outline" className="h-16 flex-col space-y-2" onClick={() => navigate('/student/analytics')}>
                <BarChart3 className="h-6 w-6" />
                <span>View Analytics</span>
              </Button>

              <Button variant="outline" className="h-16 flex-col space-y-2" onClick={() => navigate('/student/map')}>
                <MapPin className="h-6 w-6" />
                <span>Activity Map</span>
              </Button>

              <Button variant="outline" className="h-16 flex-col space-y-2">
                <FileText className="h-6 w-6" />
                <span>Generate Report</span>
              </Button>
            </div>

            {/* View Activity Dialog */}
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Activity Details</DialogTitle>
                </DialogHeader>
                {selectedActivity && (
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {selectedActivity.activityName}</div>
                    <div><strong>Category:</strong> {selectedActivity.categoryId}</div>
                    <div><strong>Level:</strong> {selectedActivity.level}</div>
                    {selectedActivity.startDate && selectedActivity.endDate && (
                      <div><strong>Dates:</strong> {new Date(selectedActivity.startDate).toLocaleDateString()} - {new Date(selectedActivity.endDate).toLocaleDateString()}</div>
                    )}
                    {selectedActivity.location?.address && (
                      <div><strong>Location:</strong> {selectedActivity.location.address}</div>
                    )}
                    <div><strong>Status:</strong> {selectedActivity.status}</div>
                    <div><strong>Points:</strong> {selectedActivity.points}</div>
                    {selectedActivity.remarks && (<div><strong>Remarks:</strong> {selectedActivity.remarks}</div>)}
                    <div className="pt-3">
                      <Button size="sm" onClick={() => { setViewOpen(false); navigate(`/student/activities?editId=${selectedActivity.id}`); }}>
                        <Pencil className="h-4 w-4 mr-1" /> Edit Activity
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Points & Activities Tab */}
          <TabsContent value="points">
            <StudentPointsTable enrollmentNumber={userInfo.enrollmentNumber} />
          </TabsContent>

          {/* Browse Activities Tab */}
          <TabsContent value="browse">
            <StudentActivityBrowser 
              enrollmentNumber={userInfo.enrollmentNumber}
              department={userInfo.department}
              year={userInfo.year}
              division={userInfo.division}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
