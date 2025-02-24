import React from "react";
import {
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/navigationTypes";
import { styles } from "./styles";
import { useHomeScreenData } from "./HomeScreenHooks";
import {
  TripsSection,
  DestinationsSection,
  ActivitiesSection,
} from "./HomeScreenComponents";
import { Header } from "../../../components/common/Header";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TabNavigator"
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { isLoading, trips, destinations, activities, deleteTrip } =
    useHomeScreenData();

  const navigateToTravelPlanning = () => {
    navigation.navigate("TabNavigator", { screen: "AIAssistant" });
  };

  const goToTripDetails = (id: string) => {
    navigation.navigate("TripDetail", { tripId: id });
  };

  const goToActivityDetails = (id: string) => {
    navigation.navigate("ActivityDetail", { activityId: id });
  };

  const goToDestinationDetails = (id: string) => {
    navigation.navigate("DestinationDetail", { destinationId: id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E94C3D" />
      <Header />
      <ScrollView style={styles.content}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#E94C3D"
            style={styles.loader}
          />
        ) : (
          <>
            <TripsSection
              trips={trips}
              onDelete={deleteTrip}
              onPress={goToTripDetails}
            />
            <DestinationsSection
              destinations={destinations}
              onPress={goToDestinationDetails}
            />
            <ActivitiesSection
              activities={activities}
              onPress={goToActivityDetails}
            />
          </>
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={navigateToTravelPlanning}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;
