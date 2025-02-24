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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  activityName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E94C3D",
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  activityInfo: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  errorText: {
    fontSize: 18,
    color: "#E94C3D",
    textAlign: "center",
    marginTop: 20,
  },
});
