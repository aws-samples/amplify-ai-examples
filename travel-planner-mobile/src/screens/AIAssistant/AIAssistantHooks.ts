import { useState, useEffect, useRef } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/api";
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { parseDateString, isValidJSON } from "./utils";
import { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();
const { useAIConversation } = createAIHooks(client);

export const useAIAssistant = () => {
  const [userId, setUserId] = useState("");
  const [inputText, setInputText] = useState("");
  const [
    {
      data: { conversation, messages },
    },
    handleSendMessage,
  ] = useAIConversation("chat");
  const listenerSetup = useRef(false);

  useEffect(() => {
    const fetchUsername = async () => {
      const currentUser = await getCurrentUser();
      setUserId(currentUser.userId);
    };
    fetchUsername();
  }, []);

  useEffect(() => {
    if (!conversation || listenerSetup.current) return;

    const setupConversationListeners = () => {
      conversation.onStreamEvent({
        next: async (event) => {
          if (!messages.length) return;
          listenerSetup.current = true;

          if (event.stopReason === "end_turn") {
            const { data, errors } = await conversation.listMessages();
            if (errors) {
              console.log(errors);
              return;
            }
            const messageText = data[data.length - 1].content
              .map((content) => content.text)
              .join("")
              .trim();

            if (!isValidJSON(messageText)) {
              console.log("Invalid JSON");
              return;
            }

            const parsedTrip = JSON.parse(messageText);
            await createTripData(parsedTrip);
          }
        },
        error: (error) => {
          console.error("Error in conversation stream:", error);
        },
      });
    };

    setupConversationListeners();
  }, [conversation, messages]);

  const createTripData = async (parsedTrip: any) => {
    try {
      const tripData = await createTrip(parsedTrip.Trip);
      const flightData = await createFlight(parsedTrip.Flight);
      const accommodationData = await createAccommodation(
        parsedTrip.Accommodation
      );
      await createTripDetails(
        tripData.id!,
        flightData.id!,
        accommodationData.id!
      );
      const destinationData = await createDestination(parsedTrip.Destination);
      await createActivities(
        parsedTrip.Activities,
        destinationData.id!,
        tripData.id!
      );
    } catch (error) {
      console.error("Error creating trip data:", error);
    }
  };

  const createTrip = async (tripData: any) => {
    const { data, errors } = await client.models.Trips.create({
      user_id: userId,
      start_location: tripData.start_location,
      end_location: tripData.end_location,
      start_date: tripData.start_date,
      end_date: tripData.end_date,
      total_cost: tripData.total_cost,
    });
    if (errors) throw new Error("Trip could not be created");
    return data!;
  };

  const createFlight = async (flightData: any) => {
    const { data, errors } = await client.models.Flights.create({
      flight_number: flightData.flight_number,
      departure_airport: flightData.departure_airport,
      arrival_airport: flightData.arrival_airport,
      departure_time: parseDateString(flightData.departure_time),
      arrival_time: parseDateString(flightData.arrival_time),
      price: flightData.price,
      available_seats: flightData.available_seats,
    });
    if (errors) throw new Error("Flight could not be created");
    return data!;
  };

  const createAccommodation = async (accommodationData: any) => {
    const { data, errors } = await client.models.Accommodations.create({
      name: accommodationData.name,
      type: accommodationData.type,
      address: accommodationData.address,
      rating: accommodationData.rating,
      price_per_night: accommodationData.price_per_night,
      available_rooms: accommodationData.available_rooms,
    });
    if (errors) throw new Error("Accommodation could not be created");
    return data!;
  };

  const createTripDetails = async (
    tripId: string,
    flightId: string,
    accommodationId: string
  ) => {
    const { errors } = await client.models.TripDetails.create({
      trip_id: tripId,
      flight_id: flightId,
      accommodation_id: accommodationId,
    });
    if (errors) throw new Error("TripDetails could not be created");
  };

  const createDestination = async (destinationData: any) => {
    const { data, errors } = await client.models.Destinations.create({
      name: destinationData.name,
      location: destinationData.location,
      climate: destinationData.climate,
    });
    if (errors) throw new Error("Destination could not be created");
    return data!;
  };

  const createActivities = async (
    activities: any[],
    destinationId: string,
    tripId: string
  ) => {
    for (const activity of activities) {
      const { errors } = await client.models.Activities.create({
        name: activity.name,
        description: activity.description,
        location: activity.location,
        duration: activity.duration,
        price: activity.price,
        available_slots: activity.available_slots,
        destinationsId: destinationId,
        tripId: tripId,
      });
      if (errors) throw new Error("Activity could not be created");
    }
  };

  const handleSend = () => {
    handleSendMessage({
      content: [{ text: inputText }],
    });
    setInputText("");
  };

  return {
    inputText,
    setInputText,
    handleSend,
    messages,
  };
};
