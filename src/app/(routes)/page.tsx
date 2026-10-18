"use client";
import { AppLoader } from "@/app/components/AppLoader";
import { TasksList } from "@/app/components/tasks/TaskList";
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '../../trpc/client';
import { useGetAllTasks } from "../hooks/useTask";

export default function TaskListPage() {

  const taskList = useGetAllTasks();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
      {taskList.isPending ? <AppLoader /> : <TasksList tasks={taskList.data ?? []} />}
    </main>
  );
}
