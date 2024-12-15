"use client"
import * as React from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { AIConversation } from "@aws-amplify/ui-react-ai";

import { Divider, Group } from "@mantine/core";
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

import { CloudWatchAlarmCard } from "./CloudWatchAlarmCard";
import { Chart } from "./Chart";

import { client } from "@/client";
import { useAIConversation } from "@/client";
import { ConversationsContext } from "@/providers/ConversationProvider";
import FollowUpBanner from "./FollowupBanner";
import ChatHeader from "./ChatHeader";

export default function Chat({ id }: { id: string }) {
    const [
        {
            data: { messages, conversation },
            isLoading,
        },
        handleSendMessage
    ] = useAIConversation('chat', { id });

    const { user } = useAuthenticator();
    const { updateConversation } = React.useContext(ConversationsContext)
    const [followupQuestions, setFollowupQuestions] = React.useState<string[]>([])

    React.useEffect(() => {
        const subscription = conversation?.onStreamEvent({
            next: (event) => {
                if (event.stopReason === "end_turn") {
                    client.generations.generateFollowup({
                        content: messages.map((c) => `${c.role}: ${c.content}`).join(""),
                    }).then((res) => {
                        setFollowupQuestions(res.data?.question as string[] ?? [])
                    })
                }
            },
            error: (error) => console.error(error),
        });
        return subscription?.unsubscribe
    }, [conversation]);


    return (
        <>
            <ChatHeader id={id} title={conversation?.name || "Chat"} lastUpdated={conversation?.updatedAt || ""} />
            <AIConversation
                avatars={{
                    user: {
                        username: user ? user.signInDetails?.loginId : "User",
                    },
                    ai: {
                        username: "CloudWatch Assistant",
                    }
                }}
                messages={messages}
                isLoading={isLoading}
                handleSendMessage={(message) => {
                    handleSendMessage(message)
                    if (!conversation?.name) {
                        client.generations
                            .chatNamer({
                                content: message.content.map((c) => c.text ?? "").join(""),
                            })
                            .then((res) => {
                                updateConversation({
                                    id,
                                    name: res.data?.name ?? "",
                                });
                            });
                    }
                }}
                messageRenderer={{
                    text: ({ text }) => (
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                            {text}
                        </ReactMarkdown>
                    )
                }}
                responseComponents={{
                    AlarmDetailsCard: {
                        description: 'Used to display the details of a CloudWatch Alarm',
                        component: CloudWatchAlarmCard,
                        props: {
                            name: {
                                type: "string",
                            },
                            description: {
                                type: "string",
                            },
                            state: {
                                type: "string",
                            },
                            threshold: {
                                type: "string",
                            },
                            lastUpdated: {
                                type: "string",
                            },
                            actions: {
                                type: "string",
                            },
                            namespace: {
                                type: "string",
                            },
                            dimensions: {
                                type: "object",
                            },
                            deepLink: {
                                type: "string",
                            }
                        }
                    },
                    Chart: {
                        description: 'Used to display a chart of a CloudWatch metric',
                        component: Chart,
                        props: {
                            datapoints: {
                                type: "array",
                            },
                            label: {
                                type: "string",
                            }
                        }
                    },
                }}
            />
            {followupQuestions.length > 0 && (
                <>
                    <Divider my="sm" />
                    <Group gap="sm" justify="center">
                        {followupQuestions.map((question, index) => (
                            <FollowUpBanner key={index} question={question} onClick={conversation?.sendMessage} />
                        ))}
                    </Group>
                </>
            )}
        </>
    )
}
