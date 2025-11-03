"use client";
import * as React from "react";
import { Flex, ScrollView, Button, Divider } from "@aws-amplify/ui-react";
import { ConversationsContext } from "@/providers/ConversationsProvider";
import { ConversationItem } from "./ConversationItem";
import { useRouter } from "next/navigation";
import { FiUpload } from "react-icons/fi";

export const Sidebar = ({ children }: React.PropsWithChildren) => {
  const { conversations } = React.useContext(ConversationsContext);
  const router = useRouter();

  return (
    <Flex direction="column" width="500px" height="100%">
      <Flex direction="column" padding="medium" gap="small">
        <Button
          variation="primary"
          size="small"
          onClick={() => router.push("/documents")}
        >
          <FiUpload /> Upload Documents
        </Button>
      </Flex>
      <Divider />
      <ScrollView flex="1">
        <Flex direction="column" padding="medium">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
            />
          ))}
        </Flex>
      </ScrollView>
      <Flex direction="row" padding="large">
        {children}
      </Flex>
    </Flex>
  );
};
