import { View } from "react-native";
import { Text } from "~/components/ui/text";
import {Calendar, CalendarList, Agenda, CalendarProps } from 'react-native-calendars';
import { useState } from "react";
import { dummyHabitHistory } from "~/dummy-data";
import { HabitHistory } from "~/types";


export default function ExploreScreen() {

  const Colors = [
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose'
  ];


  const [selected, setSelected] = useState('');

  function transformHabitHistory(habitHistoryArray: HabitHistory[]) {
    
    const dateToHabitsMap: { [date: string]:  { dots: { key: string, color: string }[] } } = {};
    
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
  
  const markedDates = transformHabitHistory(dummyHabitHistory);


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

  markingType={'multi-dot'}

  markedDates={markedDates}

/>

</>
    
  );
}


