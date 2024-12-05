"use client"
import * as React from "react";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconDownload } from '@tabler/icons-react';
import { useAIConversation } from "@/client";

export default function DownloadButton({id}: {id: string}) {

    const [
        {
            data: { messages, conversation },
        },
    ] = useAIConversation('chat', { id });

    const handleDownload = () => {
        const title = conversation?.name || 'Chat with Amazon CloudWatch';
        const markdownContent = `# ${title}\n\n` + 
            `Date: ${new Date(conversation?.createdAt || "").toLocaleString()}\n\n` +
            messages
                .map(msg => {
                    const timestamp = new Date(msg.createdAt).toLocaleString();
                    return `${msg.role === 'user' ? '### User' : '### Assistant'} - ${timestamp}\n${msg.content.map(c => c.text).join('\n')}\n`;
                })
                .join('\n');
        const blob = new Blob([markdownContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Tooltip label="Download conversation as markdown" color="blue" withArrow opacity={0.7}>
            <ActionIcon onClick={handleDownload} variant="subtle">
                <IconDownload size={18} />
            </ActionIcon>
        </Tooltip>
    )
}
