import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/api";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import { getUrl, uploadData } from "aws-amplify/storage";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { UserInformation } from "./types";
import { fetchImageFromUri } from "./utils";
import { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

export const useProfile = () => {
  const [user, setUser] = useState<UserInformation>();
  const [latestTrips, setLatestTrips] = useState<Schema["Trips"]["type"][]>([]);

  useEffect(() => {
    const askForCameraPermissions = async () => {
      if (Constants.platform?.ios) {
        const cameraRollStatus =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (
          cameraRollStatus.status !== "granted" ||
          cameraStatus.status !== "granted"
        ) {
          alert("Sorry, we need these permissions to make this work!");
        }
      }
    };
    askForCameraPermissions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const attributes = await fetchUserAttributes();
      const currentUser = await getCurrentUser();
      let image = "https://via.placeholder.com/150";
      try {
        const { url } = await getUrl({
          path: `profile-pictures/${attributes.preferred_username}.jpg`,
          options: { validateObjectExistence: true },
        });
        image = url.toString();
      } catch (e) {
        console.log(e);
      }
      const generatedUser: UserInformation = {
        userId: currentUser.userId ?? "userId not found",
        email: attributes.email ?? "Email not found",
        username:
          attributes.preferred_username ??
          attributes.email ??
          "Username not found",
        imageUrlOrKey: image,
      };
      const { data: tripsData, errors: tripsErrors } =
        await client.models.Trips.list({
          filter: { user_id: { eq: currentUser.userId } },
          limit: 3,
        });
      if (tripsErrors) {
        console.log("Error while fetching trips:", tripsErrors);
        return;
      }
      setLatestTrips(tripsData);
      setUser(generatedUser);
    };
    fetchData();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    handleImagePicked(result);
  };

  const handleImagePicked = async (
    pickerResult: ImagePicker.ImagePickerResult
  ) => {
    try {
      if (pickerResult.canceled) {
        alert("Upload cancelled");
        return;
      } else {
        setUser((prev) => ({
          ...prev!,
          imageUrlOrKey: pickerResult.assets[0].uri,
        }));
        uploadImage(`${user?.username}.jpg`, pickerResult.assets[0].uri);
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed");
    }
  };

  const uploadImage = async (filename: string, img: string) => {
    const file = await fetchImageFromUri(img);
    const result = await uploadData({
      path: `profile-pictures/${filename}`,
      data: file,
      options: {
        onProgress: ({ transferredBytes, totalBytes }) => {
          if (totalBytes) {
            const calculated = Math.round(
              (transferredBytes / totalBytes) * 100
            );
            console.log(`Upload progress ${calculated} %`);
          }
        },
      },
    }).result;
    console.log("Path from Response: ", result.path);
  };

  return { user, latestTrips, pickImage };
};
