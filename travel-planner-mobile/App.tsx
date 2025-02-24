import React, { useEffect } from "react";

import { Amplify } from "aws-amplify";
import {
  Authenticator,
  InAppMessageDisplay,
  InAppMessagingProvider,
} from "@aws-amplify/ui-react-native";

import outputs from "./amplify_outputs.json";
import { AppNavigator } from "./src/navigation";
import {
  initializeInAppMessaging,
  syncMessages,
} from "aws-amplify/in-app-messaging";

Amplify.configure(outputs);
initializeInAppMessaging();

const App = () => {
  useEffect(() => {
    // Messages from your campaigns need to be synced from the backend before they
    // can be displayed. You can trigger this anywhere in your app. Here you are
    // syncing just once when this component (your app) renders for the first time.
    syncMessages();
  }, []);
  return (
    <Authenticator.Provider>
      <Authenticator>
        <InAppMessagingProvider>
          <InAppMessageDisplay />
          <AppNavigator />
        </InAppMessagingProvider>
      </Authenticator>
    </Authenticator.Provider>
  );
};

export default App;
