import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  emptyMessageText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 24,
  },
  messageContainer: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#E94C3D",
  },
  assistantMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  userMessageText: {
    color: "#fff",
  },
  assistantMessageText: {
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#E94C3D",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  sendButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});
