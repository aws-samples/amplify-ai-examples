"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@aws-amplify/ui-react";
import { ConversationsContext } from "@/providers/ConversationsProvider";

export const CreateChat = () => {
  const router = useRouter();
  const { createConversation } = React.useContext(ConversationsContext);

  const handleClick = async () => {
    const conversation = await createConversation();
    if (conversation) {
      router.push(`/chat/${conversation.id}`);
    }
  };
  return <Button onClick={handleClick}>Create chat</Button>;
};
