"use client";

import * as React from "react";
import { View, Flex, Button } from "@aws-amplify/ui-react";
import { DocumentUpload } from "@/components/DocumentUpload";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

export default function DocumentsPage() {
  const router = useRouter();

  return (
    <View width="100%" height="100vh" overflow="auto">
      <Flex direction="column" padding="large" maxWidth="1200px" margin="0 auto">
        <Button
          variation="link"
          size="small"
          onClick={() => router.push("/")}
          marginBottom="medium"
        >
          <FiArrowLeft /> Back to Chat
        </Button>
        <DocumentUpload />
      </Flex>
    </View>
  );
}
