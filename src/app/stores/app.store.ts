"use client";

import { create } from "zustand";

export type AppState = "new" | "list" | "edit";

export const useAppStore = create<{
  state: AppState;
  setState: (next: AppState) => void;
}>((set) => ({
  state: 'list',
  setState: (next) => set(() => ({ state: next as AppState })),
}));
