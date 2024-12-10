import type { Schema } from "../../data/resource";
import { env } from "$amplify/env/getNews";

const URL = "https://newsapi.org/v2/everything?q=";

export const handler: Schema["getNews"]["functionHandler"] = async (event) => {
  const res = await fetch(
    `${URL}${encodeURIComponent(event.arguments.category ?? "")}&apiKey=${
      env.NEWS_API_KEY
    }`
  );
  const json = await res.json();

  const newsItem = json.articles[0];

  return {
    title: newsItem.title,
    description: newsItem.description,
  };
};
