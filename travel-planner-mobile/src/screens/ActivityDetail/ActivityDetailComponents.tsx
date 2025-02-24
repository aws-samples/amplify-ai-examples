import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import { Schema } from "../../../amplify/data/resource";

type ActivityProps = {
  activity: Schema["Activities"]["type"];
};

export const ActivityInfo: React.FC<ActivityProps> = ({ activity }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{activity.name}</Text>
    <View style={styles.activityItem}>
      <View style={styles.activityInfoContainer}>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        <Text style={styles.activityLocation}>
          Location: {activity.location}
        </Text>
        <Text style={styles.activityDuration}>
          Duration: {activity.duration} hours
        </Text>
        <Text style={styles.activityPrice}>Price: ${activity.price}</Text>
        <Text style={styles.activityAvailableSlots}>
          Available Slots: {activity.available_slots}
        </Text>
      </View>
    </View>
  </View>
);

export const AdditionalInfo: React.FC<ActivityProps> = ({ activity }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Additional Information</Text>
    <View style={styles.infoContainer}>
      <Text style={styles.infoText}>
        This activity is located in {activity.location}. It lasts for{" "}
        {activity.duration} hours and costs ${activity.price}. There are
        currently {activity.available_slots} slots available for booking.
      </Text>
      <Text style={styles.infoText}>
        Remember to check the weather conditions and bring appropriate gear for
        this activity. It's always a good idea to arrive at least 15 minutes
        before the scheduled start time.
      </Text>
    </View>
  </View>
);
