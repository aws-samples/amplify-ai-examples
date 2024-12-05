import { Paper, Group, Stack, Text } from '@mantine/core';
import DownloadButton from './DownloadButton';

export interface ChatHeader {
    id: string;
    title: string;
    lastUpdated: string;
    metadata?: string[]
}

const ChatHeader = ({ id, title, lastUpdated, metadata = [] }: ChatHeader) => {
    return (
        <Paper p="md" radius="md" mb="lg" bg="blue.0">
            <Group justify="space-between" align="flex-start">
                <Stack gap={5}>
                    <Text size="xl" fw={600} c="blue.9">
                        {title}
                    </Text>
                    <Text size="sm" c="gray.6">
                        Last update: {new Date(lastUpdated).toLocaleString()}
                    </Text>
                    <Group gap={5} mt={5}>
                        <Text key={id} size="xs" c="blue.7" bg="white" px={5} py={2} style={{ borderRadius: 4 }}>
                            {id}
                        </Text>
                        {metadata.map((item, index) => (
                            <Text key={index} size="xs" c="blue.7" bg="white" px={5} py={2} style={{ borderRadius: 4 }}>
                                {item}
                            </Text>
                        ))}
                    </Group>
                </Stack>

                <Group>
                    <DownloadButton id={id} />
                </Group>
            </Group>
        </Paper>
    );
};

export default ChatHeader
