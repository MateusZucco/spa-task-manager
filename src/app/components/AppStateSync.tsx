"use client";

import { useAppStateFromRouter } from "../hooks/use-app-state-from-router";

export function AppStateSync() {
  useAppStateFromRouter();
  return null;
}
