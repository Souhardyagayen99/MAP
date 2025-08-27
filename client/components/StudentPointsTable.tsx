import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Award, Target, TrendingUp, Calendar, MapPin } from 'lucide-react';

interface ActivityPoints {
  id: string;
  activityName: string;
  category: string;
  level: string;
  grade: string;
  points: number;
  maxPoints: number;
  status: 'pending' | 'approved' | 'rejected';
  approvedDate?: string;
  location?: string;
  startDate: string;
  endDate: string;
}

interface StudentPointsTableProps {
  enrollmentNumber: string;
}

export default function StudentPointsTable({ enrollmentNumber }: StudentPointsTableProps) {
  const [activities, setActivities] = useState<ActivityPoints[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [targetPoints, setTargetPoints] = useState(60); // Default B.Tech requirement
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, [enrollmentNumber]);

  const loadActivities = async () => {
    try {
      // Try to fetch from backend first
      const response = await fetch(`/api/activities/student/${enrollmentNumber}`);
      if (response.ok) {
        const data = await response.json();
        const approvedActivities = data.filter((activity: any) => activity.status === 'approved');
        setActivities(approvedActivities);
        calculateTotalPoints(approvedActivities);
      } else {
        // Fallback to localStorage
        const storedActivities = JSON.parse(localStorage.getItem('studentActivities') || '[]');
        const approvedActivities = storedActivities.filter((activity: any) => 
          activity.studentId === enrollmentNumber && activity.status === 'approved'
        );
        setActivities(approvedActivities);
        calculateTotalPoints(approvedActivities);
      }
    } catch (error) {
      // Fallback to localStorage
      const storedActivities = JSON.parse(localStorage.getItem('studentActivities') || '[]');
      const approvedActivities = storedActivities.filter((activity: any) => 
        activity.studentId === enrollmentNumber && activity.status === 'approved'
      );
      setActivities(approvedActivities);
      calculateTotalPoints(approvedActivities);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPoints = (approvedActivities: ActivityPoints[]) => {
    const total = approvedActivities.reduce((sum, activity) => sum + activity.points, 0);
    setTotalPoints(total);
  };

  const getCategoryName = (categoryId: string) => {
    const categories: Record<string, string> = {
      'A': 'Technical Skills',
      'B': 'Sports & Cultural',
      'C': 'Community Outreach',
      'D': 'Innovation/IPR',
      'E': 'Leadership/Management'
    };
    return categories[categoryId] || categoryId;
  };

  const getLevelName = (levelId: string) => {
    const levels: Record<string, string> = {
      'college': 'College',
      'inter_college': 'Different College',
      'district': 'District',
      'state': 'State',
      'national': 'National',
      'international': 'International'
    };
    return levels[levelId] || levelId;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCategoryColor = (categoryId: string) => {
    const colors: Record<string, string> = {
      'A': 'bg-blue-100 text-blue-800',
      'B': 'bg-green-100 text-green-800',
      'C': 'bg-purple-100 text-purple-800',
      'D': 'bg-orange-100 text-orange-800',
      'E': 'bg-pink-100 text-pink-800'
    };
    return colors[categoryId] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Points Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-blue-600" />
            <span>MAP Points Summary</span>
          </CardTitle>
          <CardDescription>
            Your approved activities and accumulated points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totalPoints}</div>
              <div className="text-sm text-gray-600">Total Points Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{targetPoints}</div>
              <div className="text-sm text-gray-600">Target Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.max(0, targetPoints - totalPoints)}
              </div>
              <div className="text-sm text-gray-600">Points Remaining</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress to Target</span>
              <span>{Math.round((totalPoints / targetPoints) * 100)}%</span>
            </div>
            <Progress value={(totalPoints / targetPoints) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Activities Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Approved Activities</span>
          </CardTitle>
          <CardDescription>
            {activities.length} approved activities contributing to your MAP score
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Award className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>No approved activities yet.</p>
              <p className="text-sm">Submit activities and wait for faculty approval to see them here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <Card key={activity.id || index} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{activity.activityName}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getCategoryColor(activity.category)}>
                                {getCategoryName(activity.category)}
                              </Badge>
                              <Badge variant="outline">
                                {getLevelName(activity.level)}
                              </Badge>
                              {getStatusBadge(activity.status)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              {activity.points}
                            </div>
                            <div className="text-xs text-gray-500">points</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(activity.startDate).toLocaleDateString()} - {new Date(activity.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4" />
                            <span>Achievement: {activity.grade}</span>
                          </div>
                          {activity.location && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>{activity.location}</span>
                            </div>
                          )}
                        </div>
                        
                        {activity.approvedDate && (
                          <div className="text-xs text-gray-500">
                            Approved on: {new Date(activity.approvedDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
