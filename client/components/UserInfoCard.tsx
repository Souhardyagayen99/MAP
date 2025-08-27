import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  GraduationCap, 
  Users, 
  Shield, 
  Building, 
  Calendar, 
  Hash 
} from 'lucide-react';

interface UserInfoCardProps {
  userType: 'student' | 'teacher' | 'admin';
  userName: string;
  userEmail: string;
  userId: string;
  department?: string;
  year?: string;
  division?: string;
  avatarUrl?: string;
}

export default function UserInfoCard({
  userType,
  userName,
  userEmail,
  userId,
  department,
  year,
  division,
  avatarUrl
}: UserInfoCardProps) {
  const getUserTypeIcon = () => {
    switch (userType) {
      case 'admin':
        return <Shield className="h-5 w-5 text-red-600" />;
      case 'teacher':
        return <Users className="h-5 w-5 text-blue-600" />;
      default:
        return <GraduationCap className="h-5 w-5 text-green-600" />;
    }
  };

  const getUserTypeBadge = () => {
    switch (userType) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800">Administrator</Badge>;
      case 'teacher':
        return <Badge className="bg-blue-100 text-blue-800">Faculty</Badge>;
      case 'student':
        return <Badge className="bg-green-100 text-green-800">Student</Badge>;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarUrl} alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getUserTypeIcon()}
              <CardTitle className="text-xl">{userName}</CardTitle>
            </div>
            <CardDescription className="text-sm">{userEmail}</CardDescription>
            <div className="flex items-center space-x-2 mt-2">
              {getUserTypeBadge()}
              <Badge variant="outline" className="text-xs">
                <User className="h-3 w-3 mr-1" />
                {userId}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      {(department || year || division) && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            {department && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Building className="h-4 w-4" />
                <span className="font-medium">Department:</span>
                <span>{department}</span>
              </div>
            )}
            
            {year && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Academic Year:</span>
                <span>{year}</span>
              </div>
            )}
            
            {division && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Hash className="h-4 w-4" />
                <span className="font-medium">Division:</span>
                <span>{division}</span>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
