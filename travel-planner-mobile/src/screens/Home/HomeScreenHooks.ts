import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

export const useHomeScreenData = () => {
  const [trips, setTrips] = useState<Schema["Trips"]["type"][]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [destinations, setDestinations] = useState<
    Schema["Destinations"]["type"][]
  >([]);
  const [activities, setActivities] = useState<Schema["Activities"]["type"][]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [tripsResponse, activitiesResponse, destinationsResponse] =
          await Promise.all([
            client.models.Trips.list(),
            client.models.Activities.list(),
            client.models.Destinations.list(),
          ]);

        if (
          tripsResponse.errors ||
          activitiesResponse.errors ||
          destinationsResponse.errors
        ) {
          console.error("Error fetching data");
          return;
        }

        setTrips(tripsResponse.data);
        setActivities(activitiesResponse.data);
        setDestinations(destinationsResponse.data);
      } catch (error) {
        console.error("Error while loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const deleteTrip = async (item: Schema["Trips"]["type"]) => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete the trip to ${item.end_location} on ${item.end_date}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await client.models.Trips.delete({ id: item.id });
              setTrips(trips.filter((trip) => trip.id !== item.id));
            } catch (error) {
              console.error("Error deleting trip:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return { isLoading, trips, destinations, activities, deleteTrip };
};
