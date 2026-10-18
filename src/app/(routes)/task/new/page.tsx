"use client";

import { TaskForm } from "@/app/components/tasks/TaskForm";

export default function NewTaskPage() {


  return (
    <main className="mx-auto max-w-3xl px-6 py-10 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">New task</h1>
      <TaskForm />
    </main>
  );
}
