import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Filter, 
  Calendar, 
  Award, 
  Target, 
  Upload, 
  Plus,
  Clock,
  User,
  Trophy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ActivityTemplate {
  _id: string;
  name: string;
  description: string;
  category: string;
  subCategory?: string;
  level: string;
  points: number;
  maxPoints: number;
  evidenceType: string;
  requirements?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdBy: {
    _id: string;
    name: string;
    facultyId: string;
  };
  department: string;
  year?: string;
  division?: string;
}

interface StudentActivityBrowserProps {
  enrollmentNumber: string;
  department: string;
  year: string;
  division: string;
}

export default function StudentActivityBrowser({ 
  enrollmentNumber, 
  department, 
  year, 
  division 
}: StudentActivityBrowserProps) {
  const { toast } = useToast();
  const [activities, setActivities] = useState<ActivityTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    search: ''
  });
  const [selectedActivity, setSelectedActivity] = useState<ActivityTemplate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    evidenceUrl: '',
    remarks: ''
  });

  useEffect(() => {
    fetchActivities();
  }, [department, year, division]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        department,
        ...(year && { year }),
        ...(division && { division })
      });
      
      const response = await fetch(`/api/activity-templates?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      const data = await response.json();
      setActivities(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitActivity = async () => {
    if (!selectedActivity) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/activity-templates/${selectedActivity._id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enrollmentNumber,
          evidenceUrl: submissionData.evidenceUrl,
          remarks: submissionData.remarks
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit activity');
      }

      toast({
        title: "Success!",
        description: `Activity "${selectedActivity.name}" submitted successfully.`,
      });

      // Reset form and close dialog
      setSubmissionData({ evidenceUrl: '', remarks: '' });
      setSelectedActivity(null);
      
      // Refresh activities list
      fetchActivities();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit activity",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filters.category && activity.category !== filters.category) return false;
    if (filters.level && activity.level !== filters.level) return false;
    if (filters.search && !activity.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const categories = [...new Set(activities.map(a => a.category))];
  const levels = [
    { value: 'beginner', label: 'Beginner', color: 'bg-blue-100 text-blue-800' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'advanced', label: 'Advanced', color: 'bg-green-100 text-green-800' }
  ];

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
              onClick={fetchActivities}
              className="mt-2 text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Available Activities</span>
          </CardTitle>
          <CardDescription>
            Browse and participate in activities created by teachers to earn points
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="search"
                  placeholder="Search activities..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select value={filters.level} onValueChange={(value) => setFilters(prev => ({ ...prev, level: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All levels</SelectItem>
                  {levels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Results</Label>
              <div className="text-sm text-gray-600 pt-2">
                {filteredActivities.length} of {activities.length} activities
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities Grid */}
      {filteredActivities.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center text-gray-600">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No activities found</p>
              <p className="text-sm">Try adjusting your filters or check back later</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <Card key={activity._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{activity.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {activity.description}
                    </CardDescription>
                  </div>
                  <Badge 
                    className={
                      levels.find(l => l.value === activity.level)?.color || 'bg-gray-100 text-gray-800'
                    }
                  >
                    {activity.level}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Category</span>
                  <Badge variant="outline">{activity.category}</Badge>
                </div>
                
                {activity.subCategory && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Sub Category</span>
                    <span className="font-medium">{activity.subCategory}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Points</span>
                  <div className="flex items-center space-x-1">
                    <Trophy className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">{activity.points}</span>
                    {activity.maxPoints > activity.points && (
                      <span className="text-gray-500">/ {activity.maxPoints}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Evidence</span>
                  <span className="font-medium capitalize">{activity.evidenceType}</span>
                </div>
                
                {activity.requirements && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Requirements:</span> {activity.requirements}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{activity.createdBy.name}</span>
                  </span>
                  {activity.startDate && (
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(activity.startDate).toLocaleDateString()}</span>
                    </span>
                  )}
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" onClick={() => setSelectedActivity(activity)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Participate
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Submit Activity: {activity.name}</DialogTitle>
                      <DialogDescription>
                        Provide evidence and remarks for your participation
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="evidenceUrl">Evidence URL *</Label>
                        <Input
                          id="evidenceUrl"
                          placeholder="Link to photo, document, or video"
                          value={submissionData.evidenceUrl}
                          onChange={(e) => setSubmissionData(prev => ({ ...prev, evidenceUrl: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="remarks">Remarks</Label>
                        <Textarea
                          id="remarks"
                          placeholder="Additional comments about your participation"
                          value={submissionData.remarks}
                          onChange={(e) => setSubmissionData(prev => ({ ...prev, remarks: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedActivity(null);
                            setSubmissionData({ evidenceUrl: '', remarks: '' });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSubmitActivity}
                          disabled={isSubmitting || !submissionData.evidenceUrl}
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
