import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

export const useDestinationDetail = (destinationId: string) => {
  const [destination, setDestination] =
    useState<Schema["Destinations"]["type"]>();
  const [destinationActivities, setDestinationActivities] = useState<
    Schema["Activities"]["type"][]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: destination, errors: destinationError } =
          await client.models.Destinations.get({
            id: destinationId,
          });
        if (destinationError) {
          console.error("destinationError:", destinationError);
          return;
        }
        if (destination) {
          setDestination(destination);
          const activities = await destination.activities();
          if (activities?.data) {
            setDestinationActivities(activities.data);
          }
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchData();
  }, [destinationId]);

  return { destination, destinationActivities };
};
