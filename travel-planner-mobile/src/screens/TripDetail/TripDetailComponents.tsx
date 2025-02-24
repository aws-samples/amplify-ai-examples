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

export const TripOverview: React.FC<{ trip: Schema["Trips"]["type"] }> = ({
  trip,
}) => (
  <Section title="Trip Overview">
    <View style={styles.card}>
      <Text style={styles.infoText}>
        {trip.start_location} to {trip.end_location}
      </Text>
      <Text style={styles.infoText}>From: {trip.start_date}</Text>
      <Text style={styles.infoText}>To: {trip.end_date}</Text>
      <Text style={styles.infoText}>Total Cost: ${trip.total_cost}</Text>
    </View>
  </Section>
);

export const FlightDetails: React.FC<{ flight: Schema["Flights"]["type"] }> = ({
  flight,
}) => (
  <Section title="Flight Details">
    <View style={styles.card}>
      <Text style={styles.infoText}>Flight Number: {flight.flight_number}</Text>
      <Text style={styles.infoText}>
        From: {flight.departure_airport} at{" "}
        {new Date(flight.departure_time).toLocaleString()}
      </Text>
      <Text style={styles.infoText}>
        To: {flight.arrival_airport} at{" "}
        {new Date(flight.arrival_time).toLocaleString()}
      </Text>
      <Text style={styles.infoText}>Price: ${flight.price}</Text>
    </View>
  </Section>
);

export const AccommodationDetails: React.FC<{
  accommodation: Schema["Accommodations"]["type"];
}> = ({ accommodation }) => (
  <Section title="Accommodation">
    <View style={styles.card}>
      <Text style={styles.infoText}>{accommodation.name}</Text>
      <Text style={styles.infoText}>Type: {accommodation.type}</Text>
      <Text style={styles.infoText}>Address: {accommodation.address}</Text>
      <Text style={styles.infoText}>Ratiating: {accommodation.rating}</Text>
      <Text style={styles.infoText}>
        Price per night: ${accommodation.price_per_night}
      </Text>
    </View>
  </Section>
);

export const ActivityList: React.FC<{
  activities: Schema["Activities"]["type"][];
}> = ({ activities }) => (
  <Section title="Activities">
    {activities.map((activity) => (
      <View key={activity.id} style={styles.card}>
        <Text style={styles.infoText}>{activity.name}</Text>
        <Text style={styles.infoText}>{activity.description}</Text>
        <Text style={styles.infoText}>Location: {activity.location}</Text>
        <Text style={styles.infoText}>Duration: {activity.duration} hours</Text>
        <Text style={styles.infoText}>Price: ${activity.price}</Text>
      </View>
    ))}
  </Section>
);
