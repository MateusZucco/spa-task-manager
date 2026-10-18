"use client";

import { useAppHeaderState } from "../hooks/useAppHeaderState";
import { useRouter } from "next/navigation";

export function AppHeader() {
  const router = useRouter();
  const { title, action } = useAppHeaderState();

  return (
    <div className="flex justify-between md:px-20 md:py-6 p-4">
      <h5 className="w-fit cursor-pointer" onClick={() => router.push("/")}>Task Manager</h5>
      {action.show && (
        <button
          type="button"
          onClick={action.onClick}
          className="btn btn-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
