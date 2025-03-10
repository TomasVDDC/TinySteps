import { Controller, useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import DateTimePicker from "@react-native-community/datetimepicker";
import { View, Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ToggleGroup, ToggleGroupItem, ToggleGroupIcon } from "~/components/ui/toggle-group";
import React, { useState } from "react";
import { FormData } from "~/types";

type HabitFormProps = {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
};

export default function HabitForm({ onSubmit, onCancel }: HabitFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      habitName: "",
      notificationDate: new Date(),
      daysPerWeek: { label: "", value: "" },
      notificationDays: [],
    },
  });

  const [showTimePicker, setShowTimePicker] = useState(false);

  return (
    <>
      <Text className="text-sm font-bold -mb-2">Habit Name</Text>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => <Input placeholder="Habit Name" onBlur={onBlur} onChangeText={onChange} value={value} />}
        name="habitName"
      />
      {errors.habitName && <Text className="text-red-500">This is required.</Text>}

      <Text className="text-sm font-bold -mb-2">Days Per Week</Text>

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-[60px]">
              <SelectValue className="text-foreground text-sm native:text-lg" placeholder="1" />
            </SelectTrigger>
            <SelectContent className="w-[70px]">
              <ScrollView className="max-h-32">
                <SelectGroup>
                  <SelectItem label="1" value="1">
                    1
                  </SelectItem>
                  <SelectItem label="2" value="2">
                    2
                  </SelectItem>
                  <SelectItem label="3" value="3">
                    3
                  </SelectItem>
                  <SelectItem label="4" value="4">
                    4
                  </SelectItem>
                  <SelectItem label="5" value="5">
                    5
                  </SelectItem>
                  <SelectItem label="6" value="6">
                    6
                  </SelectItem>
                  <SelectItem label="7" value="7">
                    7
                  </SelectItem>
                </SelectGroup>
              </ScrollView>
            </SelectContent>
          </Select>
        )}
        name="daysPerWeek"
      />

      {errors.daysPerWeek && <Text className="text-red-500">This is required.</Text>}

      <Text className="text-sm font-bold -mb-2">Notification Time</Text>

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) =>
          Platform.OS === "ios" ? (
            <View className="-ml-2">
              <DateTimePicker
                testID="dateTimePicker"
                value={value}
                mode={"time"}
                is24Hour={true}
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || value;
                  onChange(currentDate);
                }}
              />
            </View>
          ) : (
            <View>
              <Button variant="outline" onPress={() => setShowTimePicker(true)}>
                <Text>{value.toLocaleTimeString()}</Text>
              </Button>
              {showTimePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={value}
                  mode={"time"}
                  is24Hour={true}
                  onChange={(event, selectedDate) => {
                    setShowTimePicker(false);
                    // Only update if not canceled (selectedDate is defined)
                    if (selectedDate) {
                      const currentDate = selectedDate;
                      onChange(currentDate);
                    }
                  }}
                />
              )}
            </View>
          )
        }
        name="notificationDate"
      />
      <Text className="text-sm font-bold -mb-3">Notification Days</Text>

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <ToggleGroup value={value} onValueChange={onChange} type="multiple">
            <ToggleGroupItem value="Monday" size="sm">
              <Text className="font-bold"> Mon</Text>
            </ToggleGroupItem>
            <ToggleGroupItem value="Tuesday" size="sm">
              <Text className="font-bold"> Tue</Text>
            </ToggleGroupItem>
            <ToggleGroupItem value="Wednesday" size="sm">
              <Text className="font-bold"> Wed</Text>
            </ToggleGroupItem>
            <ToggleGroupItem value="Thursday" size="sm">
              <Text className="font-bold"> Thu</Text>
            </ToggleGroupItem>
            <ToggleGroupItem value="Friday" size="sm">
              <Text className="font-bold"> Fri</Text>
            </ToggleGroupItem>
            <ToggleGroupItem value="Saturday" size="sm">
              <Text className="font-bold"> Sat</Text>
            </ToggleGroupItem>
            <ToggleGroupItem value="Sunday" size="sm">
              <Text className="font-bold"> Sun</Text>
            </ToggleGroupItem>
          </ToggleGroup>
        )}
        name="notificationDays"
      />

      <View className="flex flex-row justify-end gap-2">
        <Button variant="outline" onPress={onCancel} className="">
          <Text className="-mt-1">Cancel</Text>
        </Button>
        <Button onPress={handleSubmit(onSubmit)}>
          <Text className=" ">Save</Text>
        </Button>
      </View>
    </>
  );
}
