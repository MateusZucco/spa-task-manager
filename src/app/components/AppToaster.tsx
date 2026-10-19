"use client";

import { useEffect } from "react";
import { useToastStore } from "@/app/stores/toast.store";

const AUTO_HIDE_MS = 5000;

export function AppToaster() {
  const { open, message, severity, hideToast } = useToastStore();

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(hideToast, AUTO_HIDE_MS);
    return () => window.clearTimeout(timer);
  }, [open, message, severity, hideToast]);

  if (!open) return null;

  const isError = severity === "error";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-end px-4 md:bottom-6 md:px-6">
      <div
        role={isError ? "alert" : "status"}
        aria-live={isError ? "assertive" : "polite"}
        className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${
          isError ? "bg-danger" : "bg-emerald-600"
        }`}
      >
        <p className="min-w-0 flex-1 wrap-break-word">{message}</p>
        <button
          type="button"
          onClick={hideToast}
          aria-label="Dismiss notification"
          className="cursor-pointer leading-none text-white/80 hover:text-white"
        >
          ×
        </button>
      </div>
    </div>
  );
}