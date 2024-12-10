import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Stars, Loader2, MessageSquare } from "lucide-react";
import { uploadData } from "aws-amplify/storage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { client } from "@/client";
import BlinkingStars from "@/components/BlinkingStars";

export default function Hero() {
  const navigate = useNavigate();
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    const { data: outputStory } = await client.generations.generateStory({
      description: story,
    });

    if (outputStory?.story) {
      const data = { story: outputStory.story, title: outputStory.title };
      const id = await saveData(data);
      navigate(`/story/${id}`);
    }

    // Reset form
    setIsLoading(false);
    setStory("");
  };

  const saveData = async ({
    story,
    title,
  }: {
    story: string;
    title: string;
  }) => {
    // 1. Save story created into story model
    const { data: pictureCreate } = await client.models.Story.create({
      story,
      title,
    });

    // 2. Create an image based on the story
    const { data: image, errors } = await client.queries.generateImage({
      prompt: "Create an image based on this story: " + story,
    });
    console.log("errors", errors);

    // 3. Upload the new image to the S3 bucket
    await uploadData({
      path: `pictures/${pictureCreate?.id}.jpeg`,
      data: `${image}`,
      options: {
        contentEncoding: "base64",
        contentType: "image/jpeg",
      },
    }).result;

    // 4. Return id needed later for route
    return pictureCreate?.id;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center p-4 overflow-hidden relative flex-col gap-5">
      <BlinkingStars />
      <div className="bg-indigo-800 bg-opacity-30 backdrop-blur-sm rounded-xl p-8 shadow-2xl w-full max-w-2xl border border-indigo-500 relative">
        <Stars className="absolute top-4 left-4 w-6 h-6 text-yellow-300 animate-pulse" />
        <Stars className="absolute bottom-4 right-4 w-6 h-6 text-yellow-300 animate-pulse" />
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400 font-serif">
            Demo AI Story Generator
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Textarea
              placeholder="In a realm beyond imagination..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full h-40 p-4 text-lg bg-indigo-700 bg-opacity-50 rounded-lg border-2 border-indigo-500 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300 transition-all duration-300 ease-in-out text-white placeholder-indigo-300"
              disabled={isLoading}
            />
            <Sparkles className="absolute top-2 right-2 w-6 h-6 text-yellow-300 animate-pulse" />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 text-indigo-900 font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Weaving Magic...</span>
              </div>
            ) : (
              "Create a Story"
            )}
          </Button>
        </form>
        <p className="mt-6 text-center text-indigo-200 text-opacity-80">
          "Whisper your story to the ancient spirits, and watch as they breathe
          life into your words!"
        </p>
      </div>
      <Button
        onClick={() => navigate("/chat")}
        className="bg-pink-600 hover:bg-pink-700 text-white flex items-center space-x-2 rounded "
      >
        <MessageSquare className="w-4 h-4" />
        <span>Switch to Chat Mode</span>
      </Button>
    </div>
  );
}
