import type { Metadata } from "next";
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Layout } from "@/components/Layout";
import { ConfigureAmplify } from "./ConfigureAmplify";

export const metadata: Metadata = {
  title: "CloudWatch Alarm Chat", 
  description: "GenAI chat assistant for your CloudWatch Alarms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body>
        <ConfigureAmplify />
        <MantineProvider>
          <Layout>
            {children}
          </Layout>
        </MantineProvider>
      </body>
    </html>
  );
}
