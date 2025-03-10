import React, { useEffect, useState } from "react";
import { View, Pressable, Platform } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Progress } from "~/components/ui/progress";
import { Badge } from "~/components/ui/badge";
import { Habit, HabitHistory } from "~/types";
import { CircleCheckBig } from "~/lib/icons/CircleCheckBig";
import { Trash } from "~/lib/icons/Trash";
import useHabitStore from "~/utils/store";
import { keepOnlyDate } from "~/utils/date-splitter";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";

import { seeScheduledNotifications } from "~/utils/notifications";

// HabitItem component to display individual habits
const HabitItem = ({
  habit,
  habitHistory, // Just for logging purposes
  completeHabit,
  deleteHabitAndHistory,
  archiveHabitCompletions,
}: {
  habit: Habit;
  habitHistory: HabitHistory; // Just for logging purposes
  completeHabit: (habit: Habit) => void;
  deleteHabitAndHistory: (habit: Habit) => void;
  archiveHabitCompletions: (habitId: string) => void;
}) => {
  const [isDeleteAlertDialogOpen, setDeleteAlertDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setCompleteDialogOpen] = useState(false);

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  // Calculate completion ratio for the current week
  const completedThisWeek = habit.recentCompletions.length;
  const completionRatio = completedThisWeek / habit.daysPerWeek;

  const isCompletedToday = () => {
    const lastCompletionDate = habit.recentCompletions[habit.recentCompletions.length - 1];
    const today = keepOnlyDate(new Date());
    return lastCompletionDate === today;
  };

  const handleCompleteHabit = () => {
    completeHabit(habit);
    archiveHabitCompletions(habit.id);
    setCompleteDialogOpen(true);
  };

  const handleDeleteHabit = () => {
    deleteHabitAndHistory(habit);
  };

  const handleLongPress = () => {
    console.log(habit);
  };

  const logHabit = () => {
    console.log(`🔍 Habit Details for "${habit.name}":`);
    console.log(JSON.stringify(habit, null, 2));
    console.log(JSON.stringify(habitHistory, null, 2));
    seeScheduledNotifications();
  };

  // Determine progress color based on completion ratio
  const getProgressColor = () => {
    if (completionRatio === 1) return "bg-green-500";
    if (isCompletedToday()) return "bg-green-500";
    return "bg-yellow-500 dark:bg-gray-400";
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <View
          className={`p-4 active:opacity-50 active:scale-95 rounded-lg mb-3 border ${
            isCompletedToday() ? "border-green-500" : "border-gray-200 dark:border-gray-700"
          }`}
        >
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center flex-1">
              <Dialog open={isCompleteDialogOpen} onOpenChange={setCompleteDialogOpen}>
                <DialogTrigger asChild>
                  <Pressable onPress={isCompletedToday() ? null : handleCompleteHabit} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <CircleCheckBig size={24} style={{ marginRight: 8 }} className={isCompletedToday() ? "text-green-500 " : "text-gray-400 "} />
                  </Pressable>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Congratulations! 🎉</DialogTitle>
                    <DialogDescription>{`You've successfully completed ${habit.name}! `}</DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <Text className="flex-1 text-lg">{habit.name}</Text>
            </View>
            <Badge variant="outline" className="ml-2">
              <Text>
                {completedThisWeek}/{habit.daysPerWeek}
              </Text>
            </Badge>
          </View>

          <Progress value={completionRatio * 100} className="h-2 w-full" indicatorClassName={getProgressColor()} />
        </View>
      </ContextMenuTrigger>
      <ContextMenuContent align="start" insets={contentInsets} className="w-64 native:w-72">
        <ContextMenuItem inset onPress={logHabit}>
          <Text>Log Habit</Text>
        </ContextMenuItem>

        <AlertDialog open={isDeleteAlertDialogOpen} onOpenChange={setDeleteAlertDialogOpen}>
          <AlertDialogTrigger asChild>
            <ContextMenuItem inset closeOnPress={false}>
              <Text className="text-destructive font-semibold">Delete Habit</Text>
              <Trash size={18} className="text-destructive  ml-auto mr-4" />
            </ContextMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone. This will permanently delete all of your habit's data.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <Text>Cancel</Text>
              </AlertDialogCancel>
              <AlertDialogAction onPress={handleDeleteHabit} className="bg-destructive text-destructive-foreground">
                <Text>Continue</Text>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default function HabitList() {
  const { habits, habitHistories, fetchHabits, completeHabit, deleteHabitAndHistory, archiveHabitCompletions, fetchHabitHistories, fetchDummyData } =
    useHabitStore();

  useEffect(() => {
    fetchHabits();
    fetchHabitHistories();
    //fetchDummyData();
  }, []);

  return (
    <>
      {habits.length > 0 &&
        habits.map((habit: Habit) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            completeHabit={completeHabit}
            deleteHabitAndHistory={deleteHabitAndHistory}
            archiveHabitCompletions={archiveHabitCompletions}
            habitHistory={habitHistories.find((history) => history.habitId === habit.id) || { habitId: habit.id, completionDates: [] }}
          />
        ))}
      {habits.length === 0 && (
        <Text className="text-center text-gray-500 mt-72">
          {" "}
          Create your first habit by tapping on the plus button at the bottom right of the screen!
        </Text>
      )}
    </>
  );
}
