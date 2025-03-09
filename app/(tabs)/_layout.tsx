import { Tabs } from "expo-router";
import React from "react";
import { Platform, Pressable } from "react-native";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Home } from "~/lib/icons/Home";
import { Calendar } from "~/lib/icons/Calendar";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Habits",

          headerRight: () => <ThemeToggle />,
          tabBarIcon: ({ color }) => <Home size={28} color={color} />,
          tabBarShowLabel: true,
          tabBarButton: (props) => <Pressable {...props} android_ripple={{ color: "transparent" }} style={props.style} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => <Calendar size={28} color={color} />,
          tabBarShowLabel: true,
          // This is to prevent the calendar from being lazy loaded - took too long to load
          lazy: false,
          tabBarButton: (props) => <Pressable {...props} android_ripple={{ color: "transparent" }} style={props.style} />,
        }}
      />
    </Tabs>
  );
}
