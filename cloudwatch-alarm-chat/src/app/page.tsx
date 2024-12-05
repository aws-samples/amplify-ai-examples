"use client"
import * as React from "react";
import { useContext } from "react";
import { Container, Grid } from "@mantine/core";
import { ConversationsContext } from "@/providers/ConversationProvider";
import { ConversationList } from "@/components/ConversationsList";
import StartChat from "@/components/StartChat";


export default function Home() {
  const { conversations } = useContext(ConversationsContext);
  return (
    <Container w="100%">
      <Grid align="center">
        <Grid.Col span={5}>
          <ConversationList conversations={conversations} limit={5} />
        </Grid.Col>
        <Grid.Col span={conversations.length !== 0 ? 7 : 12}>
          <StartChat />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
