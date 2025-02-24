import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { TabNavigator } from "./TabNavigator";
import { RootStackParamList } from "./navigationTypes";
import TripDetailScreen from "../screens/TripDetail/TripDetailScreen";
import ActivityDetailScreen from "../screens/ActivityDetail/ActivityDetailScreen";
import DestinationDetailScreen from "../screens/DestinationDetail/DestinationDetailScreen";

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <Stack.Screen name="TripDetail" component={TripDetailScreen} />
        <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
        <Stack.Screen
          name="DestinationDetail"
          component={DestinationDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
