"use client";

import * as React from "react";
import { ConversationsContext } from "@/providers/ConversationsProvider";
import { View } from "@aws-amplify/ui-react";
import { AIConversation } from "@aws-amplify/ui-react-ai";
import { useRouter } from "next/navigation";

export default function Home() {
  const { createConversation } = React.useContext(ConversationsContext);
  const router = useRouter();
  const [isNavigating, setIsNavigating] = React.useState(false);

  const handleSendMessage = async (message: { content: { text?: string }[] }) => {
    if (isNavigating) return;
    setIsNavigating(true);
    
    try {
      const conversation = await createConversation();
      if (!conversation) {
        setIsNavigating(false);
        return;
      }
      
      // Store initial message in sessionStorage for the chat page
      sessionStorage.setItem(`initial_message_${conversation.id}`, JSON.stringify(message));
      
      // Navigate to chat page
      await router.push(`/chat/${conversation.id}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
      setIsNavigating(false);
    }
  };

  return (
    <View padding="large" flex="1">
      <AIConversation
        messages={[]}
        handleSendMessage={handleSendMessage}
        isLoading={isNavigating}
      />
    </View>
  );
}
