import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { styles } from "./styles";
import { Schema } from "../../../amplify/data/resource";

type SectionProps<T> = {
  title: string;
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  emptyText: string;
};

const Section = <T,>({
  title,
  data,
  renderItem,
  emptyText,
}: SectionProps<T>) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {data.length > 0 ? (
      <FlatList
        data={data}
        keyExtractor={(item) => (item as any).id?.toString() ?? ""}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => renderItem(item)}
      />
    ) : (
      <Text style={styles.emptyText}>{emptyText}</Text>
    )}
  </View>
);

export const TripsSection: React.FC<{
  trips: Schema["Trips"]["type"][];
  onDelete: (item: Schema["Trips"]["type"]) => void;
  onPress: (id: string) => void;
}> = ({ trips, onDelete, onPress }) => (
  <Section
    title="Upcoming Trips"
    data={trips}
    emptyText="No upcoming trips available."
    renderItem={(item) => (
      <TouchableOpacity
        style={[styles.flightItem, { backgroundColor: "#fff" }]}
        onLongPress={() => onDelete(item)}
        onPress={() => onPress(item.id ?? "-1")}
      >
        <View style={styles.flightInfoContainer}>
          <Text style={styles.flightNumber}>
            {item?.start_location} - {item?.end_location}
          </Text>
          <Text style={styles.flightRoute}>
            {item.start_date} - {item.end_date}
          </Text>
          <Text style={styles.flightPrice}>Total: ${item.total_cost}</Text>
        </View>
      </TouchableOpacity>
    )}
  />
);

export const DestinationsSection: React.FC<{
  destinations: Schema["Destinations"]["type"][];
  onPress: (id: string) => void;
}> = ({ destinations, onPress }) => (
  <Section
    title="Popular Destinations"
    data={destinations}
    emptyText="No popular destinations available."
    renderItem={(item) => (
      <TouchableOpacity
        style={[styles.destinationItem, { backgroundColor: "#fff" }]}
        onPress={() => onPress(item.id ?? "-1")}
      >
        <View style={styles.destinationImageContainer}>
          <Text style={styles.destinationName}>{item.name}</Text>
        </View>
        <View style={styles.destinationInfoContainer}>
          <Text style={styles.destinationLocation}>{item.location}</Text>
          <Text style={styles.destinationClimate}>{item.climate}</Text>
        </View>
      </TouchableOpacity>
    )}
  />
);

export const ActivitiesSection: React.FC<{
  activities: Schema["Activities"]["type"][];
  onPress: (id: string) => void;
}> = ({ activities, onPress }) => (
  <Section
    title="Popular Activities"
    data={activities}
    emptyText="No popular activities available."
    renderItem={(item) => (
      <TouchableOpacity
        style={[styles.activityItem, { backgroundColor: "#fff" }]}
        onPress={() => onPress(item.id ?? "-1")}
      >
        <View style={styles.activityInfoContainer}>
          <Text style={styles.activityName}>{item.name}</Text>
          <Text style={styles.activityDescription}>{item.description}</Text>
          <Text style={styles.activityLocation}>Location: {item.location}</Text>
          <Text style={styles.activityDuration}>
            Duration: {item.duration} hours
          </Text>
          <Text style={styles.activityPrice}>Price: ${item.price}</Text>
        </View>
      </TouchableOpacity>
    )}
  />
);
