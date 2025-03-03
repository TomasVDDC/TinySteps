import React, { useEffect } from 'react';
import { View, Pressable, Platform} from 'react-native';
import { Text } from '~/components/ui/text';
import { Progress } from '~/components/ui/progress';
import { Badge } from '~/components/ui/badge';
import { Habit } from '~/types';
import { CircleCheckBig } from '~/lib/icons/CircleCheckBig';
import { Trash } from '~/lib/icons/Trash';
import useHabitStore from "~/utils/store";
import { keepOnlyDate } from '~/utils/date-splitter';
import {   ContextMenu,
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
  ContextMenuTrigger, } from '~/components/ui/context-menu'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// HabitItem component to display individual habits
const HabitItem = ({ habit, completeHabit }: { habit: Habit, completeHabit: (habit: Habit) => void }) => {

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
  };

  const handleLongPress = () => {
    console.log(habit);
  };

  const logHabit = () => {
    console.log(`🔍 Habit Details for "${habit.name}":`);
    console.log(JSON.stringify(habit, null, 2));
  };

  // Determine progress color based on completion ratio
  const getProgressColor = () => {
    if (completionRatio === 1) return 'bg-green-500';
    if (isCompletedToday()) return 'bg-green-500';
    return 'bg-yellow-500 dark:bg-gray-400';
  };



  return (
    <ContextMenu>
        <ContextMenuTrigger >
            <View className={`p-4  rounded-lg mb-3 border ${isCompletedToday() ? 'border-green-500' : 'border-gray-200 dark:border-gray-700'}`}>
                <Pressable onPress={logHabit}>

                <View className="flex-row justify-between items-center mb-2">
                    <View className="flex-row items-center flex-1">
                        <Pressable 
                            onPress={isCompletedToday() ? null : handleCompleteHabit}
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
                        <Text>{completedThisWeek}/{habit.daysPerWeek}</Text>
                    </Badge>
                </View>
            
                <Progress 
                    value={completionRatio * 100} 
                    className="h-2 w-full"
                    indicatorClassName={getProgressColor()}
                />
             </Pressable>
            </View>
            </ContextMenuTrigger>
                <ContextMenuContent align='start' insets={contentInsets} className='w-64 native:w-72'>
            <ContextMenuItem inset>
              <Text>Back</Text>
              <ContextMenuShortcut>⌘[</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem inset disabled>
              <Text>Forward</Text>
              <ContextMenuShortcut>⌘]</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
                </ContextMenu>
               

  );
};

export default function HabitList() {
  const { habits, fetchHabits, completeHabit } = useHabitStore();

  useEffect(() => {
    fetchHabits();
    console.log(habits);
  }, []);

  return (
    <>
      {habits.map((habit: Habit) => (
        <HabitItem key={habit.id} habit={habit} completeHabit={completeHabit} />
      ))}
          
    </>
  );
}




