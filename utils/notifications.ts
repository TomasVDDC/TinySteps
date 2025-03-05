import * as Notifications from 'expo-notifications';
import { View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

// First, set the handler that will cause the notification
// to show the alert
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  })
});


const SendNotification = async () => {
    console.log('Sending notification...');

    const triggerDate = new Date(Date.now() + 60 * 1000);
    triggerDate.setSeconds(0);

    console.log('Trigger date:', triggerDate);

    Notifications.scheduleNotificationAsync({
  content: {
    title: 'Trigger date is ' + triggerDate,
  },
  trigger: {
    type: Notifications.SchedulableTriggerInputTypes.DATE,
    date: triggerDate,
  },
    });

}
const seeScheduledNotifications = async () => {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('==========================================');
    console.log('SCHEDULED NOTIFICATIONS:');
    console.log(JSON.stringify(scheduledNotifications, null, 2));
    console.log('==========================================');

}

const mapWeekDaysToNumbers: { [key: string]: number } = {
    "Sunday": 1,
    "Monday": 2,
    "Tuesday": 3,
    "Wednesday": 4,
    "Thursday": 5,
    "Friday": 6,
    "Saturday": 7,
}

export const setWeeklyNotifications = async (notificationTime: string, notificationDays: string[]) => {



    Notifications.scheduleNotificationAsync({
  content: {
    title: 'Trigger date is ' + notificationTime,
  },
  trigger: {
    type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
    weekday: mapWeekDaysToNumbers[notificationDays[0]],
    hour: parseInt(notificationTime.split(':')[0]),
    minute: parseInt(notificationTime.split(':')[1]),
  },

    });
    
    seeScheduledNotifications();
}






