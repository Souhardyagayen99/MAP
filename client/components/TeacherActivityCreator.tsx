import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar, Plus, Save, X } from 'lucide-react';
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
  department: string;
  year?: string;
  division?: string;
}

interface TeacherActivityCreatorProps {
  facultyId: string;
  onActivityCreated: () => void;
}

export default function TeacherActivityCreator({ facultyId, onActivityCreated }: TeacherActivityCreatorProps) {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subCategory: '',
    level: 'beginner',
    points: 10,
    maxPoints: 10,
    evidenceType: 'photo',
    requirements: '',
    startDate: '',
    endDate: '',
    isActive: true,
    year: '',
    division: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Academic Excellence',
    'Sports & Athletics',
    'Cultural Activities',
    'Technical Skills',
    'Leadership & Service',
    'Innovation & Research',
    'Community Service',
    'Professional Development'
  ];

  const evidenceTypes = [
    'photo',
    'document',
    'video',
    'certificate',
    'presentation',
    'report',
    'portfolio'
  ];

  const levels = [
    { value: 'beginner', label: 'Beginner', color: 'bg-blue-100 text-blue-800' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'advanced', label: 'Advanced', color: 'bg-green-100 text-green-800' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Activity name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.points <= 0) newErrors.points = 'Points must be greater than 0';
    if (formData.maxPoints < formData.points) newErrors.maxPoints = 'Max points must be >= points';
    if (!formData.evidenceType) newErrors.evidenceType = 'Evidence type is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsCreating(true);
      
      const response = await fetch(`/api/teachers/${facultyId}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create activity');
      }

      const newActivity = await response.json();
      
      toast({
        title: "Success!",
        description: `Activity "${newActivity.name}" created successfully.`,
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        subCategory: '',
        level: 'beginner',
        points: 10,
        maxPoints: 10,
        evidenceType: 'photo',
        requirements: '',
        startDate: '',
        endDate: '',
        isActive: true,
        year: '',
        division: ''
      });
      setErrors({});
      setIsCreating(false);
      
      onActivityCreated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create activity",
        variant: "destructive",
      });
      setIsCreating(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-blue-600" />
              <span>Create New Activity</span>
            </CardTitle>
            <CardDescription>Create an activity template for students to participate in</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(!isCreating)}
          >
            {isCreating ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {isCreating ? 'Cancel' : 'New Activity'}
          </Button>
        </div>
      </CardHeader>
      
      {isCreating && (
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Activity Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter activity name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the activity and what students need to do"
                rows={3}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Activity Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subCategory">Sub Category</Label>
                <Input
                  id="subCategory"
                  value={formData.subCategory}
                  onChange={(e) => handleInputChange('subCategory', e.target.value)}
                  placeholder="Optional sub-category"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center space-x-2">
                          <Badge className={level.color}>{level.label}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="evidenceType">Evidence Type *</Label>
                <Select value={formData.evidenceType} onValueChange={(value) => handleInputChange('evidenceType', value)}>
                  <SelectTrigger className={errors.evidenceType ? 'border-red-500' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {evidenceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.evidenceType && <p className="text-sm text-red-500">{errors.evidenceType}</p>}
              </div>
            </div>

            {/* Points Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="points">Base Points *</Label>
                <Input
                  id="points"
                  type="number"
                  min="1"
                  value={formData.points}
                  onChange={(e) => handleInputChange('points', parseInt(e.target.value))}
                  className={errors.points ? 'border-red-500' : ''}
                />
                {errors.points && <p className="text-sm text-red-500">{errors.points}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxPoints">Maximum Points *</Label>
                <Input
                  id="maxPoints"
                  type="number"
                  min={formData.points}
                  value={formData.maxPoints}
                  onChange={(e) => handleInputChange('maxPoints', parseInt(e.target.value))}
                  className={errors.maxPoints ? 'border-red-500' : ''}
                />
                {errors.maxPoints && <p className="text-sm text-red-500">{errors.maxPoints}</p>}
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                placeholder="What students need to complete this activity"
                rows={2}
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Target Year</Label>
                <Select value={formData.year} onValueChange={(value) => handleInputChange('year', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All years</SelectItem>
                    <SelectItem value="First Year">First Year</SelectItem>
                    <SelectItem value="Second Year">Second Year</SelectItem>
                    <SelectItem value="Third Year">Third Year</SelectItem>
                    <SelectItem value="Final Year">Final Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="division">Target Division</Label>
                <Select value={formData.division} onValueChange={(value) => handleInputChange('division', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All divisions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All divisions</SelectItem>
                    <SelectItem value="Division A">Division A</SelectItem>
                    <SelectItem value="Division B">Division B</SelectItem>
                    <SelectItem value="Division C">Division C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Activity is active and available to students</Label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                <Save className="h-4 w-4 mr-2" />
                {isCreating ? 'Creating...' : 'Create Activity'}
              </Button>
            </div>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
