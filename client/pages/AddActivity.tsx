import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, Calculator, Trophy, MapPin, Search } from 'lucide-react';
import { 
  ACTIVITY_CATEGORIES, 
  ACTIVITY_LEVELS, 
  SUB_ACTIVITIES,
  getSubActivitiesByCategory,
  getSubActivity,
  calculateActivityPoints,
  type SubActivity
} from '@shared/activities';

// Google Maps TypeScript declarations
declare global {
  interface Window {
    google: any;
  }
}

// Google Maps component
function LocationMap({ onLocationSelect }: { onLocationSelect: (location: { address: string; lat: number; lng: number }) => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [geocoder, setGeocoder] = useState<any>(null);
  const [apiKeyAvailable, setApiKeyAvailable] = useState(false);

  useEffect(() => {
    // Check if Google Maps API key is available
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
      console.warn('Google Maps API key not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file');
      setApiKeyAvailable(false);
      return;
    }

    setApiKeyAvailable(true);

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Fallback UI when API key is not available
  if (!apiKeyAvailable) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Google Maps not configured:</strong> To use the interactive map, please add your Google Maps API key to the .env file.
          </p>
          <p className="text-xs text-yellow-700 mt-2">
            For now, you can manually enter the location details below.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="locationAddress">Address</Label>
            <Input
              id="locationAddress"
              placeholder="Enter full address..."
              onChange={(e) => onLocationSelect({ address: e.target.value, lat: 0, lng: 0 })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="locationLat">Latitude (Optional)</Label>
            <Input
              id="locationLat"
              type="number"
              step="any"
              placeholder="e.g., 20.5937"
              onChange={(e) => {
                const lat = parseFloat(e.target.value) || 0;
                onLocationSelect({ address: '', lat, lng: 0 });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="locationLng">Longitude (Optional)</Label>
            <Input
              id="locationLng"
              type="number"
              step="any"
              placeholder="e.g., 78.9629"
              onChange={(e) => {
                const lng = parseFloat(e.target.value) || 0;
                onLocationSelect({ address: '', lat: 0, lng });
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  const initializeMap = () => {
    if (!mapRef.current || !(window as any).google) return;

    const defaultLocation = { lat: 20.5937, lng: 78.9629 };
    
    const mapInstance = new (window as any).google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 5,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    const geocoderInstance = new (window as any).google.maps.Geocoder();
    setGeocoder(geocoderInstance);
    setMap(mapInstance);

    // Add click listener to map
    mapInstance.addListener('click', (event: any) => {
      const position = event.latLng;
      if (position) {
        addMarker(position);
        reverseGeocode(position);
      }
    });
  };

  const addMarker = (position: any) => {
    if (marker) {
      marker.setMap(null);
    }

    const newMarker = new (window as any).google.maps.Marker({
      position,
      map,
      draggable: true,
      title: 'Activity Location'
    });

    newMarker.addListener('dragend', () => {
      const pos = newMarker.getPosition();
      if (pos) {
        reverseGeocode(pos);
      }
    });

    setMarker(newMarker);
  };

  const reverseGeocode = (position: any) => {
    if (!geocoder) return;

    geocoder.geocode({ location: position }, (results: any, status: any) => {
      if (status === 'OK' && results && results[0]) {
        const address = results[0].formatted_address;
        onLocationSelect({
          address,
          lat: position.lat(),
          lng: position.lng()
        });
      }
    });
  };

  const handleSearch = () => {
    if (!geocoder || !searchQuery.trim()) return;

    geocoder.geocode({ address: searchQuery }, (results: any, status: any) => {
      if (status === 'OK' && results && results[0]) {
        const loc = results[0].geometry.location;
        map?.setCenter(loc);
        map?.setZoom(15);
        addMarker(loc);
        reverseGeocode(loc);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} size="sm">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full h-64 rounded-lg border border-gray-300"
        style={{ minHeight: '256px' }}
      />
      
      <p className="text-sm text-gray-600">
        Click on the map to select a location or search for an address above
      </p>
    </div>
  );
}

export default function AddActivity() {
  const navigate = useNavigate();
  const locationHook = useLocation();
  const searchParams = new URLSearchParams(locationHook.search);
  const editId = searchParams.get('editId');
  const [isEditMode, setIsEditMode] = useState<boolean>(Boolean(editId));
  const [formData, setFormData] = useState({
    categoryId: '',
    subActivityId: '',
    level: '',
    isWinner: false,
    startDate: '',
    endDate: '',
    location: {
      address: '',
      lat: 0,
      lng: 0
    },
    evidenceType: '',
    duration: '',
    remarks: '',
    grade: '',
    customActivityName: '' // Added for custom activity names
  });
  
  const [calculatedPoints, setCalculatedPoints] = useState(0);
  const [selectedSubActivity, setSelectedSubActivity] = useState<SubActivity | null>(null);

  // File uploads state and refs
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const docsInputRef = useRef<HTMLInputElement | null>(null);
  const photosInputRef = useRef<HTMLInputElement | null>(null);

  const acceptDocs = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg';
  const acceptPhotos = '.png,.jpg,.jpeg';
  const maxFileSizeBytes = 10 * 1024 * 1024; // 10MB each

  const addFiles = (files: FileList | File[], type: 'docs' | 'photos') => {
    const fileArray = Array.from(files);
    const validated = fileArray.filter(f => f.size <= maxFileSizeBytes);
    if (type === 'docs') {
      setDocumentFiles(prev => [...prev, ...validated]);
    } else {
      setPhotoFiles(prev => [...prev, ...validated]);
    }
  };

  const onChooseDocs = () => docsInputRef.current?.click();
  const onChoosePhotos = () => photosInputRef.current?.click();

  const onDocsChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) addFiles(e.target.files, 'docs');
    e.target.value = '';
  };

  const onPhotosChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) addFiles(e.target.files, 'photos');
    e.target.value = '';
  };

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave: React.DragEventHandler<HTMLDivElement> = () => setIsDragging(false);

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dt = e.dataTransfer;
    if (!dt?.files?.length) return;
    // Split by mime type (basic heuristic)
    const docs: File[] = [];
    const photos: File[] = [];
    Array.from(dt.files).forEach(f => {
      if (/(pdf|msword|officedocument|presentation|spreadsheet)/i.test(f.type)) docs.push(f);
      else if (/image\/(png|jpe?g)/i.test(f.type)) photos.push(f);
      else docs.push(f); // default to docs
    });
    if (docs.length) addFiles(docs, 'docs');
    if (photos.length) addFiles(photos, 'photos');
  };

  const removeFile = (type: 'docs' | 'photos', index: number) => {
    if (type === 'docs') setDocumentFiles(prev => prev.filter((_, i) => i !== index));
    else setPhotoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({ ...prev, categoryId, subActivityId: '', level: '', customActivityName: '', startDate: '', endDate: '', location: { address: '', lat: 0, lng: 0 } }));
    setSelectedSubActivity(null);
    setCalculatedPoints(0);
  };

  const handleSubActivityChange = (subActivityId: string) => {
    const subActivity = getSubActivity(subActivityId);
    setFormData(prev => ({ ...prev, subActivityId, level: '', customActivityName: '', startDate: '', endDate: '', location: { address: '', lat: 0, lng: 0 } }));
    setSelectedSubActivity(subActivity || null);
    setCalculatedPoints(0);
  };

  const handleLevelChange = (level: string) => {
    setFormData(prev => ({ ...prev, level }));
    if (level) {
      const selectedLevel = ACTIVITY_LEVELS.find(l => l.id === level);
      const points = selectedLevel ? selectedLevel.basePoints : 0;
      setCalculatedPoints(points);
    }
  };

  const handleWinnerChange = (isWinner: boolean) => {
    setFormData(prev => ({ ...prev, isWinner }));
    if (formData.level) {
      const selectedLevel = ACTIVITY_LEVELS.find(l => l.id === formData.level);
      const points = selectedLevel ? selectedLevel.basePoints : 0;
      setCalculatedPoints(points);
    }
  };

  const handleDurationChange = (duration: string) => {
    setFormData(prev => ({ ...prev, duration }));
    if (formData.level) {
      const selectedLevel = ACTIVITY_LEVELS.find(l => l.id === formData.level);
      const points = selectedLevel ? selectedLevel.basePoints : 0;
      setCalculatedPoints(points);
    }
  };

  const handleLocationSelect = (location: { address: string; lat: number; lng: number }) => {
    setFormData(prev => ({ ...prev, location }));
  };

  useEffect(() => {
    if (!editId) return;
    try {
      const stored = JSON.parse(localStorage.getItem('studentActivities') || '[]');
      const existing = stored.find((a: any) => String(a.id) === String(editId));
      if (existing) {
        setFormData((prev) => ({
          ...prev,
          categoryId: existing.categoryId || '',
          subActivityId: existing.subActivityId || '',
          level: existing.level || '',
          isWinner: Boolean(existing.isWinner),
          startDate: existing.startDate || '',
          endDate: existing.endDate || '',
          location: existing.location || { address: '', lat: 0, lng: 0 },
          evidenceType: existing.evidenceType || '',
          duration: existing.duration || '',
          remarks: existing.remarks || '',
          grade: existing.grade || '',
          customActivityName: existing.customActivityName || ''
        }));
        if (existing.subActivityId) {
          const sub = getSubActivity(existing.subActivityId);
          setSelectedSubActivity(sub || null);
        }
        if (existing.level) {
          const selectedLevel = ACTIVITY_LEVELS.find(l => l.id === existing.level);
          setCalculatedPoints(selectedLevel ? selectedLevel.basePoints : 0);
        }
        setIsEditMode(true);
      }
    } catch (_e) {
      // ignore
    }
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get user data for submission
    const userData = localStorage.getItem('userData');
    const userInfo = userData ? JSON.parse(userData) : {};

    // Determine the final activity name
    let finalActivityName = selectedSubActivity?.name || 'Unknown Activity';
    if (selectedSubActivity?.isCustom && formData.customActivityName.trim()) {
      finalActivityName = formData.customActivityName.trim();
    }

    const activitySubmission = {
      ...formData,
      points: calculatedPoints,
      studentId: userInfo.enrollmentNumber || 'Unknown',
      studentName: userInfo.name || 'Student User',
      submissionDate: new Date().toISOString(),
      status: 'pending'
    };

    try {
      if (isEditMode && editId) {
        // Try backend update first
        await fetch(`/api/activities/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...activitySubmission,
            subActivityId: formData.subActivityId,
            categoryId: formData.categoryId,
            activityName: finalActivityName
          })
        }).catch(() => {});

        // Always sync localStorage fallback
        const existingActivities = JSON.parse(localStorage.getItem('studentActivities') || '[]');
        const idx = existingActivities.findIndex((a: any) => String(a.id) === String(editId));
        if (idx !== -1) {
          existingActivities[idx] = {
            ...existingActivities[idx],
            ...activitySubmission,
            id: existingActivities[idx].id,
            activityName: finalActivityName,
            subActivityId: formData.subActivityId,
            categoryId: formData.categoryId
          };
          localStorage.setItem('studentActivities', JSON.stringify(existingActivities));
        }
      } else {
        const res = await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...activitySubmission,
            subActivityId: formData.subActivityId,
            categoryId: formData.categoryId,
            activityName: finalActivityName
          })
        });
        if (!res.ok) throw new Error('Server rejected');
      }
    } catch (_err) {
      if (!isEditMode) {
        const existingActivities = JSON.parse(localStorage.getItem('studentActivities') || '[]');
        existingActivities.push({
          id: Date.now().toString(),
          ...activitySubmission,
          activityName: finalActivityName
        });
        localStorage.setItem('studentActivities', JSON.stringify(existingActivities));
      }
    }

    alert(`${isEditMode ? 'Activity updated' : 'Activity submitted'} successfully! It will be reviewed by your teacher.`);
    navigate('/student');
  };

  const subActivitiesForCategory = formData.categoryId 
    ? getSubActivitiesByCategory(formData.categoryId)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/student')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Add New Activity</h1>
              <p className="text-sm text-gray-600">Submit your activity for MAP points</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Activity Submission Form</CardTitle>
              <CardDescription>
                Fill in the details of your activity. Points will be calculated automatically based on 
                the category, level, and your achievement status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <div className="space-y-2">
                  <Label htmlFor="category">Activity Category</Label>
                  <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity category" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIVITY_CATEGORIES.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.id}: {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.categoryId && (
                    <p className="text-sm text-gray-600">
                      {ACTIVITY_CATEGORIES.find(c => c.id === formData.categoryId)?.description}
                    </p>
                  )}
                </div>

                {/* Sub-Activity Selection */}
                {subActivitiesForCategory.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="subActivity">Specific Activity</Label>
                    <Select value={formData.subActivityId} onValueChange={handleSubActivityChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select specific activity" />
                      </SelectTrigger>
                      <SelectContent>
                        {subActivitiesForCategory.map(subActivity => (
                          <SelectItem key={subActivity.id} value={subActivity.id}>
                            <div className="flex items-center space-x-2">
                              <span>{subActivity.name}</span>
                              {subActivity.isCustom && (
                                <Badge variant="outline" className="text-xs ml-2">
                                  Custom
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedSubActivity && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-sm text-gray-600">Evidence required:</span>
                        {selectedSubActivity.evidenceRequired.map(evidence => (
                          <Badge key={evidence} variant="outline" className="text-xs">
                            {evidence}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {/* Help text for custom activities */}
                    {selectedSubActivity?.isCustom && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Custom Activity Selected:</strong> You've chosen to submit a custom activity. 
                          Please provide a specific name for your activity in the field below. 
                          Points will be calculated based on the selected level and category.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Custom Activity Name Input - Only show when "Other" is selected */}
                {selectedSubActivity?.isCustom && (
                  <div className="space-y-2">
                    <Label htmlFor="customActivityName">Custom Activity Name *</Label>
                    <Input
                      id="customActivityName"
                      placeholder="Enter the specific name of your activity..."
                      value={formData.customActivityName}
                      onChange={(e) => setFormData(prev => ({ ...prev, customActivityName: e.target.value }))}
                      required
                    />
                    <p className="text-sm text-gray-600">
                      Please provide a clear, descriptive name for your custom activity
                    </p>
                  </div>
                )}

                {/* Level Selection */}
                {formData.subActivityId && (
                  <div className="space-y-2">
                    <Label htmlFor="level">Level of Activity</Label>
                    <Select value={formData.level} onValueChange={handleLevelChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTIVITY_LEVELS.map(level => (
                          <SelectItem key={level.id} value={level.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{level.name}</span>
                              <Badge variant="secondary" className="ml-2">
                                {level.basePoints} points
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Show selected level points */}
                    {formData.level && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Trophy className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">
                            Default Points for {ACTIVITY_LEVELS.find(l => l.id === formData.level)?.name}: 
                            <span className="ml-1 font-bold text-lg">
                              {ACTIVITY_LEVELS.find(l => l.id === formData.level)?.basePoints}
                            </span>
                          </span>
                        </div>
                        <p className="text-xs text-blue-700 mt-1">
                          These are the base points for this activity level. Final points will be calculated based on your achievement.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Duration Selection for Duration-based Activities */}
                {selectedSubActivity?.isDurationBased && (
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select value={formData.duration} onValueChange={handleDurationChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="two_days">Two Days</SelectItem>
                        <SelectItem value="one_week">One Week</SelectItem>
                        <SelectItem value="one_month">One Month</SelectItem>
                        <SelectItem value="one_semester">One Semester/Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Winner Status */}
                {formData.level && (
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="winner"
                      checked={formData.isWinner}
                      onCheckedChange={handleWinnerChange}
                    />
                    <Label htmlFor="winner" className="text-sm">
                      I was a winner/achieved recognition in this activity
                    </Label>
                  </div>
                )}

                {/* Date */}
                <div className="space-y-2">
                  <Label>Activity Dates</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        min={formData.startDate}
                        required
                      />
                    </div>
                  </div>
                  {formData.startDate && formData.endDate && formData.endDate < formData.startDate && (
                    <p className="text-sm text-red-600">
                      End date cannot be before start date
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    Select the start and end dates of your activity
                  </p>
                </div>

                {/* Location Input */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location (Optional)</Label>
                  <LocationMap onLocationSelect={handleLocationSelect} />
                  
                  {/* Display selected location */}
                  {formData.location.address && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-800">
                            Selected Location: {formData.location.address}
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            Coordinates: {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-600">
                    Click on the map to select a location or search for an address above
                  </p>
                </div>

                {/* Evidence Type */}
                <div className="space-y-2">
                  <Label htmlFor="evidenceType">Evidence Type</Label>
                  <Select 
                    value={formData.evidenceType} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, evidenceType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select evidence type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                      <SelectItem value="photos">Photos</SelectItem>
                      <SelectItem value="approval_letter">Approval Letter</SelectItem>
                      <SelectItem value="multiple">Multiple Documents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="evidence">Upload Evidence & Photos</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                    }`}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                  >
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Drag & drop files here or use the buttons below
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: PDF, DOC, PPT, XLS, JPG, PNG (Max 10MB each)
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mt-3">
                      <Button type="button" variant="outline" size="sm" onClick={onChooseDocs}>
                        Choose Documents
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={onChoosePhotos}>
                        Choose Photos
                      </Button>
                    </div>
                    <input
                      ref={docsInputRef}
                      type="file"
                      accept={acceptDocs}
                      multiple
                      className="hidden"
                      onChange={onDocsChange}
                    />
                    <input
                      ref={photosInputRef}
                      type="file"
                      accept={acceptPhotos}
                      multiple
                      className="hidden"
                      onChange={onPhotosChange}
                    />

                    {(documentFiles.length > 0 || photoFiles.length > 0) && (
                      <div className="mt-4 text-left">
                        {documentFiles.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-800 mb-1">Documents</h4>
                            <ul className="space-y-1">
                              {documentFiles.map((f, i) => (
                                <li key={`doc-${i}`} className="flex items-center justify-between text-sm bg-gray-50 border rounded px-2 py-1">
                                  <span className="truncate mr-2">{f.name}</span>
                                  <Button type="button" size="sm" variant="ghost" onClick={() => removeFile('docs', i)}>
                                    Remove
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {photoFiles.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-800 mb-1">Photos</h4>
                            <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {photoFiles.map((f, i) => (
                                <li key={`photo-${i}`} className="relative group border rounded overflow-hidden">
                                  <img
                                    src={URL.createObjectURL(f)}
                                    alt={f.name}
                                    className="w-full h-24 object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeFile('photos', i)}
                                    className="absolute top-1 right-1 text-xs bg-white/80 border rounded px-1 py-0.5 hidden group-hover:block"
                                  >
                                    Remove
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-blue-600 mt-3">
                      📸 Photos will be visible to teachers and admins for verification
                    </p>
                  </div>
                </div>

                {/* Marks Section */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-3 flex items-center">
                    <Trophy className="h-4 w-4 mr-2" />
                    Performance Details
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade/Result</Label>
                    <Select
                      value={formData.grade}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your achievement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Winner 1">Winner 1</SelectItem>
                        <SelectItem value="Winner 2">Winner 2</SelectItem>
                        <SelectItem value="Winner 3">Winner 3</SelectItem>
                        <SelectItem value="Runner-up">Runner-up</SelectItem>
                        <SelectItem value="Participant">Participant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Remarks */}
                <div className="space-y-2">
                  <Label htmlFor="remarks">Additional Remarks (Optional)</Label>
                  <Textarea
                    id="remarks"
                    placeholder="Add any additional information about your activity..."
                    value={formData.remarks}
                    onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                    rows={3}
                  />
                </div>

                {/* Points Calculation Display */}
                {calculatedPoints > 0 && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Calculator className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-800">
                            Calculated Points: {calculatedPoints}
                          </span>
                        </div>
                        
                        <div className="text-sm text-green-700 space-y-1">
                          <p><strong>Level:</strong> {ACTIVITY_LEVELS.find(l => l.id === formData.level)?.name}</p>
                          <p><strong>Base Points:</strong> {ACTIVITY_LEVELS.find(l => l.id === formData.level)?.basePoints}</p>
                          {formData.grade && (
                            <p><strong>Achievement:</strong> {formData.grade}</p>
                          )}
                        </div>
                        
                        <div className="p-2 bg-green-100 rounded text-xs text-green-800">
                          <strong>Note:</strong> These points will be added to your MAP score upon faculty approval. 
                          The final points may be adjusted by your teacher during the review process.
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Submit Button */}
                <div className="flex space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/student')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={
                      !formData.categoryId || 
                      !formData.subActivityId || 
                      !formData.level || 
                      !formData.startDate ||
                      !formData.endDate ||
                      (formData.endDate < formData.startDate) ||
                      (selectedSubActivity?.isCustom && !formData.customActivityName.trim())
                    }
                  >
                    Submit Activity
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
