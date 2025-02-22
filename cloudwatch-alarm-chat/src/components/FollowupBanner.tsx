import * as React from 'react';
import { Button, Text } from '@mantine/core';
import { Conversation } from '@/client';

interface FollowUpBannerProps {
  onClick: Conversation["sendMessage"] | undefined;
  question: string;
}

const FollowUpBanner: React.FC<FollowUpBannerProps> = ({ onClick, question }) => {
  return (
    <Button
      variant="gradient"
      gradient={{ from: 'indigo', to: 'grape', deg: 90 }}
      radius="xl"
      onClick={() => {if(onClick) onClick(question) }}
      size='sm'
      pr={14}
    >
      <Text
        c="white"
        fw={500}>
        {question}
      </Text>
    </Button >
  );
};

export default FollowUpBanner;
