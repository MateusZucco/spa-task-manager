"use client";
import { AppLoader } from "@/app/components/AppLoader";
import { TaskForm } from "@/app/components/tasks/TaskForm";
import { useGetTaskById } from "@/app/hooks/use-task";
import { useParams } from "next/navigation";

export default function EditTaskPage() {
  const params = useParams<{ id: string }>();
  if (!params.id) return null;

  const task = useGetTaskById(params.id);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Edit task</h1>
      {task.isPending ? <AppLoader /> : <TaskForm task={task.data ?? null} />}
    </main>
  );
}
