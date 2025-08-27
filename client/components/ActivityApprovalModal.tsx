import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle, 
  XCircle, 
  Trophy, 
  Calendar, 
  FileText, 
  User,
  Award,
  Target
} from 'lucide-react';

interface ActivityData {
  id: string;
  studentName: string;
  studentId: string;
  activityName: string;
  category: string;
  level: string;
  date: string;
  marksObtained?: string;
  totalMarks?: string;
  grade?: string;
  marksEvidence?: string;
  evidenceType: string;
  remarks?: string;
  points: number;
}

interface ActivityApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: ActivityData | null;
  onApprove: (activityId: string, teacherRemarks: string, marksApproved: boolean, marksRemarks: string) => void;
  onReject: (activityId: string, teacherRemarks: string) => void;
}

export default function ActivityApprovalModal({
  isOpen,
  onClose,
  activity,
  onApprove,
  onReject
}: ActivityApprovalModalProps) {
  const [teacherRemarks, setTeacherRemarks] = useState('');
  const [marksApproved, setMarksApproved] = useState(true);
  const [marksRemarks, setMarksRemarks] = useState('');
  const [adjustedMarks, setAdjustedMarks] = useState('');

  if (!activity) return null;

  const handleApprove = () => {
    onApprove(activity.id, teacherRemarks, marksApproved, marksRemarks);
    handleClose();
  };

  const handleReject = () => {
    onReject(activity.id, teacherRemarks);
    handleClose();
  };

  const handleClose = () => {
    setTeacherRemarks('');
    setMarksApproved(true);
    setMarksRemarks('');
    setAdjustedMarks('');
    onClose();
  };

  const calculatePercentage = () => {
    if (activity.marksObtained && activity.totalMarks) {
      return ((parseFloat(activity.marksObtained) / parseFloat(activity.totalMarks)) * 100).toFixed(2);
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Activity Approval - {activity.activityName}</span>
          </DialogTitle>
          <DialogDescription>
            Review and approve the activity submission and performance details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Student Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Student Name</p>
                  <p className="font-medium">{activity.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Student ID</p>
                  <p className="font-medium">{activity.studentId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Trophy className="h-4 w-4" />
                <span>Activity Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Activity Name</p>
                  <p className="font-medium">{activity.activityName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <Badge variant="outline">{activity.category}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Level</p>
                  <Badge variant="secondary">{activity.level}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">MAP Points</p>
                  <p className="font-medium text-green-600">{activity.points} points</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Evidence Type</p>
                  <p className="font-medium">{activity.evidenceType}</p>
                </div>
              </div>
              
              {activity.remarks && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Student Remarks</p>
                  <p className="text-sm bg-gray-50 p-2 rounded">{activity.remarks}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Details */}
          {(activity.marksObtained || activity.grade) && (
            <Card className="border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span>Performance Details</span>
                </CardTitle>
                <CardDescription>
                  Review and approve the student's performance in this activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {activity.marksObtained && (
                    <div>
                      <p className="text-sm text-gray-600">Marks Obtained</p>
                      <p className="font-medium text-lg">{activity.marksObtained}</p>
                    </div>
                  )}
                  
                  {activity.totalMarks && (
                    <div>
                      <p className="text-sm text-gray-600">Total Marks</p>
                      <p className="font-medium text-lg">{activity.totalMarks}</p>
                    </div>
                  )}
                  
                  {calculatePercentage() && (
                    <div>
                      <p className="text-sm text-gray-600">Percentage</p>
                      <p className="font-medium text-lg text-blue-600">{calculatePercentage()}%</p>
                    </div>
                  )}
                  
                  {activity.grade && (
                    <div>
                      <p className="text-sm text-gray-600">Grade/Result</p>
                      <Badge className="text-sm">{activity.grade}</Badge>
                    </div>
                  )}
                </div>

                {activity.marksEvidence && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Performance Evidence</p>
                    <p className="font-medium">{activity.marksEvidence}</p>
                  </div>
                )}

                {/* Marks Approval Section */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <Label htmlFor="marks-approval" className="font-medium">
                      Approve Performance/Marks
                    </Label>
                    <Switch
                      id="marks-approval"
                      checked={marksApproved}
                      onCheckedChange={setMarksApproved}
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="adjusted-marks">Adjusted Marks (if needed)</Label>
                      <Input
                        id="adjusted-marks"
                        placeholder="Leave empty if no adjustment needed"
                        value={adjustedMarks}
                        onChange={(e) => setAdjustedMarks(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="marks-remarks">Marks/Performance Remarks</Label>
                      <Textarea
                        id="marks-remarks"
                        placeholder="Add comments about the student's performance..."
                        value={marksRemarks}
                        onChange={(e) => setMarksRemarks(e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Teacher Approval Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Teacher Review</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="teacher-remarks">Teacher Remarks</Label>
                  <Textarea
                    id="teacher-remarks"
                    placeholder="Add your comments about this activity submission..."
                    value={teacherRemarks}
                    onChange={(e) => setTeacherRemarks(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReject}
              className="flex-1 text-red-600 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Activity
            </Button>
            <Button onClick={handleApprove} className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Activity
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
