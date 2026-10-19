"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppStore, type AppState } from "../stores/app.store";

function appStateFromPathname(pathname: string): AppState {
  if (pathname === "/task/new") return "new";
  if (/^\/task\/[^/]+\/edit\/?$/.test(pathname)) return "edit";
  return "list";
}

export function useAppStateFromRouter() {
  const pathname = usePathname();
  const setState = useAppStore((store) => store.setState);

  useEffect(() => {
    setState(appStateFromPathname(pathname));
  }, [pathname, setState]);
}
