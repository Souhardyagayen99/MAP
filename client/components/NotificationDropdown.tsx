import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  X,
  Eye,
  Settings
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

interface NotificationDropdownProps {
  userType: 'student' | 'teacher' | 'admin';
}

const MOCK_NOTIFICATIONS: Record<string, Notification[]> = {
  student: [
    {
      id: '1',
      type: 'success',
      title: 'Activity Approved',
      message: 'Your Web Development Workshop activity has been approved by Dr. Jane Smith',
      timestamp: '2024-03-12T10:30:00Z',
      read: false,
      actionUrl: '/student/activities'
    },
    {
      id: '2',
      type: 'warning',
      title: 'MAP Points Reminder',
      message: 'You need 15 more points to meet the minimum requirement for this semester',
      timestamp: '2024-03-11T14:20:00Z',
      read: false
    },
    {
      id: '3',
      type: 'info',
      title: 'New Event Available',
      message: 'Annual Tech Fest 2024 registration is now open',
      timestamp: '2024-03-10T09:15:00Z',
      read: true,
      actionUrl: '/student/events'
    }
  ],
  teacher: [
    {
      id: '1',
      type: 'warning',
      title: 'Pending Approvals',
      message: '8 student activities are waiting for your approval',
      timestamp: '2024-03-12T11:00:00Z',
      read: false,
      actionUrl: '/teacher/approvals'
    },
    {
      id: '2',
      type: 'info',
      title: 'Class Compliance Alert',
      message: 'CSE Final Year class has 3 students at risk of not meeting MAP requirements',
      timestamp: '2024-03-11T16:45:00Z',
      read: false
    },
    {
      id: '3',
      type: 'success',
      title: 'Monthly Report Ready',
      message: 'Your monthly activity approval report is ready for download',
      timestamp: '2024-03-10T08:30:00Z',
      read: true
    }
  ],
  admin: [
    {
      id: '1',
      type: 'error',
      title: 'System Alert',
      message: 'Database backup failed. Immediate attention required.',
      timestamp: '2024-03-12T12:00:00Z',
      read: false,
      actionUrl: '/admin/settings'
    },
    {
      id: '2',
      type: 'warning',
      title: 'User Account Issues',
      message: '5 teacher accounts have pending permission updates',
      timestamp: '2024-03-11T15:30:00Z',
      read: false,
      actionUrl: '/admin/teachers'
    },
    {
      id: '3',
      type: 'info',
      title: 'Monthly Statistics',
      message: 'System usage increased by 23% this month. 2,543 active users.',
      timestamp: '2024-03-10T10:00:00Z',
      read: true
    }
  ]
};

export default function NotificationDropdown({ userType }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>(
    MOCK_NOTIFICATIONS[userType] || []
  );
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(n => n.id !== notificationId)
    );
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs h-6"
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            No notifications
          </div>
        ) : (
          <ScrollArea className="h-96">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="p-0 focus:bg-gray-50"
                onSelect={(e) => e.preventDefault()}
              >
                <div className="w-full p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className={`text-sm font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className={`text-xs ${notification.read ? 'text-gray-500' : 'text-gray-700'} mt-1`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          <div className="flex items-center space-x-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-6 w-6 p-0"
                                title="Mark as read"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer justify-center">
          <Settings className="mr-2 h-4 w-4" />
          <span>Notification Settings</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
