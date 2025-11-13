import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignInScreen } from '../screens';
import { useAuth } from '../hooks/useAuth';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

const RootNavigator: React.FC = () => {
  const { isAuthenticated, isInitializing } = useAuth();

  // Show nothing while initializing auth state
  if (isInitializing) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 200,
          animationTypeForReplace: 'push',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}>
        {!isAuthenticated ? (
          <Stack.Screen name="SignIn" component={SignInScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
