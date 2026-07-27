"use client";

import { useDemo } from "@/context/DemoContext";
import { ROLES } from "@/lib/data";
import { VIEW_PATHS } from "@/lib/routes";
import type { ViewId } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export function RoleGate({
  view,
  children,
}: {
  view: ViewId;
  children: ReactNode;
}) {
  const { allowedTabs, role } = useDemo();
  const router = useRouter();
  const allowed = allowedTabs.includes(view);

  useEffect(() => {
    if (!allowed) {
      router.replace(VIEW_PATHS[ROLES[role].default]);
    }
  }, [allowed, role, router]);

  if (!allowed) return null;
  return <>{children}</>;
}
