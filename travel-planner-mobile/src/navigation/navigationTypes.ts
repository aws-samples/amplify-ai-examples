import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  StackNavigationProp as RNStackNavigationProp,
  StackNavigationProp,
} from "@react-navigation/stack";

import { NavigatorScreenParams } from "@react-navigation/native";

export type TabNavigatorParamList = {
  Home: undefined;
  AIAssistant: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  TabNavigator: NavigatorScreenParams<TabNavigatorParamList>;
  TripDetail: { tripId: string };
  ActivityDetail: { activityId: string };
  DestinationDetail: { destinationId: string };
};

export type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabNavigatorParamList, "Home">,
  StackNavigationProp<RootStackParamList>
>;

export type TabNavigationProp<T extends keyof TabNavigatorParamList> =
  BottomTabNavigationProp<TabNavigatorParamList, T>;

export type TabRouteProp<T extends keyof TabNavigatorParamList> = RouteProp<
  TabNavigatorParamList,
  T
>;

export type RootStackNavigationProp<T extends keyof RootStackParamList> =
  RNStackNavigationProp<RootStackParamList, T>;

export type RootStackRouteProp<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;

// Utility type for screen props
export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: RootStackNavigationProp<T>;
  route: RootStackRouteProp<T>;
};

// Utility type for tab screen props
export type TabScreenProps<T extends keyof TabNavigatorParamList> = {
  navigation: TabNavigationProp<T>;
  route: TabRouteProp<T>;
};

export type ActivityDetailRouteProp = RouteProp<
  RootStackParamList,
  "ActivityDetail"
>;
export type ActivityDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ActivityDetail"
>;

export type TripDetailRouteProp = RouteProp<RootStackParamList, "TripDetail">;

export type DestinationDetailRouteProp = RouteProp<
  RootStackParamList,
  "DestinationDetail"
>;
