import { View, StyleSheet } from "react-native";
import { Text } from "~/components/ui/text";
import { Calendar, CalendarList, Agenda, CalendarProps } from "react-native-calendars";
import { useRef, useState } from "react";
// import { dummyHabitHistories } from "~/dummy-data";
import { Habit, HabitHistory } from "~/types";
import React, { useEffect } from "react";
import useHabitStore from "~/utils/store";
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from "~/components/ui/toggle-group";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, FadeIn, FadeOut } from "react-native-reanimated";

export default function CalendarScreen() {
  const { habits, habitHistories } = useHabitStore();
  const [habitIdToggled, setHabitIdToggled] = useState<string | undefined>("");

  function handleHabitIdToggled(value: string | undefined) {
    setHabitIdToggled(value);
  }

  // Currently I am not using the tailwindcolors because the names are not supported by react-native-calendars
  const Colors = ["red", "orange", "yellow", "green", "blue"];

  // Create a mapping of habit IDs to colors
  const habitColorMap: { [habitId: string]: string } = habits.reduce((map, habit, index) => {
    const colorIndex = index % Colors.length;
    return {
      ...map,
      [habit.id]: Colors[colorIndex],
    };
  }, {});

  const markedDates = transformHabitHistories(habitHistories, habitIdToggled, habitColorMap);

  return (
    <>
      <CalendarList
        pastScrollRange={24}
        futureScrollRange={3}
        scrollEnabled={true}
        showScrollIndicator={true}
        markingType={"multi-dot"}
        markedDates={markedDates}
      />

      <View className="absolute bottom-32 android:bottom-16 w-full flex-row gap-2 items-center justify-center">
        <Animated.View entering={FadeIn.duration(400)} exiting={FadeOut.duration(300)}>
          <ToggleGroup
            className="flex-col gap-0 items-start bg-white rounded-md p-3 border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-600"
            value={habitIdToggled}
            onValueChange={handleHabitIdToggled}
            type="single"
          >
            {habitHistories.map((History, index) => (
              <ToggleGroupItem size="none" key={index} value={History.habitId} aria-label={History.habitId} asChild>
                <View className="flex-row items-center gap-2 px-2 py-[1px] ">
                  {/* Tailwind classnames need to be written in full, not be dinamically generated. Cant do this bg-${Colors[index]}-300 */}
                  <View className="w-3 h-3 rounded-full mt-[1px] mx-[1px]" style={{ backgroundColor: habitColorMap[History.habitId] }} />
                  <Text>{habits.find((habit) => habit.id === History.habitId)?.name}</Text>
                </View>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Animated.View>

        {habitIdToggled && (
          <Animated.View
            className="border-2 border-gray-100 dark:border-gray-700 rounded-md bg-white dark:bg-gray-600 p-3"
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(300)}
          >
            <Text>Statistics</Text>
          </Animated.View>
        )}
      </View>
    </>
  );
}

function transformHabitHistories(
  habitHistoryArray: HabitHistory[],
  habitIdToggled: string | undefined,
  habitColorMap: { [habitId: string]: string }
) {
  const dateToHabitsMap: { [date: string]: { dots: { key: string; color: string }[] } } = {};

  if (habitIdToggled) {
    habitHistoryArray = habitHistoryArray.filter((habit) => habit.habitId === habitIdToggled);
  }

  habitHistoryArray.forEach((habit) => {
    habit.completionDates.forEach((date) => {
      // If the date doesn't exist in the map yet, initialize an empty array
      if (!dateToHabitsMap[date]) {
        dateToHabitsMap[date] = { dots: [] };
      }

      // Use the habitColorMap instead of Colors[index]
      dateToHabitsMap[date].dots.push({
        key: habit.habitId,
        color: habitColorMap[habit.habitId] || "gray", // Fallback to gray if no color is found
      });
    });
  });

  return dateToHabitsMap;
}

// Custom wrapper for CalendarList to track renders and timing
