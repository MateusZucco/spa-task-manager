"use client";

import { AppLoader } from "@/app/components/AppLoader";
import { TasksList } from "@/app/components/tasks/TaskList";
import { useGetAllTasks } from "@/app/hooks/useTask";
import { useEffect, useRef } from "react";

export function TaskListPage() {
  const taskList = useGetAllTasks();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const tasks = taskList.data?.pages.flatMap((page) => page.items) ?? [];

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver((entries) => {
      if (
        entries[0]?.isIntersecting &&
        taskList.hasNextPage &&
        !taskList.isFetchingNextPage
      ) {
        void taskList.fetchNextPage();
      }
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [
    taskList.fetchNextPage,
    taskList.hasNextPage,
    taskList.isFetchingNextPage,
    tasks.length,
  ]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
      {taskList.isPending ? (
        <AppLoader />
      ) : (
        <>
          <TasksList tasks={tasks} />
          <div ref={sentinelRef} className="h-px" aria-hidden="true" />
          {taskList.isFetchingNextPage ? (
            <AppLoader label="Loading more tasks" className="py-6" />
          ) : null}
        </>
      )}
    </main>
  );
}
