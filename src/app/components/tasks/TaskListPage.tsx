"use client";

import { AppLoader } from "@/app/components/AppLoader";
import { TasksList } from "@/app/components/tasks/TaskList";
import { useGetAllTasks } from "@/app/hooks/use-task";
import { useEffect, useRef } from "react";

export function TaskListPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useGetAllTasks();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const tasks = data?.pages.flatMap((page) => page.items) ?? [];

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, tasks.length]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
      {isPending ? (
        <AppLoader />
      ) : (
        <>
          <TasksList tasks={tasks} />
          <div ref={sentinelRef} className="h-px" aria-hidden="true" />
          {isFetchingNextPage ? (
            <AppLoader label="Loading more tasks" className="py-6" />
          ) : null}
        </>
      )}
    </main>
  );
}
