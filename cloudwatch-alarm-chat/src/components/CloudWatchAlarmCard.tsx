import React from 'react';
import { Card, Text, Group, Stack, Badge, Anchor } from '@mantine/core';
import { IconBell, IconCalendar, IconChartBar, IconCode, IconStack, IconAlertTriangle, IconExternalLink } from '@tabler/icons-react';

interface CloudWatchAlarmProps {
    name: string,
    description: string,
    state: string,
    threshold: number,
    lastUpdated: string,
    actions: string,
    namespace: string,
    dimensions: object[],
    deepLink: string,
}

export const CloudWatchAlarmCard: React.FC<CloudWatchAlarmProps> = ({
    name,
    description,
    state,
    threshold,
    lastUpdated,
    actions,
    namespace,
    dimensions,
    deepLink,
}: CloudWatchAlarmProps) => {
    const getStateColor = (state: string) => {
        switch (state) {
            case 'OK':
                return 'green';
            case 'ALARM':
                return 'red';
            default:
                return 'yellow';
        }
    };

    console.log("PROPS", { name, description, state, threshold, lastUpdated, actions, namespace, dimensions })

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
                <Group justify="space-between" align="center">
                    <Group gap="xs">
                        <IconBell size={20} />
                        <Anchor href={deepLink} target="_blank" style={{ textDecoration: 'none' }}>
                            <Group gap="xs">
                                <Text size="xl" fw={600}>{name}</Text>
                                <IconExternalLink size={20} />
                            </Group>
                        </Anchor>
                    </Group>
                    <Badge 
                        color={getStateColor(state)}
                        radius="xl"
                        variant="filled"
                        leftSection={<IconAlertTriangle size={16} />}
                    >
                        {state}
                    </Badge>
                </Group>

                {description && (
                    <Text 
                        c="dimmed"
                        size="md"
                    >
                        {description}
                    </Text>
                )}

                <Stack gap="sm">
                    <Group gap="xs">
                        <IconCode size={16} />
                        <Text size="md"><strong>Namespace:</strong> {namespace}</Text>
                    </Group>
                    <Group gap="xs">
                        <IconChartBar size={16} />
                        <Text size="md"><strong>Threshold:</strong> {threshold}</Text>
                    </Group>
                    <Group gap="xs">
                        <IconStack size={16} />
                        <Text size="md"><strong>Actions:</strong> {actions}</Text>
                    </Group>
                    <Stack gap="xs">
                        <Text fw={600} size="md">Dimensions:</Text>
                        <Card padding="xs" bg="gray.0" radius="sm">
                            {Array.isArray(dimensions) 
                                ? dimensions.map((dimension, index) => (
                                    Object.entries(dimension).map(([key, value]) => (
                                        <Text key={`${index}-${key}`} size="sm">{key}: {value}</Text>
                                    ))
                                ))
                                : Object.entries(dimensions).map(([key, value]) => (
                                    <Text key={key} size="sm">{key}: {value as string}</Text>
                                ))
                            }
                        </Card>
                    </Stack>
                    <Group gap="xs">
                        <IconCalendar size={16} />
                        <Text 
                            c="dimmed"
                            size="sm"
                            fs="italic"
                        >
                            Last Updated: {new Date(lastUpdated).toLocaleString()}
                        </Text>
                    </Group>
                </Stack>
            </Stack>
        </Card>
    );
};
