import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  X, 
  Wifi, 
  WifiOff, 
  AlertCircle,
  CheckCircle,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { useConnectionStatus } from '@/hooks/useLiveData';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  header: React.ReactNode;
  sidebar?: React.ReactNode;
  userType: 'student' | 'teacher' | 'admin';
}

export default function ResponsiveLayout({ 
  children, 
  header, 
  sidebar, 
  userType 
}: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const { isOnline, isConnected } = useConnectionStatus();

  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);

    // PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('resize', checkViewport);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!installPrompt) return;

    const result = await installPrompt.prompt();
    if (result.outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  const getDeviceIcon = () => {
    if (isMobile) return <Smartphone className="h-3 w-3" />;
    if (isTablet) return <Tablet className="h-3 w-3" />;
    return <Monitor className="h-3 w-3" />;
  };

  const ConnectionStatus = () => (
    <div className="flex items-center space-x-2">
      {isOnline ? (
        isConnected ? (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Online
          </Badge>
        ) : (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            <AlertCircle className="h-3 w-3 mr-1" />
            Limited
          </Badge>
        )
      ) : (
        <Badge variant="outline" className="text-red-600 border-red-600">
          <WifiOff className="h-3 w-3 mr-1" />
          Offline
        </Badge>
      )}
      <Badge variant="outline" className="text-gray-600">
        {getDeviceIcon()}
        <span className="ml-1 hidden sm:inline">
          {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}
        </span>
      </Badge>
    </div>
  );

  // Mobile-first responsive design
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile Header */}
        <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              {sidebar && (
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    {sidebar}
                  </SheetContent>
                </Sheet>
              )}
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {userType === 'admin' ? 'Admin' : userType === 'teacher' ? 'Teacher' : 'Student'}
              </h1>
            </div>
            <ConnectionStatus />
          </div>
          {header}
        </div>

        {/* Mobile Content */}
        <main className="p-4 pb-20">
          {!isOnline && (
            <Card className="mb-4 border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-red-800">
                  <WifiOff className="h-4 w-4" />
                  <span className="text-sm">You're offline. Some features may be limited.</span>
                </div>
              </CardContent>
            </Card>
          )}
          
          {installPrompt && (
            <Card className="mb-4 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <Smartphone className="h-4 w-4" />
                    <span className="text-sm">Install app for better experience</span>
                  </div>
                  <Button size="sm" onClick={handleInstallPWA}>
                    Install
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {children}
        </main>

        {/* Mobile Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-around">
            <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
              <span className="text-xs">Home</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
              <span className="text-xs">Activities</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
              <span className="text-xs">Progress</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
              <span className="text-xs">More</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop/Tablet Layout
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        {header}
        
        {/* Status Bar */}
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
            <ConnectionStatus />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex">
        {/* Sidebar */}
        {sidebar && (
          <div className="hidden lg:block w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
            {sidebar}
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {!isOnline && (
            <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">
                  <WifiOff className="h-4 w-4" />
                  <span>You're offline. Some features may be limited.</span>
                </div>
              </CardContent>
            </Card>
          )}

          {installPrompt && (
            <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                    <Smartphone className="h-4 w-4" />
                    <span>Install this app for a better experience with offline support</span>
                  </div>
                  <Button size="sm" onClick={handleInstallPWA}>
                    Install App
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
