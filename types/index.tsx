export interface Habit {
    id: string;
    name: string;
    frequencyPerWeek: number;
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

