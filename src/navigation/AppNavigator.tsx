import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import DetailsScreen from '../screens/DetailsScreen';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: '#333',
        },
        tabBarActiveTintColor: '#E50914',
        tabBarInactiveTintColor: '#888',
        tabBarIcon: ({ color, size }) => {
            let icon = '🏠';
            if (route.name === 'Watchlist') icon = '🔖';
            return <Text style={{ fontSize: size }}>{icon}</Text>;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Watchlist" component={WatchlistScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
            backgroundColor: '#000'
        }
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen} 
        options={{ title: 'Movie Details' }} // Or dynamic title
      />
    </Stack.Navigator>
  );
};
