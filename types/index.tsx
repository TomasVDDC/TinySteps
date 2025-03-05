export interface Habit {
    id: string;
    name: string;
    daysPerWeek: number; // 1-7
    notificationSchedule: {
      monday?: string; // Time (HH:MM)     
      tuesday?: string;   
      wednesday?: string; 
      thursday?: string;  
      friday?: string;    
      saturday?: string;  
      sunday?: string;    
    };
    recentCompletions: string[]; // This weeks completions as ISO date strings (YYYY-MM-DD)
    createdAt: string; // ISO date string
  }

  export interface HabitHistory {
    habitId: string;
    completionDates: string[]; // All historical completion dates as ISO date strings (YYYY-MM-DD)
  }

  export interface FormData {
    habitName: string;
    notificationDate: Date; // 2025-03-05T15:46:38.634Z
    //We don't need the label but it was easier to process outside
    daysPerWeek: {label: string, value: string};
    notificationDays: string[];
  }

