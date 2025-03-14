import { create } from "zustand";
import { Habit, HabitHistory } from "~/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { keepOnlyDate, keepOnlyTime } from "~/utils/date-splitter";
import { dummyHabits, dummyHabitHistories } from "~/dummy-data";
import { FormData } from "~/types";
import { isSameWeek } from "date-fns";

interface HabitState {
  habits: Habit[];
  habitHistories: HabitHistory[];
  loading: boolean;

  // Actions
  createHabitFromForm: (formData: FormData) => Promise<void>;
  fetchHabits: () => Promise<void>;
  fetchHabitHistories: () => Promise<void>;
  completeHabit: (habit: Habit) => Promise<void>;
  deleteHabitAndHistory: (habit: Habit) => Promise<void>;
  archiveHabitCompletions: (habitId: string) => Promise<void>;
  resetOldCompletions: () => Promise<void>;

  fetchDummyData: () => Promise<void>;
}

const storeData = async (value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("@TinySteps:habits", jsonValue);
  } catch (error) {
    console.error("Error in storeData:", error);
  }
};

const storeHistoryData = async (value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("@TinySteps:habitHistories", jsonValue);
  } catch (error) {
    console.error("Error in storeHistoryData:", error);
  }
};

const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  habitHistories: [],
  loading: false,

  fetchDummyData: async () => {
    set({ habits: dummyHabits, habitHistories: dummyHabitHistories });
    await storeData(dummyHabits);
    await storeHistoryData(dummyHabitHistories);
  },

  // ************** HABIT FUNCTIONS **************
  fetchHabits: async () => {
    set({ loading: true });
    try {
      const habitsString = await AsyncStorage.getItem("@TinySteps:habits");
      const habits = JSON.parse(habitsString || "[]");
      set({ habits, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  createHabitFromForm: async (formData: FormData) => {
    const timeString = keepOnlyTime(formData.notificationDate);

    const notificationSchedule = formData.notificationDays.reduce(
      (total: Record<string, string>, day) => ({
        ...total,
        [day]: timeString,
      }),
      {}
    );

    const newHabit: Habit = {
      id: uuidv4(),
      name: formData.habitName,
      daysPerWeek: parseInt(formData.daysPerWeek.value),
      notificationSchedule: notificationSchedule,
      recentCompletions: [],
      createdAt: new Date().toISOString(),
    };

    const { habits } = get();
    const updatedHabits = [...habits, newHabit];
    set({ habits: updatedHabits });
    await storeData(updatedHabits);
  },

  completeHabit: async (habit: Habit) => {
    const todayDate = keepOnlyDate(new Date());
    const { habits } = get();
    const updatedHabits = habits.map((h: Habit) => (h.id === habit.id ? { ...h, recentCompletions: [...h.recentCompletions, todayDate] } : h));
    set({ habits: updatedHabits });
    await storeData(updatedHabits);
  },

  deleteHabitAndHistory: async (habit: Habit) => {
    const { habits, habitHistories } = get();
    const updatedHabits = habits.filter((h: Habit) => h.id !== habit.id);

    // Also remove any history for this habit
    const updatedHistories = habitHistories.filter((h: HabitHistory) => h.habitId !== habit.id);

    set({ habits: updatedHabits, habitHistories: updatedHistories });
    await storeData(updatedHabits);
    await storeHistoryData(updatedHistories);
  },

  fetchHabitHistories: async () => {
    set({ loading: true });
    try {
      const historyString = await AsyncStorage.getItem("@TinySteps:habitHistories");
      const habitHistories = JSON.parse(historyString || "[]");
      set({ habitHistories, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  archiveHabitCompletions: async (habitId: string) => {
    const { habitHistories } = get();
    const todayDate = keepOnlyDate(new Date());

    // Find existing habit history index in the array return -1 if not found
    const existingHistoryIndex = habitHistories.findIndex((history: HabitHistory) => history.habitId === habitId);

    let updatedHistories;

    if (existingHistoryIndex >= 0) {
      // Update existing history record
      updatedHistories = habitHistories.map((history: HabitHistory) =>
        history.habitId === habitId ? { ...history, completionDates: [...history.completionDates, todayDate] } : history
      );
    } else {
      // Create new history record
      const newHistory: HabitHistory = {
        habitId,
        completionDates: [todayDate],
      };
      updatedHistories = [...habitHistories, newHistory];
    }

    set({ habitHistories: updatedHistories });
    await storeHistoryData(updatedHistories);
  },

  resetOldCompletions: async () => {
    const { habits } = get();
    const currentDate = new Date();

    const updatedHabits = habits.map((habit: Habit) => {
      // Skip if no completions
      if (habit.recentCompletions.length === 0) return habit;

      // Get the last completion date
      const lastCompletion = new Date(habit.recentCompletions[habit.recentCompletions.length - 1]);

      // Check if in same week using date-fns
      const sameWeek = isSameWeek(lastCompletion, currentDate);

      // If not in the same week, reset completions
      if (!sameWeek) {
        return { ...habit, recentCompletions: [] };
      }

      return habit;
    });

    // Update if any habits were changed
    if (JSON.stringify(habits) !== JSON.stringify(updatedHabits)) {
      set({ habits: updatedHabits });
      await storeData(updatedHabits);
    }
  },
}));

export default useHabitStore;
