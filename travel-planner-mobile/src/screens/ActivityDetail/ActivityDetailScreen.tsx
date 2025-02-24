import React from "react";
import { View, Text, SafeAreaView, StatusBar, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { styles } from "./styles";
import { useActivityDetail } from "./ActivityDetailHooks";
import { ActivityInfo, AdditionalInfo } from "./ActivityDetailComponents";
import { ActivityDetailRouteProp } from "../../navigation/navigationTypes";
import { Header } from "../../../components/common/Header";

const ActivityDetailScreen: React.FC = () => {
  const route = useRoute<ActivityDetailRouteProp>();
  const { activityId } = route.params;
  const { activity } = useActivityDetail(activityId);

  if (!activity) {
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <StatusBar barStyle="light-content" backgroundColor="#E94C3D" />
          <Header />
        </SafeAreaView>
        <View style={styles.content}>
          <Text style={styles.errorText}>Activity not found.</Text>
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
        <ActivityInfo activity={activity} />
        <AdditionalInfo activity={activity} />
      </ScrollView>
    </View>
  );
};

export default ActivityDetailScreen;
