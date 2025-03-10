import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { ScrollView } from "react-native-gesture-handler";
import { ThemeToggle } from "~/components/ThemeToggle";

import HabitList from "~/components/HabitList";
import FloatingActionButton from "~/components/FloatingActionButton";

export default function HomeScreen() {
  return (
    <View className="flex-1 px-8 pt-16 gap-4 ">
      <View className="flex-row mt-6">
        <Text className="text-3xl text-gray-600 dark:text-gray-200 font-extrabold mr-auto">Weekly Habits</Text>

        <ThemeToggle />
      </View>

      <ScrollView className="mt-4 ">
        <HabitList />
      </ScrollView>
      <FloatingActionButton />
    </View>
  );
}
