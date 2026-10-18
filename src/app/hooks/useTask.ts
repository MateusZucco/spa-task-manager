"use client";

import { useTRPC } from "@/trpc/client";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

async function invalidateQueries(
  queryClient: QueryClient,
  trpc: ReturnType<typeof useTRPC>,
) {
  await Promise.all([
    queryClient.invalidateQueries(trpc.getAll.queryFilter()),
    queryClient.invalidateQueries(trpc.getById.queryFilter()),
  ]);
}

export function useGetAllTasks() {
  const trpc = useTRPC();
  return useQuery(trpc.getAll.queryOptions());
}

export function useGetTaskById(id: string) {
  const trpc = useTRPC();
  return useQuery(trpc.getById.queryOptions({ id }));
}

export function createMutateHook() {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.create.mutationOptions({
      onSuccess: async () => {
        await invalidateQueries(queryClient, trpc);
        router.push("/");
      },
      onError: (error) => {
        console.error(error);
      },
    }),
  );
}

export function useUpdateTask() {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.update.mutationOptions({
      onSuccess: async () => {
        await invalidateQueries(queryClient, trpc);
        router.push("/");
      },
      onError: (error) => {
        console.error(error);
      },
    }),
  );
}

export function useDeleteTask({ closeDialog }: { closeDialog: () => void }) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.delete.mutationOptions({
      onSuccess: async () => {
        await invalidateQueries(queryClient, trpc);
        router.refresh();
        closeDialog();
      },
      onError: (error) => {
        console.error(error);
      },
    }),
  );
}

// export function deleteMutateHook({ showToast }: { showToast: showToastType }) {
//   const { router, utils } = getInstances();
//   return trpc.delete.useMutation({
//     onSuccess: async () => {
//       await refreshCache(router, utils);
//       showToast("Task removed!", "success");
//     },
//     onError: (error) => {
//       const message = getTRPCErrorMessage(error);
//       showToast(message, "error");
//     },
//   });
// }
