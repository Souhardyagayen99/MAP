import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  Edit, 
  Save, 
  User, 
  Trophy, 
  Images, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Building,
  Hash
} from 'lucide-react';

interface StudentProfileData {
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
  activityPhotos: string[];
  // Academic records
  sscPercentage: number;
  hscPercentage: number;
}

interface Activity {
  id: string;
  name: string;
  category: string;
  date: string;
  status: string;
  photos: string[];
  points: number;
}

export default function StudentProfile() {
  const navigate = useNavigate();
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const activityPhotoRef = useRef<HTMLInputElement>(null);
  
  // Get user data from localStorage
  const getUserData = (): StudentProfileData => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      return {
        enrollmentNumber: parsed.enrollmentNumber || '2124UMLM1022',
        name: parsed.name || 'Student User',
        email: parsed.email || '2124umlm1022@sanjivani.edu.in',
        phone: parsed.phone || '+91 9876543210',
        department: parsed.department || 'Computer Science & Engineering',
        year: parsed.year || 'Second Year',
        division: parsed.division || 'Division A',
        program: parsed.program || 'B.Tech',
        address: parsed.address || 'Pune, Maharashtra',
        dateOfBirth: parsed.dateOfBirth || '2003-05-15',
        profilePhoto: parsed.profilePhoto || '',
        activityPhotos: parsed.activityPhotos || [],
        sscPercentage: parsed.sscPercentage || 0,
        hscPercentage: parsed.hscPercentage || 0
      };
    }
    return {
      enrollmentNumber: '2124UMLM1022',
      name: 'Student User',
      email: '2124umlm1022@sanjivani.edu.in',
      phone: '+91 9876543210',
      department: 'Computer Science & Engineering',
      year: 'Second Year',
      division: 'Division A',
      program: 'B.Tech',
      address: 'Pune, Maharashtra',
      dateOfBirth: '2003-05-15',
      profilePhoto: '',
      activityPhotos: [],
      sscPercentage: 0,
      hscPercentage: 0
    };
  };

  const [profileData, setProfileData] = useState<StudentProfileData>(getUserData());
  const [isEditing, setIsEditing] = useState(false);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);

  // Sample activities with photos
  const [activities] = useState<Activity[]>([
    {
      id: '1',
      name: 'Web Development Workshop',
      category: 'Technical Skills',
      date: '2024-03-10',
      status: 'Approved',
      photos: ['/placeholder-workshop1.jpg', '/placeholder-workshop2.jpg'],
      points: 5
    },
    {
      id: '2',
      name: 'Inter-College Cricket Tournament',
      category: 'Sports & Cultural',
      date: '2024-03-11',
      status: 'Approved',
      photos: ['/placeholder-cricket1.jpg', '/placeholder-cricket2.jpg', '/placeholder-cricket3.jpg'],
      points: 8
    },
    {
      id: '3',
      name: 'Blood Donation Camp',
      category: 'Community Outreach',
      date: '2024-03-05',
      status: 'Approved',
      photos: ['/placeholder-blood1.jpg'],
      points: 3
    },
    {
      id: '4',
      name: 'Hackathon 2024',
      category: 'Technical Skills',
      date: '2024-02-28',
      status: 'Pending',
      photos: ['/placeholder-hackathon1.jpg', '/placeholder-hackathon2.jpg'],
      points: 10
    }
  ]);

  const handleProfilePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target?.result as string;
        setProfileData(prev => ({ ...prev, profilePhoto: photoUrl }));
        // Update localStorage
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        userData.profilePhoto = photoUrl;
        localStorage.setItem('userData', JSON.stringify(userData));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleActivityPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const photoUrl = e.target?.result as string;
          setProfileData(prev => ({
            ...prev,
            activityPhotos: [...prev.activityPhotos, photoUrl]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSaveProfile = () => {
    // Save to localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const updatedData = { ...userData, ...profileData };
    localStorage.setItem('userData', JSON.stringify(updatedData));
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAllPhotos = () => {
    const activityPhotos = activities.flatMap(activity => activity.photos);
    return [...profileData.activityPhotos, ...activityPhotos];
  };

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
                onClick={() => navigate('/student')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Student Profile</h1>
                <p className="text-sm text-gray-600">Manage your profile and view your activities</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="gallery">Photo Gallery</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Photo Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Photo</CardTitle>
                  <CardDescription>Upload and manage your profile picture</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profileData.profilePhoto} alt={profileData.name} />
                    <AvatarFallback className="text-2xl">
                      {getInitials(profileData.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => profilePhotoRef.current?.click()}
                      className="w-full"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    
                    <input
                      ref={profilePhotoRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePhotoUpload}
                      className="hidden"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your basic details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({...prev, name: e.target.value}))}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="enrollment">Enrollment Number</Label>
                      <Input
                        id="enrollment"
                        value={profileData.enrollmentNumber}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({...prev, email: e.target.value}))}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({...prev, phone: e.target.value}))}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => setProfileData(prev => ({...prev, dateOfBirth: e.target.value}))}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="program">Program</Label>
                      <Input
                        id="program"
                        value={profileData.program}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData(prev => ({...prev, address: e.target.value}))}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
                <CardDescription>Your educational details and current status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="font-medium">{profileData.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Academic Year</p>
                      <p className="font-medium">{profileData.year}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Hash className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Division</p>
                      <p className="font-medium">{profileData.division}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Records */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Records</CardTitle>
                <CardDescription>Your SSC and HSC examination results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sscPercentage">SSC Percentage</Label>
                    <Input
                      id="sscPercentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={profileData.sscPercentage || ''}
                      onChange={(e) => setProfileData(prev => ({...prev, sscPercentage: parseFloat(e.target.value) || 0}))}
                      disabled={!isEditing}
                      placeholder="Enter SSC percentage"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hscPercentage">HSC Percentage</Label>
                    <Input
                      id="hscPercentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={profileData.hscPercentage || ''}
                      onChange={(e) => setProfileData(prev => ({...prev, hscPercentage: parseFloat(e.target.value) || 0}))}
                      disabled={!isEditing}
                      placeholder="Enter HSC percentage"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>My Activities</CardTitle>
                <CardDescription>Track your submitted activities and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Trophy className="h-5 w-5 text-yellow-600" />
                            <h3 className="font-medium text-lg">{activity.name}</h3>
                            <Badge variant="outline">{activity.category}</Badge>
                            <Badge 
                              className={
                                activity.status === 'Approved' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {activity.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(activity.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <Trophy className="h-4 w-4 mr-1" />
                              {activity.points} points
                            </span>
                            <span className="flex items-center">
                              <Images className="h-4 w-4 mr-1" />
                              {activity.photos.length} photos
                            </span>
                          </div>
                          
                          {/* Activity Photos */}
                          <div className="flex space-x-2">
                            {activity.photos.slice(0, 3).map((photo, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={photo}
                                  alt={`${activity.name} photo ${index + 1}`}
                                  className="w-16 h-16 object-cover rounded border"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder.svg';
                                  }}
                                />
                              </div>
                            ))}
                            {activity.photos.length > 3 && (
                              <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-600">
                                +{activity.photos.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Photo Gallery Tab */}
          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Photo Gallery</CardTitle>
                    <CardDescription>All your activity photos in one place</CardDescription>
                  </div>
                  <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photos
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Activity Photos</DialogTitle>
                        <DialogDescription>
                          Upload photos related to your activities. These will be visible to your teachers and admin.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="activityPhotos">Select Photos</Label>
                          <input
                            ref={activityPhotoRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleActivityPhotoUpload}
                            className="w-full mt-2"
                          />
                        </div>
                        <Button onClick={() => setIsPhotoDialogOpen(false)}>
                          Done
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {getAllPhotos().map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Activity photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded border cursor-pointer hover:opacity-75 transition-opacity"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                        onClick={() => {
                          // Open image in full size
                          window.open(photo, '_blank');
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 text-sm">
                          View
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {getAllPhotos().length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      <Images className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No photos uploaded yet</p>
                      <p className="text-sm">Upload photos to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
