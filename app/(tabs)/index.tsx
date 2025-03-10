import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { ScrollView } from "react-native-gesture-handler";

import HabitList from "~/components/HabitList";
import FloatingActionButton from "~/components/FloatingActionButton";

export default function HomeScreen() {
  return (
    <View className="flex-1 px-8 pt-16 gap-4 ">
      <Text className="text-2xl font-bold mt-4">Weekly Habits</Text>
      <ScrollView className="mt-4 ">
        <HabitList />
      </ScrollView>
      <FloatingActionButton />
    </View>
  );
}
