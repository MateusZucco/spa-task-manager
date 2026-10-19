import { TaskListPage } from "@/app/components/tasks/TaskListPage";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Page() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.getAll.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskListPage />
    </HydrationBoundary>
  );
}
