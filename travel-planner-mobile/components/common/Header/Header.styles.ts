import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#E94C3D",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E94C3D",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  signOutText: {
    color: "#fff",
    marginRight: 8,
  },
});
