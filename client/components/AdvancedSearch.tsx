import { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  User, 
  Users, 
  Trophy, 
  FileText, 
  Settings,
  BarChart3,
  Calendar,
  Shield
} from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  icon: React.ReactNode;
}

interface AdvancedSearchProps {
  userType: 'student' | 'teacher' | 'admin';
}

const SEARCH_DATA: Record<string, SearchResult[]> = {
  student: [
    {
      id: '1',
      title: 'Add New Activity',
      description: 'Submit a new activity for MAP points',
      category: 'Actions',
      url: '/student/activities',
      icon: <Trophy className="h-4 w-4" />
    },
    {
      id: '2',
      title: 'View Progress',
      description: 'Check your MAP progress and analytics',
      category: 'Dashboard',
      url: '/student/analytics',
      icon: <BarChart3 className="h-4 w-4" />
    },
    {
      id: '3',
      title: 'Activity Map',
      description: 'View activities on the map',
      category: 'Dashboard',
      url: '/student/map',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      id: '4',
      title: 'Profile Settings',
      description: 'Manage your profile and preferences',
      category: 'Settings',
      url: '/student/profile',
      icon: <User className="h-4 w-4" />
    }
  ],
  teacher: [
    {
      id: '1',
      title: 'Pending Approvals',
      description: 'Review student activity submissions',
      category: 'Actions',
      url: '/teacher/approvals',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: '2',
      title: 'Create Event',
      description: 'Create new events for students',
      category: 'Actions',
      url: '/teacher/events',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      id: '3',
      title: 'Class Analytics',
      description: 'View class performance and compliance',
      category: 'Dashboard',
      url: '/teacher/analytics',
      icon: <BarChart3 className="h-4 w-4" />
    },
    {
      id: '4',
      title: 'Student Management',
      description: 'Manage assigned students',
      category: 'Management',
      url: '/teacher/students',
      icon: <Users className="h-4 w-4" />
    }
  ],
  admin: [
    {
      id: '1',
      title: 'Student Management',
      description: 'Manage all students in the system',
      category: 'Management',
      url: '/admin/students',
      icon: <User className="h-4 w-4" />
    },
    {
      id: '2',
      title: 'Teacher Management',
      description: 'Manage faculty and permissions',
      category: 'Management',
      url: '/admin/teachers',
      icon: <Users className="h-4 w-4" />
    },
    {
      id: '3',
      title: 'System Settings',
      description: 'Configure system and permissions',
      category: 'Settings',
      url: '/admin/settings',
      icon: <Settings className="h-4 w-4" />
    },
    {
      id: '4',
      title: 'Activity Oversight',
      description: 'Monitor all system activities',
      category: 'Dashboard',
      url: '/admin/activities',
      icon: <Shield className="h-4 w-4" />
    },
    {
      id: '5',
      title: 'Analytics Dashboard',
      description: 'View system-wide analytics',
      category: 'Dashboard',
      url: '/admin/analytics',
      icon: <BarChart3 className="h-4 w-4" />
    }
  ]
};

export default function AdvancedSearch({ userType }: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setSearchResults(SEARCH_DATA[userType] || []);
  }, [userType]);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    window.location.href = url;
  };

  const groupedResults = searchResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Search className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Search...</span>
          <Badge variant="secondary" className="ml-2 text-xs hidden lg:inline">
            ⌘K
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 max-w-2xl">
        <Command className="rounded-lg border-none shadow-md">
          <CommandInput 
            placeholder="Search for actions, pages, or settings..." 
            className="border-none focus:ring-0"
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {Object.entries(groupedResults).map(([category, results]) => (
              <CommandGroup key={category} heading={category}>
                {results.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result.url)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      {result.icon}
                      <div>
                        <p className="font-medium">{result.title}</p>
                        <p className="text-sm text-gray-500">{result.description}</p>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
