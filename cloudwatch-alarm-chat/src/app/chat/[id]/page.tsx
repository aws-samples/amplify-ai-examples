import { Container, Paper } from "@mantine/core";
import Chat from "@/components/Chat";

export default function ChatPage({ params }: { params: { id: string } }) {
    return (
        <Container w="100%">
            <Paper p="md" radius="md">
                <Chat id={params.id} />
            </Paper>
        </Container>
    );
}