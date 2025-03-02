import React, { useEffect } from 'react';
import { View, Pressable} from 'react-native';
import { Text } from '~/components/ui/text';
import { Progress } from '~/components/ui/progress';
import { Badge } from '~/components/ui/badge';
import { Habit } from '~/types';
import { CircleCheckBig } from '~/lib/icons/CircleCheckBig';
import { Trash } from '~/lib/icons/Trash';
import { dummyHabits } from '~/dummy-data';

// HabitItem component to display individual habits
const HabitItem = ({ habit }: { habit: Habit }) => {
  // Calculate completion ratio for the current week
  const completedThisWeek = habit.recentCompletions.length;
  const completionRatio = completedThisWeek / habit.frequencyPerWeek;

  const isCompletedToday = () => {
    const lastCompletionDate = habit.recentCompletions[0];
    const today = new Date().toISOString().split('T')[0];
    return lastCompletionDate === today;
  };
  
  const handleCompleteHabit = () => {
    console.log(`Habit "${habit.name}" has been completed`);
  };

  const handleLongPress = () => {
    console.log(habit);
  };

  // Determine progress color based on completion ratio
  const getProgressColor = () => {
    if (completionRatio === 1) return 'bg-green-500';
    if (isCompletedToday()) return 'bg-green-500';
    return 'bg-yellow-500 dark:bg-gray-400';
  };

  const items = [
    {
      text: 'Delete',
      icon: () =>  <Trash size={18} color="red"  />,
      isDestructive: true,
      onPress: () => console.log('Delete'),
    },
  ];

  return (
        
            <View className={`p-4 rounded-lg mb-3 border ${isCompletedToday() ? 'border-green-500' : 'border-gray-200 dark:border-gray-700'}`}>
                <View className="flex-row justify-between items-center mb-2">
                    <View className="flex-row items-center flex-1">
                        <Pressable 
                            onPress={handleCompleteHabit}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <CircleCheckBig 
                                size={24} 
                                
                                style={{ marginRight: 8 }}
                                className={isCompletedToday() ? 'text-green-500 ': 'text-gray-400 '} 
                            />
                        </Pressable>
                        <Text className="flex-1">{habit.name}</Text>
                    </View>
                    <Badge variant="outline" className="ml-2">
                        <Text>{completedThisWeek}/{habit.frequencyPerWeek}</Text>
                    </Badge>
                </View>
            
                <Progress 
                    value={completionRatio * 100} 
                    className="h-2 w-full"
                    indicatorClassName={getProgressColor()}
                />
            </View>

  );
};

export default function HabitList() {
    
  return (
    <>
      {dummyHabits.map((habit: Habit) => (
        <HabitItem key={habit.id} habit={habit} />
      ))}
    </>
  );
}




