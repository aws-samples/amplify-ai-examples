import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";

export const tabNavigationOptions: BottomTabNavigationOptions = {
  tabBarActiveTintColor: "#E94C3D",
  tabBarInactiveTintColor: "#666",
  headerShown: false,
};

type IconProps = {
  focused: boolean;
  color: string;
  size: number;
};

export const getTabBarIcon = (route: string) => {
  // eslint-disable-next-line react/display-name
  return ({ focused, color, size }: IconProps): React.ReactNode => {
    if (route === "Home") {
      const iconName = focused ? "home" : "home-outline";
      return <Ionicons name={iconName} size={size} color={color} />;
    } else if (route === "AIAssistant") {
      const iconName = focused ? "robot" : "robot-outline";
      return (
        <MaterialCommunityIcons name={iconName} size={size} color={color} />
      );
    } else if (route === "Profile") {
      const iconName = focused ? "person" : "person-outline";
      return <Ionicons name={iconName} size={size} color={color} />;
    }
    return <Ionicons name="home" size={size} color={color} />;
  };
};
