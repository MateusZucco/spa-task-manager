import { TaskListPage } from "@/app/components/tasks/TaskListPage";
import { getQueryClient, trpc } from "@/trpc/server";
import { TASK_PAGE_SIZE } from "@/trpc/schema/tasks.schema";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Page() {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(
    trpc.getAll.infiniteQueryOptions(
      { limit: TASK_PAGE_SIZE },
      {
        initialCursor: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskListPage />
    </HydrationBoundary>
  );
}
