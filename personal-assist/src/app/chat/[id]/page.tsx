import { Chat } from "./Chat";

export default function ChatPage({ params }: { params: { id: string } }) {
  return <Chat id={params.id} />;
}
