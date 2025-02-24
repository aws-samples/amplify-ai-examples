import React from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { styles } from "./styles";
import { ConversationMessage } from "@aws-amplify/ui-react-ai";

export const MessageList: React.FC<{ messages: ConversationMessage[] }> = ({
  messages,
}) => {
  if (messages.length === 0) {
    return (
      <Text style={styles.emptyMessageText}>
        Talk to the AI to learn about your destination. {"\n"}Start your
        sentence with{"\n"}"Create a trip" to create your next trip!
      </Text>
    );
  }

  return (
    <FlatList
      data={messages.toReversed()}
      inverted
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View
          style={[
            styles.messageContainer,
            item.role === "user"
              ? styles.userMessageContainer
              : styles.assistantMessageContainer,
          ]}
        >
          {item.content
            .map((content) => content.text)
            .join("")
            .trim().length === 0 ? (
            <ActivityIndicator size="small" color="#666" />
          ) : (
            <Text
              style={[
                styles.messageText,
                item.role === "user"
                  ? styles.userMessageText
                  : styles.assistantMessageText,
              ]}
            >
              {item.content
                .map((content) => content.text)
                .join("")
                .trim()}
            </Text>
          )}
        </View>
      )}
    />
  );
};
