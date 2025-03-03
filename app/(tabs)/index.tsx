import { ScrollView, View, Text} from 'react-native';

import HabitList from '~/components/HabitList';
import FloatingActionButton from '~/components/FloatingActionButton';

export default function HomeScreen() {
  
  return (
    <View className="flex-1  px-8 gap-4 ">
      <ScrollView className='mt-4'>
        <HabitList />
      </ScrollView>
      <FloatingActionButton />
    
    </View>
  );
}





