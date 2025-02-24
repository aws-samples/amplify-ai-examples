import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabNavigatorParamList } from "./navigationTypes";
import { tabNavigationOptions, getTabBarIcon } from "./navigationOptions";
import HomeScreen from "../screens/Home/HomeScreen";
import AIAssistantScreen from "../screens/AIAssistant/AIAssistantScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";

const Tab = createBottomTabNavigator<TabNavigatorParamList>();

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...tabNavigationOptions,
        tabBarIcon: getTabBarIcon(route.name),
        tabBarLabel: route.name === "AIAssistant" ? "AI Assistant" : route.name,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AIAssistant" component={AIAssistantScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
