"use client"
import * as React from "react";
import { AppShell } from "@mantine/core";
import Header from "@/components/Header";


export default function AppContainer({ children }: { children: any }) {
  return (
    <AppShell
      header={{ height: 60 }}
      padding="xl"
    >
      <AppShell.Header p="sm">
        <Header />
      </AppShell.Header>
      <AppShell.Main bg="#f5f5f5">
        {children}
      </AppShell.Main>
    </AppShell>
  );
}