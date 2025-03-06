// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
// import { Text } from "~/components/ui/text";

// export default function Example() {
//   return (
//     <Accordion type="single" collapsible defaultValue={["item-1"]} className="w-full max-w-sm native:max-w-md">
//       <AccordionItem>
//         <AccordionTrigger>
//           <Text>Is it accessible?</Text>
//         </AccordionTrigger>
//         <AccordionContent>
//           <Text>Yes. It adheres to the WAI-ARIA design pattern.</Text>
//         </AccordionContent>
//       </AccordionItem>
//     </Accordion>
//   );
// }

// import React from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

// const HorizontalCollapsibleItem = () => {
//   const isOpen = useSharedValue(false); // Shared value for open/closed state
//   const contentWidth = useSharedValue(0); // Animated width for content
//   const togglePosition = useSharedValue(0); // Animated position for toggle

//   const toggleCollapse = () => {
//     isOpen.value = !isOpen.value;
//     contentWidth.value = withTiming(isOpen.value ? 200 : 0, { duration: 300 });
//     togglePosition.value = withTiming(isOpen.value ? -100 : 0, { duration: 300 });
//   };

//   // Animated style for the toggle
//   const toggleStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: togglePosition.value }],
//   }));

//   // Animated style for the content
//   const contentStyle = useAnimatedStyle(() => ({
//     width: contentWidth.value,
//     height: "100%",
//     backgroundColor: "#f0f0f0",
//     justifyContent: "center",
//     overflow: "hidden",
//   }));

//   return (
//     <View
//       style={{
//         flexDirection: "row",
//         justifyContent: "center", // Center the row initially
//         alignItems: "center",
//         height: 50,
//         overflow: "hidden",
//       }}
//     >
//       <Animated.View style={toggleStyle}>
//         <TouchableOpacity onPress={toggleCollapse}>
//           <Text style={{ padding: 10, backgroundColor: "#ddd" }}>Toggle</Text>
//         </TouchableOpacity>
//       </Animated.View>
//       <Animated.View style={contentStyle}>
//         <Text style={{ paddingLeft: 10 }}>{isOpen.value ? "Expanded Content!" : ""}</Text>
//       </Animated.View>
//     </View>
//   );
// };

// export default HorizontalCollapsibleItem;

import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from "react-native-reanimated";

export default function HorizontalCollapsibleItem() {
  const [isOpen, setIsOpen] = useState(false);
  const contentWidth = useSharedValue(0);
  const togglePosition = useSharedValue(0);

  const toggleCollapse = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    contentWidth.value = withTiming(newState ? 200 : 0, { duration: 300 });
    togglePosition.value = withTiming(newState ? -40 : 0, { duration: 300 });
  };

  const toggleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: togglePosition.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    width: contentWidth.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(contentWidth.value, [150, 200], [0, 1]),
  }));

  return (
    <View className="flex-row justify-center items-center h-[50px] overflow-hidden">
      <Animated.View style={toggleStyle}>
        <TouchableOpacity onPress={toggleCollapse}>
          <Text className="p-2.5 bg-gray-200">Toggle</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={contentStyle} className="h-full bg-gray-100 justify-center overflow-hidden">
        <Animated.Text style={textStyle} className="pl-2.5">
          {isOpen ? "Expanded Content!" : ""}
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

// import React from "react";
// import { View, Button, SafeAreaView } from "react-native";
// import Animated, { SharedValue, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";

// interface AccordionItemProps {
//   isExpanded: SharedValue<boolean>;
//   children: React.ReactNode;
//   viewKey: string;
//   className?: string;
//   duration?: number;
// }

// function AccordionItem({ isExpanded, children, viewKey, className, duration = 500 }: AccordionItemProps) {
//   const height = useSharedValue(0);

//   const derivedHeight = useDerivedValue(() =>
//     withTiming(isExpanded.value ? height.value : 0, {
//       duration,
//     })
//   );

//   const bodyStyle = useAnimatedStyle(() => ({
//     height: derivedHeight.value,
//   }));

//   return (
//     <Animated.View key={`accordionItem_${viewKey}`} className={`w-full overflow-hidden ${className || ""}`} style={bodyStyle}>
//       <View
//         onLayout={(e) => {
//           height.value = e.nativeEvent.layout.height;
//         }}
//         className="w-full absolute items-center"
//       >
//         {children}
//       </View>
//     </Animated.View>
//   );
// }

// function Item() {
//   return <View className="h-[120px] w-[120px] bg-[#b58df1] rounded-[20px] items-center justify-center" />;
// }

// interface ParentProps {
//   open: SharedValue<boolean>;
// }

// function Parent({ open }: ParentProps) {
//   return (
//     <View className="w-[200px]">
//       <AccordionItem isExpanded={open} viewKey="Accordion">
//         <Item />
//       </AccordionItem>
//     </View>
//   );
// }

// export default function App() {
//   const open = useSharedValue(false);
//   const onPress = () => {
//     open.value = !open.value;
//   };

//   return (
//     <SafeAreaView className="flex-1 justify-center pt-6">
//       <View className="flex-1 pb-4 flex-row justify-center items-center">
//         <Button onPress={onPress} title="Click me" />
//       </View>

//       <View className="flex-1 justify-center items-center">
//         <Parent open={open} />
//       </View>
//     </SafeAreaView>
//   );
// }
