import { create } from 'zustand'
import { Habit } from '~/types'
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HabitState {
  habits: Habit[]
  loading: boolean
  
  // Actions
  fetchHabits: () => Promise<void>
  addHabit: (habit: Habit) => Promise<void>
  completeHabit: (habit: Habit) => Promise<void>
  deleteHabit: (habit: Habit) => Promise<void>
}


const storeData = async (value: any) => {
  const jsonValue = JSON.stringify(value);
  await AsyncStorage.setItem('@TinySteps:habits', jsonValue);
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
  
  addHabit: async (habit: Habit) => {
    const { habits } = get()
    const updatedHabits = [...habits, habit]
    set({ habits: updatedHabits })
    await storeData(updatedHabits)
  },
  
  completeHabit: async (habit: Habit) => {
    const { habits } = get()
    const updatedHabits = habits.map((h: Habit) => 
      h.id === habit.id 
        ? { ...h, recentCompletions: [...h.recentCompletions, new Date().toISOString()] } 
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