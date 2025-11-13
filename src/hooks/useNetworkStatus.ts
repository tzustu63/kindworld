import { useState, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Hook to monitor network connectivity status
 * Note: For production, consider using @react-native-community/netinfo
 */
export const useNetworkStatus = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const checkConnection = async () => {
    try {
      // Simple connectivity check
      // In production, use @react-native-community/netinfo for better detection
      const response = await fetch('https://www.google.com', {
        method: 'HEAD',
        cache: 'no-cache',
      });
      setIsOffline(!response.ok);
    } catch (error) {
      setIsOffline(true);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Check connection when app comes to foreground
    if (appState === 'active') {
      checkConnection();
    }
  }, [appState]);

  return {
    isOffline,
    checkConnection,
  };
};
