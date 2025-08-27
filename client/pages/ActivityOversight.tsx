import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Users,
  Trophy
} from 'lucide-react';

interface ActivitySubmission {
  id: string;
  studentName: string;
  studentId: string;
  teacherName: string;
  activityName: string;
  category: string;
  level: string;
  points: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  reviewedDate?: string;
  remarks?: string;
}

const MOCK_ACTIVITIES: ActivitySubmission[] = [
  {
    id: '1',
    studentName: 'Raj Patel',
    studentId: 'CSE-2021-001',
    teacherName: 'Dr. Jane Smith',
    activityName: 'Web Development Workshop',
    category: 'Technical Skills',
    level: 'College',
    points: 5,
    status: 'approved',
    submittedDate: '2024-03-10',
    reviewedDate: '2024-03-11',
    remarks: 'Excellent participation and project presentation'
  },
  {
    id: '2',
    studentName: 'Priya Sharma',
    studentId: 'CSE-2021-023',
    teacherName: 'Prof. Rajesh Kumar',
    activityName: 'Inter-College Cricket',
    category: 'Sports & Cultural',
    level: 'District',
    points: 8,
    status: 'pending',
    submittedDate: '2024-03-12'
  },
  {
    id: '3',
    studentName: 'Amit Kumar',
    studentId: 'CSE-2020-045',
    teacherName: 'Dr. Priya Sharma',
    activityName: 'Blood Donation Camp',
    category: 'Community Outreach',
    level: 'College',
    points: 3,
    status: 'approved',
    submittedDate: '2024-03-08',
    reviewedDate: '2024-03-09',
    remarks: 'Well organized community service'
  },
  {
    id: '4',
    studentName: 'Sneha Desai',
    studentId: 'MBA-2022-012',
    teacherName: 'Dr. Sneha Desai',
    activityName: 'Startup Pitch Competition',
    category: 'Innovation/IPR',
    level: 'State',
    points: 12,
    status: 'rejected',
    submittedDate: '2024-03-05',
    reviewedDate: '2024-03-06',
    remarks: 'Insufficient evidence provided'
  },
  {
    id: '5',
    studentName: 'Rohit Singh',
    studentId: 'ECE-2021-078',
    teacherName: 'Prof. Amit Patil',
    activityName: 'Student Council Election',
    category: 'Leadership',
    level: 'College',
    points: 6,
    status: 'pending',
    submittedDate: '2024-03-11'
  }
];

export default function ActivityOversight() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivitySubmission[]>(MOCK_ACTIVITIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusBadge = (status: ActivitySubmission['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: ActivitySubmission['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.activityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || activity.category === filterCategory;
    const matchesStatus = !filterStatus || activity.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStats = () => {
    const total = activities.length;
    const pending = activities.filter(a => a.status === 'pending').length;
    const approved = activities.filter(a => a.status === 'approved').length;
    const rejected = activities.filter(a => a.status === 'rejected').length;
    const totalPoints = activities.filter(a => a.status === 'approved').reduce((sum, a) => sum + a.points, 0);

    return { total, pending, approved, rejected, totalPoints };
  };

  const getCategoryStats = () => {
    const categories = ['Technical Skills', 'Sports & Cultural', 'Community Outreach', 'Innovation/IPR', 'Leadership'];
    return categories.map(category => ({
      name: category,
      count: activities.filter(a => a.category === category).length,
      approved: activities.filter(a => a.category === category && a.status === 'approved').length,
      pending: activities.filter(a => a.category === category && a.status === 'pending').length
    }));
  };

  const stats = getStats();
  const categoryStats = getCategoryStats();

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
                <h1 className="text-lg font-bold text-gray-900">Activity Oversight</h1>
                <p className="text-sm text-gray-600">Monitor and analyze all system activities</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activities">All Activities</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Activities</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                      </div>
                      <Trophy className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Approved</p>
                        <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Rejected</p>
                        <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                      </div>
                      <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Points Awarded</p>
                        <p className="text-2xl font-bold text-purple-600">{stats.totalPoints}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>Activity distribution across MAP categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryStats.map((category) => (
                      <div key={category.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{category.name}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-600">Total: {category.count}</span>
                            <span className="text-sm text-green-600">Approved: {category.approved}</span>
                            <span className="text-sm text-yellow-600">Pending: {category.pending}</span>
                          </div>
                        </div>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${category.count > 0 ? (category.approved / category.count) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity Submissions</CardTitle>
                  <CardDescription>Latest activities requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(activity.status)}
                            <div>
                              <h4 className="font-medium">{activity.activityName}</h4>
                              <p className="text-sm text-gray-600">
                                {activity.studentName} ({activity.studentId}) • {activity.category}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">{activity.points} pts</Badge>
                          {getStatusBadge(activity.status)}
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* All Activities Tab */}
          <TabsContent value="activities">
            <div className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search by student name, activity, or ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Categories</SelectItem>
                          <SelectItem value="Technical Skills">Technical Skills</SelectItem>
                          <SelectItem value="Sports & Cultural">Sports & Cultural</SelectItem>
                          <SelectItem value="Community Outreach">Community Outreach</SelectItem>
                          <SelectItem value="Innovation/IPR">Innovation/IPR</SelectItem>
                          <SelectItem value="Leadership">Leadership</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Activities Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Activity Submissions</CardTitle>
                  <CardDescription>
                    Showing {filteredActivities.length} of {activities.length} activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Student</th>
                          <th className="text-left p-2">Activity</th>
                          <th className="text-left p-2">Category</th>
                          <th className="text-left p-2">Points</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Teacher</th>
                          <th className="text-left p-2">Date</th>
                          <th className="text-left p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredActivities.map((activity) => (
                          <tr key={activity.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">
                              <div>
                                <div className="font-medium">{activity.studentName}</div>
                                <div className="text-sm text-gray-600">{activity.studentId}</div>
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="font-medium">{activity.activityName}</div>
                              <div className="text-sm text-gray-600">{activity.level} Level</div>
                            </td>
                            <td className="p-2">
                              <Badge variant="outline">{activity.category}</Badge>
                            </td>
                            <td className="p-2">
                              <span className="font-medium">{activity.points}</span>
                            </td>
                            <td className="p-2">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(activity.status)}
                                {getStatusBadge(activity.status)}
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="text-sm">{activity.teacherName}</div>
                            </td>
                            <td className="p-2">
                              <div className="text-sm">
                                {new Date(activity.submittedDate).toLocaleDateString()}
                              </div>
                              {activity.reviewedDate && (
                                <div className="text-xs text-gray-500">
                                  Reviewed: {new Date(activity.reviewedDate).toLocaleDateString()}
                                </div>
                              )}
                            </td>
                            <td className="p-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Analytics</CardTitle>
                  <CardDescription>Detailed insights and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Approval Rate by Category</h3>
                      <div className="space-y-3">
                        {categoryStats.map((category) => (
                          <div key={category.name} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{category.name}</span>
                              <span>{category.count > 0 ? Math.round((category.approved / category.count) * 100) : 0}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${category.count > 0 ? (category.approved / category.count) * 100 : 0}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Activity Trends</h3>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span>Average Processing Time</span>
                            <span className="font-medium">2.3 days</span>
                          </div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span>Most Active Category</span>
                            <span className="font-medium">Technical Skills</span>
                          </div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span>Peak Submission Day</span>
                            <span className="font-medium">Wednesday</span>
                          </div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span>Average Points per Activity</span>
                            <span className="font-medium">6.8</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
