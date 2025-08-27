import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Images, 
  Eye, 
  Calendar, 
  Trophy, 
  User,
  Download,
  ZoomIn
} from 'lucide-react';

interface StudentPhoto {
  id: string;
  url: string;
  activityName: string;
  activityCategory: string;
  uploadDate: string;
  description?: string;
}

interface StudentPhotoGalleryProps {
  studentId: string;
  studentName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentPhotoGallery({
  studentId,
  studentName,
  isOpen,
  onClose
}: StudentPhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<StudentPhoto | null>(null);
  const [isPhotoViewOpen, setIsPhotoViewOpen] = useState(false);

  // Mock data - in real app this would come from API
  const studentPhotos: StudentPhoto[] = [
    {
      id: '1',
      url: '/placeholder-workshop1.jpg',
      activityName: 'Web Development Workshop',
      activityCategory: 'Technical Skills',
      uploadDate: '2024-03-10',
      description: 'Workshop presentation and certificate ceremony'
    },
    {
      id: '2',
      url: '/placeholder-workshop2.jpg',
      activityName: 'Web Development Workshop',
      activityCategory: 'Technical Skills',
      uploadDate: '2024-03-10',
      description: 'Group photo with instructors'
    },
    {
      id: '3',
      url: '/placeholder-cricket1.jpg',
      activityName: 'Inter-College Cricket Tournament',
      activityCategory: 'Sports & Cultural',
      uploadDate: '2024-03-11',
      description: 'Team photo before the match'
    },
    {
      id: '4',
      url: '/placeholder-cricket2.jpg',
      activityName: 'Inter-College Cricket Tournament',
      activityCategory: 'Sports & Cultural',
      uploadDate: '2024-03-11',
      description: 'Award ceremony - Runner-up position'
    },
    {
      id: '5',
      url: '/placeholder-cricket3.jpg',
      activityName: 'Inter-College Cricket Tournament',
      activityCategory: 'Sports & Cultural',
      uploadDate: '2024-03-11',
      description: 'Action shot during the match'
    },
    {
      id: '6',
      url: '/placeholder-blood1.jpg',
      activityName: 'Blood Donation Camp',
      activityCategory: 'Community Outreach',
      uploadDate: '2024-03-05',
      description: 'Volunteering at the blood donation camp'
    },
    {
      id: '7',
      url: '/placeholder-hackathon1.jpg',
      activityName: 'Hackathon 2024',
      activityCategory: 'Technical Skills',
      uploadDate: '2024-02-28',
      description: 'Working on the project during hackathon'
    },
    {
      id: '8',
      url: '/placeholder-hackathon2.jpg',
      activityName: 'Hackathon 2024',
      activityCategory: 'Technical Skills',
      uploadDate: '2024-02-28',
      description: 'Final presentation of the project'
    }
  ];

  const getPhotosByActivity = () => {
    const activities = [...new Set(studentPhotos.map(photo => photo.activityName))];
    return activities.map(activityName => ({
      activityName,
      photos: studentPhotos.filter(photo => photo.activityName === activityName),
      category: studentPhotos.find(photo => photo.activityName === activityName)?.activityCategory || ''
    }));
  };

  const handlePhotoClick = (photo: StudentPhoto) => {
    setSelectedPhoto(photo);
    setIsPhotoViewOpen(true);
  };

  const handleDownloadPhoto = (photoUrl: string, fileName: string) => {
    // In a real app, this would download the actual file
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = fileName;
    link.click();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Images className="h-5 w-5" />
              <span>Photo Gallery - {studentName}</span>
            </DialogTitle>
            <DialogDescription>
              View all activity photos submitted by this student
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="by-activity" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="by-activity">By Activity</TabsTrigger>
              <TabsTrigger value="all-photos">All Photos</TabsTrigger>
            </TabsList>

            {/* Photos grouped by activity */}
            <TabsContent value="by-activity">
              <div className="space-y-6">
                {getPhotosByActivity().map((activity, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center space-x-2">
                            <Trophy className="h-4 w-4" />
                            <span>{activity.activityName}</span>
                          </CardTitle>
                          <CardDescription>
                            <Badge variant="outline" className="mt-1">
                              {activity.category}
                            </Badge>
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">
                          {activity.photos.length} photos
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {activity.photos.map((photo) => (
                          <div key={photo.id} className="relative group cursor-pointer">
                            <img
                              src={photo.url}
                              alt={photo.description || `${activity.activityName} photo`}
                              className="w-full h-24 object-cover rounded border hover:opacity-75 transition-opacity"
                              onClick={() => handlePhotoClick(photo)}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded flex items-center justify-center">
                              <ZoomIn className="text-white opacity-0 group-hover:opacity-100 h-6 w-6" />
                            </div>
                            <div className="absolute bottom-1 left-1 right-1">
                              <div className="bg-black bg-opacity-75 text-white text-xs p-1 rounded text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                {new Date(photo.uploadDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {studentPhotos.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Images className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No photos uploaded</p>
                    <p>This student hasn't uploaded any activity photos yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* All photos in grid */}
            <TabsContent value="all-photos">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {studentPhotos.map((photo) => (
                  <div key={photo.id} className="relative group cursor-pointer">
                    <img
                      src={photo.url}
                      alt={photo.description || `Activity photo`}
                      className="w-full h-32 object-cover rounded border hover:opacity-75 transition-opacity"
                      onClick={() => handlePhotoClick(photo)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded flex items-center justify-center">
                      <ZoomIn className="text-white opacity-0 group-hover:opacity-100 h-6 w-6" />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-black bg-opacity-75 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="font-medium truncate">{photo.activityName}</p>
                        <p>{new Date(photo.uploadDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Photo Detail View Modal */}
      <Dialog open={isPhotoViewOpen} onOpenChange={setIsPhotoViewOpen}>
        <DialogContent className="max-w-4xl">
          {selectedPhoto && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedPhoto.activityName}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{selectedPhoto.activityCategory}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadPhoto(selectedPhoto.url, `${selectedPhoto.activityName}-${selectedPhoto.id}.jpg`)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(selectedPhoto.uploadDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {studentName}
                    </span>
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.description || selectedPhoto.activityName}
                    className="max-w-full max-h-96 object-contain rounded border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                
                {selectedPhoto.description && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-700">{selectedPhoto.description}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
