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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  activityItem: {
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
    backgroundColor: "#fff",
  },
  activityInfoContainer: {
    flex: 1,
  },
  activityName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  activityDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  activityLocation: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  activityDuration: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  activityPrice: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  activityAvailableSlots: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 18,
    color: "#E94C3D",
    textAlign: "center",
    marginTop: 20,
  },
});
