import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Plus } from "~/lib/icons/Plus";
import { Pressable } from "react-native";
import HabitForm from "~/components/HabitForm";
import { useState } from "react";
import { Habit } from "~/types";

export default function FloatingActionButton() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: any) => {
    const transformedData = {
      ...data,
      daysPerWeek: data.daysPerWeek.value 
    };
    console.log(transformedData);

    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (   
    <Dialog open={open} onOpenChange={setOpen}>
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
            Add your habit and click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <HabitForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  );
}       