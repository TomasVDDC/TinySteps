import { create } from 'zustand'
import { Habit, HabitHistory } from '~/types'
import AsyncStorage from '@react-native-async-storage/async-storage';
import "react-native-get-random-values";
import { v4 as uuidv4 } from 'uuid';
import { keepOnlyDate, keepOnlyTime } from '~/utils/date-splitter';
import { dummyHabits, dummyHabitHistory } from '~/dummy-data';
import { FormData } from '~/types';

interface HabitState {
  habits: Habit[]
  habitHistory: HabitHistory[]
  loading: boolean
  
  // Actions
  createHabitFromForm: (formData: FormData) => Promise<void>
  fetchHabits: () => Promise<void>
  fetchHabitHistory: () => Promise<void>
  completeHabit: (habit: Habit) => Promise<void>
  deleteHabitAndHistory: (habit: Habit) => Promise<void>
  archiveHabitCompletions: (habitId: string) => Promise<void>

  
  fetchDummyData: () => Promise<void>
}


const storeData = async (value: any) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('@TinySteps:habits', jsonValue);
    } catch (error) {
        console.error("Error in storeData:", error)
    }
}

const storeHistoryData = async (value: any) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('@TinySteps:habitHistory', jsonValue);
    } catch (error) {
        console.error("Error in storeHistoryData:", error)
    }
}


const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  habitHistory: [],
  loading: false,
  

  fetchDummyData: async () => {
    set({ habits: dummyHabits, habitHistory: dummyHabitHistory })
    await storeData(dummyHabits)
    await storeHistoryData(dummyHabitHistory)
  },

// ************** HABIT FUNCTIONS **************
  fetchHabits: async () => {
    set({ loading: true })
    try {
      const habitsString = await AsyncStorage.getItem('@TinySteps:habits');
      const habits = JSON.parse(habitsString || '[]')
      set({ habits, loading: false })
    } catch (error) {
      console.error(error)
      set({ loading: false })
    }
  },
  

  createHabitFromForm: async (formData: FormData) => {
    
      const timeString = keepOnlyTime(formData.notificationDate);

      const notificationSchedule = formData.notificationDays.reduce((total: Record<string, string>, day) => ({
        ...total,
        [day]: timeString
      }), {});

      const newHabit: Habit = {
        id: uuidv4(),
        name: formData.habitName,
        daysPerWeek: parseInt(formData.daysPerWeek.value),
        notificationSchedule: notificationSchedule,
        recentCompletions: [],
        createdAt: new Date().toISOString()
      };

    const { habits } = get()
    const updatedHabits = [...habits, newHabit]
    set({ habits: updatedHabits })
    await storeData(updatedHabits)
  },
  
  completeHabit: async (habit: Habit) => {
    const todayDate = keepOnlyDate(new Date());
    const { habits } = get()
    const updatedHabits = habits.map((h: Habit) => 
      h.id === habit.id 
        ? { ...h, recentCompletions: [...h.recentCompletions, todayDate] } 
        : h
    )
    set({ habits: updatedHabits })
    await storeData(updatedHabits)
  },

  deleteHabitAndHistory: async (habit: Habit) => {
    const { habits, habitHistory } = get()
    const updatedHabits = habits.filter((h: Habit) => h.id !== habit.id)
    
    // Also remove any history for this habit
    const updatedHistory = habitHistory.filter((h: HabitHistory) => h.habitId !== habit.id)
    
    set({ habits: updatedHabits, habitHistory: updatedHistory })
    await storeData(updatedHabits)
    await storeHistoryData(updatedHistory)
  },



  fetchHabitHistory: async () => {
    set({ loading: true })
    try {
      const historyString = await AsyncStorage.getItem('@TinySteps:habitHistory');
      const habitHistory = JSON.parse(historyString || '[]')
      set({ habitHistory, loading: false })
    } catch (error) {
      console.error(error)
      set({ loading: false })
    }
  },

  
  archiveHabitCompletions: async (habitId: string) => {
    const { habitHistory } = get()
    const todayDate = keepOnlyDate(new Date());
    
    // Find existing habit history index in the array return -1 if not found
    const existingHistoryIndex = habitHistory.findIndex(
      (history: HabitHistory) => history.habitId === habitId
    );
    
    let updatedHistory;
    
    if (existingHistoryIndex >= 0) {
      // Update existing history record
      updatedHistory = habitHistory.map((history: HabitHistory) => 
        history.habitId === habitId
          ? { ...history, completionDates: [...history.completionDates, todayDate] }
          : history
      );
    } else {
      // Create new history record
      const newHistory: HabitHistory = {
        habitId,
        completionDates: [todayDate]
      };
      updatedHistory = [...habitHistory, newHistory];
    }
    
    set({ habitHistory: updatedHistory })
    await storeHistoryData(updatedHistory)
    
  }
}))

export default useHabitStore