import { Habit, HabitHistory } from "~/types";

// Helper function to get today's date in YYYY-MM-DD format
const getTodayString = (): string => {
  return new Date().toISOString().split("T")[0];
};

// Helper function to get yesterday's date in YYYY-MM-DD format
const getYesterdayString = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
};

// Helper function to get a date from n days ago in YYYY-MM-DD format
const getDaysAgoString = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

// Dummy habits data
export const dummyHabits: Habit[] = [
  {
    id: "1",
    name: "Morning Meditation",
    daysPerWeek: 4,
    notificationSchedule: {
      monday: "07:00",
      tuesday: "07:00",
      wednesday: "07:00",
      thursday: "07:00",
      friday: "07:00",
      saturday: "08:00",
      sunday: "08:00",
    },
    recentCompletions: [getTodayString(), getYesterdayString(), getDaysAgoString(2), getDaysAgoString(3), getDaysAgoString(5)],
    createdAt: getDaysAgoString(30),
  },
  {
    id: "2",
    name: "Read 20 Pages",
    daysPerWeek: 5,
    notificationSchedule: {
      monday: "21:00",
      tuesday: "21:00",
      wednesday: "21:00",
      thursday: "21:00",
      friday: "21:00",
    },
    recentCompletions: [getTodayString(), getDaysAgoString(2), getDaysAgoString(4)],
    createdAt: getDaysAgoString(45),
  },
  {
    id: "3",
    name: "Drink 8 Glasses of Water",
    daysPerWeek: 7,
    notificationSchedule: {
      monday: "09:00",
      tuesday: "09:00",
      wednesday: "09:00",
      thursday: "09:00",
      friday: "09:00",
      saturday: "10:00",
      sunday: "10:00",
    },
    recentCompletions: [getYesterdayString(), getDaysAgoString(3), getDaysAgoString(4), getDaysAgoString(5), getDaysAgoString(6)],
    createdAt: getDaysAgoString(60),
  },
  {
    id: "4",
    name: "Exercise",
    daysPerWeek: 3,
    notificationSchedule: {
      monday: "18:00",
      wednesday: "18:00",
      friday: "18:00",
    },
    recentCompletions: [getDaysAgoString(2), getDaysAgoString(4)],
    createdAt: getDaysAgoString(20),
  },
  {
    id: "5",
    name: "Practice Guitar",
    daysPerWeek: 4,
    notificationSchedule: {
      monday: "19:30",
      wednesday: "19:30",
      friday: "19:30",
      sunday: "15:00",
    },
    recentCompletions: [getTodayString(), getDaysAgoString(3), getDaysAgoString(6)],
    createdAt: getDaysAgoString(15),
  },
];

// Dummy habit history data
export const dummyHabitHistories: HabitHistory[] = [
  {
    habitId: "1",
    completionDates: [
      getDaysAgoString(28),
      getDaysAgoString(27),
      getDaysAgoString(25),
      getDaysAgoString(24),
      getDaysAgoString(23),
      getDaysAgoString(21),
      getDaysAgoString(20),
      getDaysAgoString(19),
      getDaysAgoString(17),
      getDaysAgoString(16),
      getDaysAgoString(14),
      getDaysAgoString(13),
      getDaysAgoString(12),
      getDaysAgoString(10),
      getDaysAgoString(9),
      getDaysAgoString(8),
      getDaysAgoString(7),
      ...dummyHabits[0].recentCompletions,
    ],
  },
  {
    habitId: "2",
    completionDates: [
      getDaysAgoString(39),
      getDaysAgoString(37),
      getDaysAgoString(35),
      getDaysAgoString(32),
      getDaysAgoString(30),
      getDaysAgoString(28),
      getDaysAgoString(25),
      getDaysAgoString(23),
      getDaysAgoString(21),
      getDaysAgoString(18),
      getDaysAgoString(16),
      getDaysAgoString(14),
      getDaysAgoString(11),
      getDaysAgoString(9),
      getDaysAgoString(7),
      ...dummyHabits[1].recentCompletions,
    ],
  },
  {
    habitId: "3",
    completionDates: [
      getDaysAgoString(33),
      getDaysAgoString(32),
      getDaysAgoString(31),
      getDaysAgoString(30),
      getDaysAgoString(29),
      getDaysAgoString(26),
      getDaysAgoString(25),
      getDaysAgoString(24),
      getDaysAgoString(23),
      getDaysAgoString(22),
      getDaysAgoString(19),
      getDaysAgoString(18),
      getDaysAgoString(17),
      getDaysAgoString(16),
      getDaysAgoString(15),
      getDaysAgoString(12),
      getDaysAgoString(11),
      getDaysAgoString(10),
      getDaysAgoString(9),
      getDaysAgoString(8),
      ...dummyHabits[2].recentCompletions,
    ],
  },
  {
    habitId: "4",
    completionDates: [
      getDaysAgoString(19),
      getDaysAgoString(16),
      getDaysAgoString(14),
      getDaysAgoString(12),
      getDaysAgoString(9),
      getDaysAgoString(7),
      ...dummyHabits[3].recentCompletions,
    ],
  },
  {
    habitId: "5",
    completionDates: [getDaysAgoString(13), getDaysAgoString(10), getDaysAgoString(7), ...dummyHabits[4].recentCompletions],
  },
];
