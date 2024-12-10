import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { downloadData } from "aws-amplify/storage";
import { Loader2, Sparkles } from "lucide-react";
import { StoryCardProps } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { client } from "@/client";

export const StoryCard = ({ id, story, title }: StoryCardProps) => {
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [summaryStory, setSummaryStory] = useState<string>("");
  const navigate = useNavigate();

  const getGeneratedImage = useCallback(async () => {
    if (!id) return;
    const { body: imagePromise } = await downloadData({
      path: `pictures/${id}.jpeg`,
    }).result;
    const image = await imagePromise.text();

    setGeneratedImage(image);
  }, [id]);

  const summarizeStory = useCallback(async () => {
    const { data: summarizedStory } = await client.generations.summarizer({
      story,
    });
    setSummaryStory(summarizedStory?.summary as string);
  }, [story]);

  useEffect(() => {
    getGeneratedImage();
    summarizeStory();
  }, [getGeneratedImage, summarizeStory]);

  if (!summaryStory && !story)
    return (
      <div className="flex items-center justify-center text-white text-2xl">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Grabbing Image and Preview...</span>
      </div>
    );
  return (
    <Card
      onClick={() => navigate(`/story/${id}`)}
      className="w-full max-w-sm overflow-hidden bg-indigo-900 bg-opacity-50 border border-white rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 cursor-pointer"
    >
      {generatedImage ? (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            className="transition-all duration-300 hover:scale-110"
            src={`data:image/jpeg;base64,${generatedImage}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent opacity-60"></div>
        </div>
      ) : null}
      <CardContent className="p-4 relative">
        <Sparkles className="absolute top-2 right-2 w-5 h-5 text-yellow-300 animate-pulse" />
        <h3 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400 font-serif">
          {title}
        </h3>
        <p className="text-indigo-100">
          {/* {story} */}
          {summaryStory}
        </p>
      </CardContent>
    </Card>
  );
};
