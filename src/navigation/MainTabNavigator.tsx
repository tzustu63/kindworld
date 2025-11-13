import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  DashboardScreen,
  SearchScreen,
  ActivityScreen,
  ProfileScreen,
} from '../screens';
import { BottomNav } from '../components';
import { BottomTabParamList } from './types';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        lazy: true,
        unmountOnBlur: false,
      }}>
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarAccessibilityLabel: 'Home tab',
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarAccessibilityLabel: 'Search tab',
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{
          tabBarLabel: 'Activity',
          tabBarAccessibilityLabel: 'Activity tab',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarAccessibilityLabel: 'Profile tab',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
