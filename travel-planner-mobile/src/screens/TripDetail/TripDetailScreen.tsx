import React from "react";
import { View, Text, SafeAreaView, StatusBar, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTripDetail } from "./TripDetailHooks";
import {
  TripOverview,
  FlightDetails,
  AccommodationDetails,
  ActivityList,
} from "./TripDetailComponents";
import { TripDetailRouteProp } from "../../navigation/navigationTypes";
import { styles } from "./styles";
import { Header } from "../../../components/common/Header";

const TripDetailScreen: React.FC = () => {
  const route = useRoute<TripDetailRouteProp>();
  const { tripId } = route.params;
  const { trip, tripDetails, flight, accommodation, tripActivities } =
    useTripDetail(tripId);

  if (!trip || !tripDetails) {
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <StatusBar barStyle="light-content" backgroundColor="#E94C3D" />
          <Header />
        </SafeAreaView>
        <View style={styles.content}>
          <Text style={styles.errorText}>Trip details are not found.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <StatusBar barStyle="light-content" backgroundColor="#E94C3D" />
        <Header />
      </SafeAreaView>
      <ScrollView style={styles.content}>
        <TripOverview trip={trip} />
        {flight && <FlightDetails flight={flight} />}
        {accommodation && (
          <AccommodationDetails accommodation={accommodation} />
        )}
        {tripActivities.length > 0 && (
          <ActivityList activities={tripActivities} />
        )}
      </ScrollView>
    </View>
  );
};

export default TripDetailScreen;
