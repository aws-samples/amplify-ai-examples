import React from "react";
import { View, Text, SafeAreaView, StatusBar, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { styles } from "./styles";
import { useDestinationDetail } from "./DestinationDetailHooks";
import { DestinationInfo, ActivityList } from "./DestinationDetailComponents";
import { DestinationDetailRouteProp } from "../../navigation/navigationTypes";
import { Header } from "../../../components/common/Header";

const DestinationDetailScreen: React.FC = () => {
  const route = useRoute<DestinationDetailRouteProp>();
  const { destinationId } = route.params;
  const { destination, destinationActivities } =
    useDestinationDetail(destinationId);

  if (!destination) {
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <StatusBar barStyle="light-content" backgroundColor="#E94C3D" />
          <Header />
        </SafeAreaView>
        <View style={styles.content}>
          <Text style={styles.errorText}>Destination not found.</Text>
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
        <DestinationInfo destination={destination} />
        {destinationActivities.length > 0 && (
          <ActivityList activities={destinationActivities} />
        )}
      </ScrollView>
    </View>
  );
};

export default DestinationDetailScreen;
