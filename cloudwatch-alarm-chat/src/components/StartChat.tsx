import React, { useContext, useState } from 'react';
import { useForm } from "@mantine/form";
import { Textarea, ActionIcon, Title, Text, Grid, Stack, Paper } from '@mantine/core';
import { IconSend2 } from '@tabler/icons-react';
import { ConversationsContext } from '@/providers/ConversationProvider';
import { useRouter } from 'next/navigation';

interface NewChat {
    message: string;
}

const StartChat: React.FC = () => {
    const router = useRouter();
    const form = useForm({
        mode: "uncontrolled", 
        initialValues: {
            message: '',
        },
    });
    const { createConversation } = useContext(ConversationsContext)

    const handleStartChat = (value: NewChat) => {
        createConversation().then((conversation) => {
            if (!conversation) return;
            conversation.sendMessage({ content: [{ text: value.message }] })
            router.push(`/chat/${conversation.id}`);
        })
    };

    return (
        <form onSubmit={form.onSubmit((values) => handleStartChat(values))} style={{ height: '100%' }}>
            <Paper p="md" shadow="sm" radius="md" withBorder>
                <Stack align="stretch" gap="md" style={{ height: '100%' }}>
                    <Title order={1}>Hi 👋</Title>
                    <Text size='xl'>Start chatting with your Amazon CloudWatch Alarms</Text>
                    <Grid align="center" gutter="sm">
                        <Grid.Col span={10}>
                            <Textarea 
                                key={form.key('message')} 
                                {...form.getInputProps('message')}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        form.onSubmit(
                                            (values) => handleStartChat(values)
                                        )();
                                    }
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span={2}>
                            <ActionIcon size="xl" type="submit" variant="filled" color="blue">
                                <IconSend2 size={20} />
                            </ActionIcon>
                        </Grid.Col>
                    </Grid>
                </Stack>
            </Paper>
        </form>
    );
};

export default StartChat;
