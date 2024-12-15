import { useAuthenticator } from '@aws-amplify/ui-react';
import { Anchor, Button, Container, Group, Text } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';

export default function Header() {
    const {signOut} = useAuthenticator();

    return (
        <Container>
            <Group justify="space-between" h="100%">
                <Anchor href="/" underline="never">
                    <Text size="xl" fw={700}>Amazon CloudWatch Assistant</Text>
                </Anchor>
                <Group>
                    <Button
                        variant="default"
                        leftSection={<IconLogout size={14} />}
                        onClick={signOut}
                    >
                        Sign out
                    </Button>
                </Group>
            </Group>
        </Container>
    );
}
