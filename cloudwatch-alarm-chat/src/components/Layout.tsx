"use client";
import * as React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';
import { ConversationsProvider } from "@/providers/ConversationProvider";
import AppContainer from "./AppContainer";

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <Authenticator>
      <Authenticator.Provider>
        <ConversationsProvider>
          <AppContainer>
            {children}
          </AppContainer>
        </ConversationsProvider>
      </Authenticator.Provider>
    </Authenticator>
  );
};
