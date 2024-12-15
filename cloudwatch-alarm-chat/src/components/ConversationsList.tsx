import React, { useState } from 'react';
import { Stack, Pagination } from '@mantine/core';
import { Schema } from "@/../amplify/data/resource";
import { ConversationItem } from './ConversationItem';

export interface ConversationListProps {
    conversations: Schema["chat"]["type"][];
    limit?: number;
}

export const ConversationList: React.FC<ConversationListProps> = ({ conversations, limit }: ConversationListProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(limit ?? 10);

    const totalPages = Math.ceil(conversations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentConversations = conversations.slice(startIndex, endIndex);

    return (
        <Stack gap="md" justify="space-between">
            <Stack gap="md">
                {currentConversations.map((conversation) => (
                    <ConversationItem key={conversation.id} {...conversation} />
                ))}
            </Stack>

            {totalPages > 1 && (
                <Pagination
                    total={totalPages}
                    value={currentPage}
                    onChange={setCurrentPage}
                    mt="md"
                    style={{ alignSelf: 'center' }}
                />
            )}
        </Stack>
    );
};
