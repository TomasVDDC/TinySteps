import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { ThemeToggle } from '~/components/ThemeToggle';
import { Home } from '~/lib/icons/Home';
import { Info } from '~/lib/icons/Info';


export default function TabLayout() {


  return (
    <Tabs
      screenOptions={{
      
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
            title: 'Habits',
            headerRight: () => <ThemeToggle />,
            tabBarIcon: ({ color }) => <Home size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) =>  <Info size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
