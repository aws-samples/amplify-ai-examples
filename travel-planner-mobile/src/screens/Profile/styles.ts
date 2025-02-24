import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E94C3D",
  },
  content: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    flexShrink: 1,
  },
  tripItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  tripName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  tripDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  tripCost: {
    fontSize: 14,
    color: "#E94C3D",
    fontWeight: "bold",
  },
  noDataText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
});
