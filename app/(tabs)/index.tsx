import { ScrollView, View, Text} from 'react-native';

import HabitList from '~/components/HabitList';
import FloatingActionButton from '~/components/FloatingActionButton';
import StarterIndex from '~/components/StarterIndex';

export default function HomeScreen() {
  
  const handleAddHabit = () => {
    // Navigate to add habit screen or open a modal
    console.log('Add new habit');
    // Uncomment when you have the route set up
    // router.push('/add-habit');
  };

  return (
    <View className="flex-1  px-8 gap-4 ">
      <ScrollView>
        {/* <StarterIndex /> */}
        <HabitList />
      </ScrollView>
      <FloatingActionButton />
    
    </View>
  );
}





