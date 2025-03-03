import { create } from 'zustand'
import { Habit } from '~/types'
import AsyncStorage from '@react-native-async-storage/async-storage';
import "react-native-get-random-values";
import { v4 as uuidv4 } from 'uuid';
import { keepOnlyDate, keepOnlyTime } from '~/utils/date-splitter';
interface FormData {
  habitName: string;
  notificationTime: Date;
  //We don't need the label but it was easier to process outside
  daysPerWeek: {label: string, value: string};
  notificationDays: string[];
}

interface HabitState {
  habits: Habit[]
  loading: boolean
  
  // Actions
  createHabitFromForm: (formData: FormData) => Promise<void>
  fetchHabits: () => Promise<void>
  completeHabit: (habit: Habit) => Promise<void>
  deleteHabit: (habit: Habit) => Promise<void>
}


const storeData = async (value: any) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('@TinySteps:habits', jsonValue);
    } catch (error) {
        console.error("Error in storeData:", error)
    }
}


const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  loading: false,
  

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
    
      const timeString = keepOnlyTime(formData.notificationTime);

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
    const { habits } = get()
    const updatedHabits = habits.map((h: Habit) => 
      h.id === habit.id 
        ? { ...h, recentCompletions: [...h.recentCompletions, keepOnlyDate(new Date())] } 
        : h
    )
    set({ habits: updatedHabits })
    await storeData(updatedHabits)
  },

  deleteHabit: async (habit: Habit) => {
    const { habits } = get()
    const updatedHabits = habits.filter((h: Habit) => h.id !== habit.id)
    set({ habits: updatedHabits })
    await storeData(updatedHabits)
  }
}))

export default useHabitStore