"use client";

import { useAppStateFromRouter } from "../hooks/useAppStateFromRouter";

export function AppStateSync() {
  useAppStateFromRouter();
  return null;
}
