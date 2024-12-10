import { useNavigate } from "react-router-dom";
import { Wand2, Sparkles, ArrowLeft } from "lucide-react";
import { View } from "@aws-amplify/ui-react";
import { AIConversation } from "@aws-amplify/ui-react-ai";
import { Button } from "@/components/ui/button";
import { useAIConversation } from "@/client";
import { StoryCard } from "@/components/StoryCard";
import BlinkingStars from "@/components/BlinkingStars";

export default function Chat() {
  const navigate = useNavigate();

  const [
    {
      data: { messages },
      isLoading,
    },
    sendMessage,
  ] = useAIConversation("chat");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex flex-col items-center justify-start p-4 overflow-hidden">
      <BlinkingStars />
      <div className="w-full max-w-2xl bg-indigo-800 bg-opacity-30 backdrop-blur-sm rounded-xl shadow-2xl border border-indigo-500 flex flex-col h-[80vh]">
        <div className="p-4 border-b border-indigo-500 flex items-center space-x-4">
          <Wand2 className="w-8 h-8 text-yellow-300" />
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400 font-serif">
            Story Helper
          </h1>
        </div>

        <View flex="1" overflow="hidden">
          <AIConversation
            messages={messages}
            handleSendMessage={sendMessage}
            allowAttachments
            isLoading={isLoading}
            responseComponents={{
              StoryCard: {
                description: "Used to display a story to the user",
                component: StoryCard,
                props: {
                  story: {
                    type: "string",
                    description: "The text of the story",
                  },
                  title: {
                    type: "string",
                    description: "The title of the story",
                  },
                  id: {
                    type: "string",
                    description: "The id of the story",
                  },
                },
              },
            }}
            avatars={{
              user: {
                username: "Erik",
              },
              ai: {
                username: "Story Helper:",
              },
            }}
          />
        </View>
      </div>
      <Sparkles className="absolute top-4 left-4 w-6 h-6 text-yellow-300 animate-pulse" />
      <Sparkles className="absolute bottom-4 right-4 w-6 h-6 text-yellow-300 animate-pulse" />
      <div className="mt-8 flex space-x-4">
        <Button
          onClick={() => navigate("/")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </Button>
      </div>
    </div>
  );
}
