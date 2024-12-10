import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MessageSquare, Scroll, Stars } from "lucide-react";
import { downloadData } from "aws-amplify/storage";
import { client } from "@/client";
import { Button } from "@/components/ui/button";
import BlinkingStars from "@/components/BlinkingStars";
import ScrollingText from "@/components/ScrollingText";

export default function Story() {
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [story, setStory] = useState("");
  const [title, setTitle] = useState("");
  const { id } = useParams();

  const navigate = useNavigate();

  const handleGenerateImage = useCallback(async () => {
    if (!id) return;

    // 1. Get story information based on id passed in
    const { data: storyInformation } = await client.models.Story.get({
      id: id,
    });
    if (!storyInformation) return;

    // 2. Set the title and story
    setTitle(storyInformation?.title);
    setStory(storyInformation?.story);

    // 3. Retrieve base64 encoded image and set the image
    const { body: imagePromise } = await downloadData({
      path: `pictures/${id}.jpeg`,
    }).result;
    const image = await imagePromise.text();

    setGeneratedImage(image);
  }, [id]);

  useEffect(() => {
    handleGenerateImage();
  }, [handleGenerateImage]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center p-4 overflow-hidden relative flex-col">
        <BlinkingStars />

        <div className="  bg-indigo-800 bg-opacity-30 backdrop-blur-sm rounded-xl p-8 shadow-2xl w-full max-w-4xl border border-indigo-500 relative overflow-hidden">
          <Stars className="absolute top-4 left-4 w-6 h-6 text-yellow-300 animate-pulse" />
          <Stars className="absolute bottom-4 right-4 w-6 h-6 text-yellow-300 animate-pulse" />
          <div className="flex items-center justify-center mb-8">
            <Scroll className="w-12 h-12 text-yellow-300 mr-4" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400 font-serif">
              {title ? title : "Your Story"}
            </h1>
          </div>

          <ScrollingText generatedImage={generatedImage} story={story} />
        </div>

        <div className="mt-8 flex space-x-4">
          <Button
            onClick={() => navigate("/")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Button>
          <Button
            onClick={() => navigate("/chat")}
            className="bg-pink-600 hover:bg-pink-700 text-white flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Switch to Chat Mode</span>
          </Button>
        </div>
      </div>
    </>
  );
}
