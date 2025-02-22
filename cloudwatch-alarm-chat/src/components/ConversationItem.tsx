import React, { useContext } from 'react';
import { Box, Card, Text, Anchor, ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { Schema } from "@/../amplify/data/resource";
import { ConversationsContext } from '@/providers/ConversationProvider';
import DownloadButton from './DownloadButton';


export const ConversationItem = (conversation: Schema["chat"]["type"]) => {
    const { deleteConversation } = useContext(ConversationsContext);

    return (

        <Card key={conversation.id} shadow="sm" radius="md" p="md" withBorder>
            <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box style={{ flex: 1 }}>
                    <Anchor href={`/chat/${conversation.id}`} fw={500}>{conversation.name ?? conversation.id}</Anchor>
                    <Text size="sm" c="dimmed">
                        Created at: {new Date(conversation.createdAt).toLocaleString()}
                    </Text>
                    <Text size="sm" c="dimmed">
                        Last message: {new Date(conversation.updatedAt).toLocaleString()} 
                    </Text>
                </Box>
                <Box style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <DownloadButton id={conversation.id} />
                    <ActionIcon
                        variant="subtle"
                        color="grey"
                        onClick={() => deleteConversation({ id: conversation.id })}
                    >
                        <IconTrash size="1.125rem" />
                    </ActionIcon>
                </Box>
            </Box>
        </Card>
    );
};
