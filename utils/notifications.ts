import * as Notifications from "expo-notifications";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

// First, set the handler that will cause the notification
// to show the alert
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const seeScheduledNotifications = async () => {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  console.log("==========================================");
  console.log("SCHEDULED NOTIFICATIONS:");
  console.log(JSON.stringify(scheduledNotifications, null, 2));
  console.log("==========================================");
};

export const clearScheduledNotifications = async () => {
  console.log("Clearing scheduled notifications...");
  await Notifications.cancelAllScheduledNotificationsAsync();
};

const mapWeekDaysToNumbers: { [key: string]: number } = {
  Sunday: 1,
  Monday: 2,
  Tuesday: 3,
  Wednesday: 4,
  Thursday: 5,
  Friday: 6,
  Saturday: 7,
};

export const setWeeklyNotifications = async (notificationTime: string, notificationDays: string[], habitName: string) => {
  notificationDays.forEach(async (day) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: `Time for your habit: ${habitName}!`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: mapWeekDaysToNumbers[day],
        hour: parseInt(notificationTime.split(":")[0]),
        minute: parseInt(notificationTime.split(":")[1]),
      },
    });
  });

  seeScheduledNotifications();
};
