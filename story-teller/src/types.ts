import { Schema } from "amplify/data/resource";
import { SelectionSet } from "aws-amplify/api";

export const selectionSet = ["id", "title", "story"] as const;

export type StoryCardProps = SelectionSet<
  Schema["Story"]["type"],
  typeof selectionSet
>;

export interface ScrollingTextProps {
  generatedImage: string;
  story: string;
}
