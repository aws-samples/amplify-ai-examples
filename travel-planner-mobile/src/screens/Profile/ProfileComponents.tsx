import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { UserInformation } from "./types";
import { Schema } from "../../../amplify/data/resource";

type ProfileHeaderProps = {
  user: UserInformation | undefined;
  onImagePress: () => void;
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  onImagePress,
}) => (
  <View style={styles.profileHeader}>
    <TouchableOpacity onPress={onImagePress}>
      <Image
        source={{
          uri: user?.imageUrlOrKey ?? "https://via.placeholder.com/150",
        }}
        style={styles.profileImage}
      />
    </TouchableOpacity>
    <Text style={styles.username}>{user?.username}</Text>
  </View>
);

type PersonalInfoProps = {
  user: UserInformation | undefined;
};

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ user }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Personal Information</Text>
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>Email:</Text>
      <Text style={styles.infoValue}>{user?.email}</Text>
    </View>
  </View>
);

type LatestTripsProps = {
  trips: Schema["Trips"]["type"][];
};

export const LatestTrips: React.FC<LatestTripsProps> = ({ trips }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Latest Trips</Text>
    {trips.length > 0 ? (
      trips.map((trip) => (
        <View key={trip.id} style={styles.tripItem}>
          <Text style={styles.tripName}>
            {trip.start_location} to {trip.end_location}
          </Text>
          <Text style={styles.tripDate}>
            {trip.start_date} - {trip.end_date}
          </Text>
          <Text style={styles.tripCost}>Total Cost: ${trip.total_cost}</Text>
        </View>
      ))
    ) : (
      <Text style={styles.noDataText}>No recent trips</Text>
    )}
  </View>
);
