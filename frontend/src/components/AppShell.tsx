"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [headerState, setHeaderState] = useState({
    title: "SPA Task Manager",
    visible: true,
    action: {
      label: "New Task",
      show: true,
      onClick: () =>{ router.push("/new")
        setHeaderState({
          ...headerState,
          action: {
            ...headerState.action,
            show: false,
          },
        });
      },
    },
  });

  return (
    <>
      <AppHeader state={headerState} />
      {children}
    </>
  );
}
