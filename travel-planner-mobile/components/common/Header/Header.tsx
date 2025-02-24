import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { signOut } from "aws-amplify/auth";
import { styles } from "./Header.styles";

interface HeaderProps {
  hasSignOutButton?: boolean;
  customButton?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  hasSignOutButton = true,
  customButton,
}) => {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Travel Planner</Text>
        {hasSignOutButton && (
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
            <MaterialIcons name="exit-to-app" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        {customButton}
      </View>
    </SafeAreaView>
  );
};
