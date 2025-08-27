import { useState, useEffect, useCallback } from 'react';

interface LiveDataOptions {
  refreshInterval?: number; // in milliseconds
  enabled?: boolean;
  dependencies?: any[];
}

export function useLiveData<T>(
  fetchFunction: () => Promise<T>,
  initialData: T,
  options: LiveDataOptions = {}
) {
  const {
    refreshInterval = 30000, // 30 seconds default
    enabled = true,
    dependencies = []
  } = options;

  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshData = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const newData = await fetchFunction();
      setData(newData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, enabled, ...dependencies]);

  // Auto-refresh
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(refreshData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshData, refreshInterval, enabled]);

  // Initial load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refresh: refreshData
  };
}

// Real-time notifications hook
export function useRealTimeNotifications(userType: string) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simulate WebSocket connection for real-time updates
    const simulateRealTimeUpdates = () => {
      const eventSource = new EventSource('/api/notifications/stream');
      
      eventSource.onmessage = (event) => {
        const notification = JSON.parse(event.data);
        setNotifications(prev => [notification, ...prev.slice(0, 19)]);
        setUnreadCount(prev => prev + 1);
      };

      return () => eventSource.close();
    };

    // For demo purposes, simulate periodic updates
    const interval = setInterval(() => {
      const mockNotification = {
        id: Date.now().toString(),
        type: 'info',
        title: 'Live Update',
        message: `Real-time update at ${new Date().toLocaleTimeString()}`,
        timestamp: new Date().toISOString(),
        read: false
      };

      setNotifications(prev => [mockNotification, ...prev.slice(0, 9)]);
      setUnreadCount(prev => prev + 1);
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [userType]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  };
}

// Connection status hook
export function useConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Simulate server connectivity check
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/health', { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        setIsConnected(response.ok);
      } catch {
        setIsConnected(false);
      }
    };

    const interval = setInterval(checkConnection, 30000);
    checkConnection();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return { isOnline, isConnected };
}
