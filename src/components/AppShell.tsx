"use client";

import { Header } from "@/components/Header";
import { InitiativeDrawer } from "@/components/InitiativeDrawer";
import { ReasonModal } from "@/components/ReasonModal";
import { SubmitModal } from "@/components/SubmitModal";
import { ToastStack } from "@/components/ToastStack";
import { DemoProvider } from "@/context/DemoContext";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <DemoProvider>
      <Header />
      <main>{children}</main>
      <InitiativeDrawer />
      <SubmitModal />
      <ReasonModal />
      <ToastStack />
    </DemoProvider>
  );
}
