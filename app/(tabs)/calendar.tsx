import { View, StyleSheet } from "react-native";
import { Text } from "~/components/ui/text";
import { Calendar, CalendarList, Agenda, CalendarProps, DateData } from "react-native-calendars";
import { useRef, useState } from "react";
import { Habit, HabitHistory } from "~/types";
import React, { useEffect } from "react";
import useHabitStore from "~/utils/store";
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from "~/components/ui/toggle-group";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, withSpring, FadeIn, FadeOut, interpolate } from "react-native-reanimated";
import { getWeek } from "~/utils/date-splitter";
import { differenceInWeeks, getWeekOfMonth, getWeeksInMonth } from "date-fns";
import { _ } from "lodash";

export default function CalendarScreen() {
  const { habits, habitHistories, fetchHabitHistories, fetchHabits } = useHabitStore();
  const [habitIdToggled, setHabitIdToggled] = useState<string | undefined>();
  const [markedDates, setMarkedDates] = useState<{ [date: string]: { dots: { key: string; color: string }[] } }>({});
  const [habitStats, setHabitStats] = useState<{ [habitId: string]: { total: number; weeklyCompletionRate: number } }>({});
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [completionsInMonth, setCompletionsInMonth] = useState<{ numberCompleted: number; goalForMonth: number }>({
    numberCompleted: 0,
    goalForMonth: 0,
  });

  useEffect(() => {
    console.log("habitHistories", habitHistories);
    console.log("habits", habits);
    setMarkedDates(transformHabitHistories(habitHistories, habitIdToggled, habitColorMap));
    setHabitStats(calculateHabitStats(habitHistories, habits));
  }, [habitIdToggled, habitHistories]);

  useEffect(() => {
    // When the user opens the calendar the first habit should be toggled to show the stats
    handleHabitIdToggled(habitHistories[0]?.habitId);
  }, [habits]);

  useEffect(() => {
    if (habitHistories.length > 0) {
      console.log("habitHistories", habitHistories);
      setCompletionsInMonth(calculateCompletedHabitsInMonth(habitIdToggled, habitHistories, habits, currentMonth));
    }
  }, [currentMonth, habitIdToggled]);

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
    <View className="flex-1 pt-16">
      <CalendarList
        onVisibleMonthsChange={(months) => {
          setCurrentMonth(months[0].month - 1); // -1 so that January is 0, February is 1, etc. (Standard for JS Date);
        }}
        pastScrollRange={24}
        futureScrollRange={3}
        scrollEnabled={true}
        showScrollIndicator={true}
        markingType={"multi-dot"}
        markedDates={markedDates}
      />
      {/* Monthly Progress */}
      <View className="absolute top-20 left-4 bg-white dark:bg-gray-600 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700">
        <View className="flex-row items-center mb-2">
          <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: habitIdToggled ? habitColorMap[habitIdToggled] : "gray" }} />
          <Text className="font-medium">Monthly Progress</Text>
        </View>

        <View className="flex-row items-baseline gap-1 mb-1">
          <Text className="text-xl font-bold">{completionsInMonth.numberCompleted || 0}</Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">/ {completionsInMonth.goalForMonth || 0}</Text>
        </View>

        {completionsInMonth.goalForMonth > 0 && (
          <View className="mt-1 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden w-full">
            <View
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, ((completionsInMonth.numberCompleted || 0) / (completionsInMonth.goalForMonth || 1)) * 100)}%`,
                backgroundColor: habitIdToggled ? habitColorMap[habitIdToggled] : "gray",
              }}
            />
          </View>
        )}

        {/* Celebration animation when goal is met or exceeded */}
        {completionsInMonth.goalForMonth > 0 && completionsInMonth.numberCompleted >= completionsInMonth.goalForMonth && (
          <Animated.View entering={FadeIn.duration(300)} className="mt-2 items-center">
            <Text className="text-sm font-bold text-green-600 dark:text-green-400">🎉 Goal Achieved! 🎉 </Text>
          </Animated.View>
        )}
      </View>

      {/* Habit menu */}

      <View className="absolute  ios:bottom-24 shadow-sm android:bottom-8 w-full flex-row gap-2 items-center justify-center">
        {habitHistories.length > 0 && (
          <ToggleGroup
            className="flex-col gap-0 items-start bg-white rounded-md p-3 mx-3 border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-600"
            value={habitIdToggled}
            onValueChange={handleHabitIdToggled}
            type="single"
          >
            {habitHistories.map((History, index) => (
              <ToggleGroupItem size="none" key={index} value={History.habitId} aria-label={History.habitId} asChild>
                <View className="flex-row items-center gap-2 px-2 py-[1px] ">
                  {/* Tailwind classnames need to be written in full, not be dinamically generated. Cant do this bg-${Colors[index]}-300 */}
                  <View className="w-3 h-3 rounded-full mt-[1px] mx-[1px]" style={{ backgroundColor: habitColorMap[History.habitId] }} />
                  <Text className="w-32">{habits.find((habit) => habit.id === History.habitId)?.name}</Text>
                </View>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
        <Animated.View
          style={useAnimatedStyle(() => ({ width: contentWidth.value }))}
          className={`h-full bg-white dark:bg-gray-600 ${habitIdToggled ? "border-2 border-gray-100 dark:border-gray-700 rounded-md p-3" : ""}`}
        >
          {habitIdToggled && (
            <View style={{ width: maxContentWidth }}>
              <View
                style={{ width: maxContentWidth - 30 }}
                className="  flex-row items-center mb-3 border-b border-gray-100 dark:border-gray-500 pb-2"
              >
                <View className="w-3 h-3  rounded-full mr-2" style={{ backgroundColor: habitColorMap[habitIdToggled] || "gray" }} />
                <Text className="text-lg font-bold text-wrap">{habits.find((habit) => habit.id === habitIdToggled)?.name}</Text>
              </View>

              <Text className="text-sm text-gray-500 dark:text-gray-300 mb-1">Statistics</Text>

              <View style={{ width: 120 }} className="  mt-2 space-y-3">
                <View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600 dark:text-gray-300">Total</Text>
                    <Text className="font-semibold">{habitStats[habitIdToggled]?.total || 0}</Text>
                  </View>
                </View>

                <View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600 dark:text-gray-300">Rate</Text>
                    <Text className="font-semibold">
                      {habitStats[habitIdToggled]?.weeklyCompletionRate != -1 ? habitStats[habitIdToggled]?.weeklyCompletionRate : "0"}%
                    </Text>
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
    </View>
  );
}

function calculateHabitStats(habitHistories: HabitHistory[], habits: Habit[]) {
  const habitStats: { [habitId: string]: { total: number; weeklyCompletionRate: number } } = {};

  habitHistories.forEach((history) => {
    const habit = habits.find((habit) => habit.id === history.habitId);

    const total = history.completionDates.length;

    const diffInWeeks = differenceInWeeks(
      new Date(history.completionDates[history.completionDates.length - 1]),
      new Date(history.completionDates[0])
    );
    if (diffInWeeks === 0) {
      // The user has not completed a full week so we can't calculate the completion rate
      habitStats[history.habitId] = { total, weeklyCompletionRate: -1 };
      return;
    }

    const target =
      habit?.daysPerWeek *
      differenceInWeeks(new Date(history.completionDates[history.completionDates.length - 1]), new Date(history.completionDates[0]));
    console.log("target", target);

    const completionRate = total > 0 ? Math.round((total / target) * 100) : 0;

    habitStats[history.habitId] = { total, weeklyCompletionRate: completionRate };
  });

  return habitStats;
}

function calculateCompletedHabitsInMonth(habitId: string | undefined, habitHistories: HabitHistory[], habits: Habit[], month: number) {
  const history = habitHistories.find((history) => history.habitId === habitId);
  console.log("history?.completionDates", history?.completionDates);
  const completedHabits = history?.completionDates.filter((completionDate) => {
    const completionDateObject = new Date(completionDate);
    return completionDateObject.getMonth() === month;
  });

  console.log("completedHabits", completedHabits);
  if (!completedHabits) {
    return { numberCompleted: 0, goalForMonth: 0 };
  }
  const firstCompletionDateOfMonth = new Date(completedHabits[0]);

  const weekOfMonth = getWeekOfMonth(firstCompletionDateOfMonth);
  console.log(
    "habit for the month",
    _.find(habits, (habit: Habit) => habit.id === habitId)
  );

  const totalWeeksInMonth = getWeeksInMonth(month);
  const remainingWeeksInMonth = totalWeeksInMonth - weekOfMonth + 1;

  const goalForMonth = remainingWeeksInMonth * _.find(habits, (habit: Habit) => habit.id === habitId)?.daysPerWeek;

  return { numberCompleted: completedHabits?.length, goalForMonth: goalForMonth };
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
