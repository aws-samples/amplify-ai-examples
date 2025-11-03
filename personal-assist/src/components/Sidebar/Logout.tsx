"use client";

import { Button } from "@aws-amplify/ui-react";
import { signOut } from "aws-amplify/auth";

export const LogoutButton = () => {
  return (
    <Button
      onClick={() => {
        signOut();
      }}
    >
      Logout
    </Button>
  );
};
