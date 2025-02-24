import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

export const useTripDetail = (tripId: string) => {
  const [trip, setTrip] = useState<Schema["Trips"]["type"]>();
  const [tripDetails, setTripDetails] =
    useState<Schema["TripDetails"]["type"]>();
  const [flight, setFlight] = useState<Schema["Flights"]["type"]>();
  const [accommodation, setAccommodation] =
    useState<Schema["Accommodations"]["type"]>();
  const [tripActivities, setTripActivities] = useState<
    Schema["Activities"]["type"][]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripData, tripDetailsData] = await Promise.all([
          client.models.Trips.get({ id: tripId }),
          client.models.TripDetails.list({
            filter: { trip_id: { eq: tripId } },
          }),
        ]);

        if (tripData.errors || !tripData.data) {
          console.log("Error while fetching trip:", tripData.errors);
          return;
        }
        setTrip(tripData.data);

        if (
          tripDetailsData.errors ||
          !tripDetailsData.data ||
          tripDetailsData.data.length === 0
        ) {
          console.log(
            "Error while fetching trip details:",
            tripDetailsData.errors
          );
          return;
        }
        const tripDetail = tripDetailsData.data[0];
        setTripDetails(tripDetail);

        const [activitiesData, flightData, accommodationData] =
          await Promise.all([
            tripData.data.activities(),
            client.models.Flights.list({
              filter: { id: { eq: tripDetail.flight_id } },
            }),
            client.models.Accommodations.list({
              filter: { id: { eq: tripDetail.accommodation_id } },
            }),
          ]);

        if (activitiesData?.data) {
          setTripActivities(activitiesData.data);
        }

        if (flightData.data && flightData.data.length > 0) {
          setFlight(flightData.data[0]);
        }

        if (accommodationData.data && accommodationData.data.length > 0) {
          setAccommodation(accommodationData.data[0]);
        }
      } catch (error) {
        console.log("Unexpected error:", error);
      }
    };

    fetchData();
  }, [tripId]);

  return { trip, tripDetails, flight, accommodation, tripActivities };
};
