import React from "react";
import { View, ScrollView, SafeAreaView } from "react-native";
import { ProfileHeader, PersonalInfo, LatestTrips } from "./ProfileComponents";
import { styles } from "./styles";
import { useProfile } from "./ProfileHooks";
import { Header } from "../../../components/common/Header";

const ProfileScreen: React.FC = () => {
  const { user, latestTrips, pickImage } = useProfile();

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: "#E94C3D" }}>
        <Header />
      </SafeAreaView>
      <ScrollView style={styles.content}>
        <ProfileHeader user={user} onImagePress={pickImage} />
        <PersonalInfo user={user} />
        <LatestTrips trips={latestTrips} />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
