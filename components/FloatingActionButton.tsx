import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Plus } from "~/lib/icons/Plus";
import { Pressable } from "react-native";
export default function FloatingActionButton() {

  return (
       <Pressable
      className="absolute bottom-32 right-10 rounded-full dark:bg-white bg-yellow-500 p-4 shadow-lg dark:shadow-white">
    <View className="flex items-center justify-center w-11 h-11">
      
        <Plus size={24}  className="dark:text-black text-white" />
 
    </View>
    </Pressable>
  );
}       