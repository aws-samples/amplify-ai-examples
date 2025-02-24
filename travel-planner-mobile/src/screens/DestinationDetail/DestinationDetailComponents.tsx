import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import { Schema } from "../../../amplify/data/resource";

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

export const DestinationInfo: React.FC<{
  destination: Schema["Destinations"]["type"];
}> = ({ destination }) => (
  <Section title={destination.name}>
    <View style={styles.card}>
      <Text style={styles.infoText}>Location: {destination.location}</Text>
      <Text style={styles.infoText}>Climate: {destination.climate}</Text>
    </View>
  </Section>
);

export const ActivityList: React.FC<{
  activities: Schema["Activities"]["type"][];
}> = ({ activities }) => (
  <Section title="Available Activities">
    {activities.map((activity) => (
      <View key={activity.id} style={styles.card}>
        <Text style={styles.activityName}>{activity.name}</Text>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        <Text style={styles.activityInfo}>
          Duration: {activity.duration} hours
        </Text>
        <Text style={styles.activityInfo}>Price: ${activity.price}</Text>
      </View>
    ))}
  </Section>
);
