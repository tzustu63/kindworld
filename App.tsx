import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from '@store/index';
import RootNavigator from '@/navigation/RootNavigator';
import { monitoringService } from '@/services/monitoringService';

const App: React.FC = () => {
  useEffect(() => {
    // Initialize monitoring services on app start
    monitoringService.initialize().catch((error) => {
      console.error('Failed to initialize monitoring:', error);
    });
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
