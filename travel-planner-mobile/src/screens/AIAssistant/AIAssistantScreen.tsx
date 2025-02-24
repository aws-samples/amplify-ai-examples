import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { styles } from "./styles";
import { useAIAssistant } from "./AIAssistantHooks";
import { MessageList } from "./AIAssistantComponents";
import { Header } from "../../../components/common/Header";

const AIAssistantScreen: React.FC = () => {
  const { inputText, setInputText, handleSend, messages } = useAIAssistant();

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.chatContainer}>
        <MessageList messages={messages} />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask your question"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AIAssistantScreen;
