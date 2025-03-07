import { View, StyleSheet } from "react-native";
import { Text } from "~/components/ui/text";
import { Calendar, CalendarList, Agenda, CalendarProps } from "react-native-calendars";
import { useRef, useState } from "react";
// import { dummyHabitHistories } from "~/dummy-data";
import { Habit, HabitHistory } from "~/types";
import React, { useEffect } from "react";
import useHabitStore from "~/utils/store";
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from "~/components/ui/toggle-group";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, withSpring, FadeIn, FadeOut, interpolate } from "react-native-reanimated";
import { getIntervalInWeeks } from "~/utils/date-splitter";

export default function CalendarScreen() {
  const { habits, habitHistories } = useHabitStore();
  const [habitIdToggled, setHabitIdToggled] = useState<string | undefined>("");
  const [markedDates, setMarkedDates] = useState<{ [date: string]: { dots: { key: string; color: string }[] } }>({});
  const [habitStats, setHabitStats] = useState<{ [habitId: string]: { total: number; weeklyCompletionRate: number } }>({});

  useEffect(() => {
    setMarkedDates(transformHabitHistories(habitHistories, habitIdToggled, habitColorMap));
  }, [habitIdToggled, habitHistories]);

  useEffect(() => {
    console.log("habitStats", habitStats);
    setHabitStats(calculateHabitStats(habitHistories, habits));
  }, [habitHistories]);

  const contentWidth = useSharedValue(0);
  const maxContentWidth = 160;

  function handleHabitIdToggled(value: string | undefined) {
    console.log("value", value);
    setHabitIdToggled(value);

    contentWidth.value = withTiming(value ? maxContentWidth : 0, { duration: 300 });
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

        <Animated.View
          style={useAnimatedStyle(() => ({ width: contentWidth.value }))}
          className={`h-full bg-white dark:bg-gray-600 ${habitIdToggled ? "border-2 border-gray-100 dark:border-gray-700 rounded-md p-3" : ""}`}
        >
          {habitIdToggled && (
            <View style={{ width: maxContentWidth }}>
              <View className="flex-row items-center mb-3 border-b border-gray-100 dark:border-gray-500 pb-2">
                <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: habitColorMap[habitIdToggled] || "gray" }} />
                <Text style={{ width: maxContentWidth - 30 }} className="text-lg font-bold text-wrap">
                  {habits.find((habit) => habit.id === habitIdToggled)?.name}
                </Text>
              </View>

              <Text className="text-sm text-gray-500 dark:text-gray-300 mb-1">Statistics</Text>

              <View style={{ width: 120 }} className="mt-2 space-y-3">
                <View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600 dark:text-gray-300">Total</Text>
                    <Text className="font-semibold">{habitStats[habitIdToggled]?.total || 0}</Text>
                  </View>
                </View>

                <View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600 dark:text-gray-300">Rate</Text>
                    <Text className="font-semibold">{habitStats[habitIdToggled]?.weeklyCompletionRate || 0}%</Text>
                  </View>

                  {habitStats[habitIdToggled]?.total > 0 && (
                    <View className="mt-1 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${habitStats[habitIdToggled]?.weeklyCompletionRate}%`,
                          backgroundColor: habitColorMap[habitIdToggled] || "gray",
                        }}
                      />
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
        </Animated.View>
      </View>
    </>
  );
}

function calculateHabitStats(habitHistories: HabitHistory[], habits: Habit[]) {
  const habitStats: { [habitId: string]: { total: number; weeklyCompletionRate: number } } = {};

  habitHistories.forEach((history) => {
    const habit = habits.find((habit) => habit.id === history.habitId);
    console.log(habit?.name);
    const total = history.completionDates.length;
    console.log("total", total);
    const target =
      habit?.daysPerWeek *
      getIntervalInWeeks(new Date(history.completionDates[history.completionDates.length - 1]), new Date(history.completionDates[0]));
    console.log("target", target);
    const completionRate = total > 0 ? Math.round((total / target) * 100) : 0;
    console.log("completionRate", completionRate);
    habitStats[history.habitId] = { total, weeklyCompletionRate: completionRate };
  });

  return habitStats;
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
