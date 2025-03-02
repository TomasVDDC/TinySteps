import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Plus } from "~/lib/icons/Plus";
import { Pressable } from "react-native";
import { Input } from "~/components/ui/input";
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function FloatingActionButton() {

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      habitName: '',
      date: new Date()
    }
  });

  const onSubmit = (data: any) => console.log(data);


  return (   
    <Dialog>
      <DialogTrigger asChild>
        <Pressable
          className="absolute bottom-32 right-0 rounded-full dark:bg-white bg-yellow-500 p-4 shadow-lg dark:shadow-white">
          <View className="flex items-center justify-center w-11 h-11">
            <Plus size={24} className="dark:text-gray-600 text-white" />
          </View>
        </Pressable>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Habit</DialogTitle>
          <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
        </DialogHeader>


        <Controller
        control={control}
        rules={{
         required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Habit Name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="habitName"
      />
      
              <Controller
        control={control}
        rules={{
         required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <DateTimePicker
          testID="dateTimePicker"
          value={value}
          mode={"time"}
          is24Hour={true}
          // DateTimePicker component's onChange provides both an event and the selectedDate, but React Hook Form expects just the value.
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || value;
            onChange(currentDate);
          }}
        />
        )}
        name="date"
      />


        <DialogFooter>
          <Button variant="outline"> <Text>Cancel</Text> </Button>
          <Button onPress={handleSubmit(onSubmit)}> <Text>Save</Text> </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  
  );
}       