import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Settings,
  LogOut,
  Shield,
  Bell,
  Moon,
  Sun,
  Monitor,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

interface UserProfileDropdownProps {
  userType: 'student' | 'teacher' | 'admin';
  userName: string;
  userEmail: string;
  userAvatar?: string;
  userId?: string;
  department?: string;
  year?: string;
  division?: string;
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
  currentTheme?: 'light' | 'dark' | 'system';
}

export default function UserProfileDropdown({
  userType,
  userName,
  userEmail,
  userAvatar,
  userId,
  department,
  year,
  division,
  onThemeChange,
  currentTheme = 'system'
}: UserProfileDropdownProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Clear any stored user data
    localStorage.removeItem('userToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    
    // Navigate to homepage
    navigate('/');
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    // Navigate to profile page based on user type
    const profileRoute = `/${userType}/profile`;
    navigate(profileRoute);
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    // Navigate to settings page based on user type
    const settingsRoute = `/${userType}/settings`;
    navigate(settingsRoute);
    setIsOpen(false);
  };

  const getUserTypeIcon = () => {
    switch (userType) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'teacher':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getUserTypeBadge = () => {
    switch (userType) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800 text-xs">Admin</Badge>;
      case 'teacher':
        return <Badge className="bg-blue-100 text-blue-800 text-xs">Teacher</Badge>;
      case 'student':
        return <Badge className="bg-green-100 text-green-800 text-xs">Student</Badge>;
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
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 rounded-full">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-medium">{userName}</span>
              <span className="text-xs text-gray-500">{getUserTypeBadge()}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              {getUserTypeIcon()}
              <p className="text-sm font-medium leading-none">{userName}</p>
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
            {userId && (
              <p className="text-xs leading-none text-muted-foreground">
                ID: {userId}
              </p>
            )}
            {department && (
              <p className="text-xs leading-none text-muted-foreground">
                Department: {department}
              </p>
            )}
            {year && (
              <p className="text-xs leading-none text-muted-foreground">
                Year: {year}
              </p>
            )}
            {division && (
              <p className="text-xs leading-none text-muted-foreground">
                Division: {division}
              </p>
            )}
            <div className="flex items-center space-x-2">
              {getUserTypeBadge()}
              <Badge variant="outline" className="text-xs">
                Online
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer">
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
          <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 text-xs">
            3
          </Badge>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-xs text-gray-500">Theme</DropdownMenuLabel>
        
        <DropdownMenuItem 
          onClick={() => onThemeChange?.('light')} 
          className="cursor-pointer"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {currentTheme === 'light' && <Badge variant="outline" className="ml-auto text-xs">✓</Badge>}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => onThemeChange?.('dark')} 
          className="cursor-pointer"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {currentTheme === 'dark' && <Badge variant="outline" className="ml-auto text-xs">✓</Badge>}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => onThemeChange?.('system')} 
          className="cursor-pointer"
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
          {currentTheme === 'system' && <Badge variant="outline" className="ml-auto text-xs">✓</Badge>}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer">
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
