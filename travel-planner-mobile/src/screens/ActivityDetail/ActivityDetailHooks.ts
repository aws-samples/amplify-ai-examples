import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

export const useActivityDetail = (activityId: string) => {
  const [activity, setActivity] = useState<Schema["Activities"]["type"]>();

  useEffect(() => {
    const fetchActivity = async () => {
      const { data, errors } = await client.models.Activities.get({
        id: activityId,
      });
      if (errors) {
        console.error("Error fetching activity:", errors);
        return;
      }
      if (data) {
        setActivity(data);
      }
    };
    fetchActivity();
  }, [activityId]);

  return { activity };
};
