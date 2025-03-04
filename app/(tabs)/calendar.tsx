import { View } from "react-native";
import { Text } from "~/components/ui/text";
import {Calendar, CalendarList, Agenda, CalendarProps } from 'react-native-calendars';
import { useState } from "react";
// import { dummyHabitHistory } from "~/dummy-data";
import { HabitHistory } from "~/types";
import React, { useEffect } from "react";
import useHabitStore  from "~/utils/store";


export default function CalendarScreen() {

  const { habits, habitHistory, fetchHabitHistory } = useHabitStore();

  useEffect(() => {
    fetchHabitHistory();
    console.log(habitHistory);
  }, []);

  // Currently I am not using the tailwindcolors because the names are not supported by react-native-calendars
  const Colors = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
  ];

  const [selected, setSelected] = useState('');

  function transformHabitHistory(habitHistoryArray: HabitHistory[]) {
    
    const dateToHabitsMap: { [date: string]:  { dots: { key: string, color: string}[] } } = {};
    
    habitHistoryArray.forEach((habit, index) => {
      habit.completionDates.forEach(date => {
        // If the date doesn't exist in the map yet, initialize an empty array
        if (!dateToHabitsMap[date]) {
          dateToHabitsMap[date] = { dots: [] };
        }

        dateToHabitsMap[date].dots.push({key: habit.habitId, color: Colors[index]});
      });
    });

    return dateToHabitsMap;
  }
  
  const markedDates = transformHabitHistory(habitHistory);

  // Custom theme to make dots bigger
  const calendarTheme = {
    // Increase the size of dots
    dotStyle: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginTop: 1,
      marginLeft: 1,
      marginRight: 1
    }
  };

  return (

    <>
    <CalendarList
      // Callback which gets executed when visible months change in scroll view. Default = undefined
      onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
      // Max amount of months allowed to scroll to the past. Default = 50
      pastScrollRange={50}
      // Max amount of months allowed to scroll to the future. Default = 50
      futureScrollRange={50}
      // Enable or disable scrolling of calendar list
      scrollEnabled={true}
      // Enable or disable vertical scroll indicator. Default = false
      showScrollIndicator={true}
      // Apply the custom theme with bigger dots
      theme={calendarTheme}
      markingType={'multi-dot'}
      markedDates={markedDates}

 
    />




    <View className="absolute bottom-32 w-full flex-col gap-2 items-center justify-center bg-white">
    {habitHistory.map((History, index)   => (

<View key={index} className="flex-row items-center  gap-2">
  {/* Tailwind classnames need to be written in full, not be dinamically generated. Cant do this bg-${Colors[index]}-300 */}
  <View className="w-3 h-3 rounded-full mt-[1px] mx-[1px]" style={{backgroundColor: Colors[index]}} />
  <Text>{habits.find(habit => habit.id === History.habitId)?.name}</Text>
</View>
))}


    </View>
    </>
    
  );
}


// {dummyHabitHistory.map((habitHistory, index)   => (

//   <View key={index} className="flex-row items-center  gap-2">
//     {/* Tailwind classnames need to be written in full, not be dinamically generated. Cant do this bg-${Colors[index]}-300 */}
//     <View className="w-3 h-3 rounded-full mt-[1px] mx-[1px]" style={{backgroundColor: Colors[index]}} />
//     <Text>{habits.find(habit => habit.id === habitHistory.habitId)?.name}</Text>
//   </View>
// ))}