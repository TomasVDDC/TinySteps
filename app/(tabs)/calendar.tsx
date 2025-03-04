import { View, StyleSheet } from "react-native";
import { Text } from "~/components/ui/text";
import {Calendar, CalendarList, Agenda, CalendarProps } from 'react-native-calendars';
import { useRef, useState } from "react";
// import { dummyHabitHistory } from "~/dummy-data";
import { Habit, HabitHistory } from "~/types";
import React, { useEffect } from "react";
import useHabitStore  from "~/utils/store";
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from '~/components/ui/toggle-group';




export default function CalendarScreen() {

  const { habits, habitHistory, fetchHabitHistory } = useHabitStore();
  const [habitIdToggled, setHabitIdToggled] = useState<string | undefined>('');

  useEffect(() => {
    fetchHabitHistory();
    console.log(habitHistory);
  }, []);

  function handleHabitIdToggled(value: string | undefined) {
    console.log(value);
    setHabitIdToggled(value);
  }

  // Currently I am not using the tailwindcolors because the names are not supported by react-native-calendars
  const Colors = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
  ];

  // HAVING A CUSTOM WAS SLOWING DOWN THE CALENDAR, I modified directly the dot style in the node_modules folder
  // const calendarTheme = {
  
  //   dotStyle: {
  //     width: 10,
  //     height: 10,
  //     borderRadius: 5,
  //     marginTop: 1,
  //     marginLeft: 1,
  //     marginRight: 1
  //   }
  // };

  // Create a mapping of habit IDs to colors
  const habitColorMap: {[habitId: string]: string} = habits.reduce((map, habit, index) => {
    // Use modulo to cycle through colors if there are more habits than colors
    const colorIndex = index % Colors.length;
    return {
      ...map,
      [habit.id]: Colors[colorIndex]
    };
  }, {});


  function transformHabitHistory(habitHistoryArray: HabitHistory[]) {
    
    const dateToHabitsMap: { [date: string]:  { dots: { key: string, color: string}[] } } = {};

    if (habitIdToggled) {
      habitHistoryArray = habitHistoryArray.filter(habit => habit.habitId === habitIdToggled);
    }
    
    habitHistoryArray.forEach((habit) => {
      habit.completionDates.forEach(date => {
        // If the date doesn't exist in the map yet, initialize an empty array
        if (!dateToHabitsMap[date]) {
          dateToHabitsMap[date] = { dots: [] };
        }

        // Use the habitColorMap instead of Colors[index]
        dateToHabitsMap[date].dots.push({
          key: habit.habitId, 
          color: habitColorMap[habit.habitId] || 'gray' // Fallback to gray if no color is found
        });
      });
    });

    return dateToHabitsMap;
  }
  
  const markedDates = transformHabitHistory(habitHistory);



  return (

    <>
      <TrackedCalendarList
        pastScrollRange={20}
        futureScrollRange={20}
        scrollEnabled={true}
        showScrollIndicator={true}
        markingType={"multi-dot"}
        markedDates={markedDates}
      />

      <View className="absolute bottom-32 w-full flex-col gap-2 items-center justify-center">
        <ToggleGroup className="flex-col gap-0 items-start bg-white rounded-md p-3 border-2 border-gray-100" value={habitIdToggled} onValueChange={handleHabitIdToggled} type='single'>
          {habitHistory.map((History, index) => (
            <ToggleGroupItem size='none' key={index} value={History.habitId} aria-label={History.habitId}>
              <View className="flex-row items-center gap-2 px-2 py-[1px]">
                {/* Tailwind classnames need to be written in full, not be dinamically generated. Cant do this bg-${Colors[index]}-300 */}
                <View className="w-3 h-3 rounded-full mt-[1px] mx-[1px]" style={{backgroundColor: habitColorMap[History.habitId]}} />
                <Text className="">{habits.find(habit => habit.id === History.habitId)?.name}</Text>
              </View>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </View>
    </>
    
  );
}



// Custom wrapper for CalendarList to track renders and timing
const TrackedCalendarList = ({ markingType, markedDates, ...props }) => {


    
  const renderCount = useRef(0);
  const lastRenderTime = useRef(0);

  // Log render count and timing on each render
  useEffect(() => {
    const startTime = performance.now();
    renderCount.current += 1;

    // Use requestAnimationFrame to measure after render is committed
    requestAnimationFrame(() => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      lastRenderTime.current = duration;
      console.log(
        `CalendarList Render #${renderCount.current} took ${duration.toFixed(
          2
        )}ms`
      );
    });
  }); // No dependencies means it runs on every render

  return (

    <CalendarList
      markingType={markingType}
      markedDates={markedDates}

      {...props}
    />
    
  );
};

{/* <CalendarList
// Callback which gets executed when visible months change in scroll view. Default = undefined
onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
// Max amount of months allowed to scroll to the past. Default = 50
pastScrollRange={3}
// Max amount of months allowed to scroll to the future. Default = 50
futureScrollRange={3}
// Enable or disable scrolling of calendar list
scrollEnabled={true}
// Enable or disable vertical scroll indicator. Default = false
showScrollIndicator={true}
// Apply the custom theme with bigger dots
theme={calendarTheme}
markingType={'multi-dot'}
markedDates={markedDates}


/>  */}