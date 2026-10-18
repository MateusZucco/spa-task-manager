"use client";

import { useTRPC } from "@/trpc/client";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToastStore } from "../stores/toastStore";

async function invalidateQueries(
  queryClient: QueryClient,
  trpc: ReturnType<typeof useTRPC>,
) {
  await Promise.all([
    queryClient.invalidateQueries(trpc.getAll.queryFilter()),
    queryClient.invalidateQueries(trpc.getById.queryFilter()),
  ]);
}

async function onSuccessMutation({
  message,
  queryClient,
  router,
  trpc,
}: {
  message: string;
  queryClient: QueryClient;
  router: ReturnType<typeof useRouter>;
  trpc: ReturnType<typeof useTRPC>;
}) {
  await invalidateQueries(queryClient, trpc);
  router.push("/");
  useToastStore.getState().showToast(message, "success");
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
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    trpc.create.mutationOptions({
      onSuccess: async () => {
        await onSuccessMutation({
          message: "Task created successfully",
          queryClient,
          router,
          trpc,
        });
      },
      onError: (error) => {
        useToastStore.getState().showToast(error.message, "error");
      },
    }),
  );
}

export function useUpdateTask() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    trpc.update.mutationOptions({
      onSuccess: async () => {
        await onSuccessMutation({
          message: "Task updated successfully",
          queryClient,
          router,
          trpc,
        });
      },
      onError: (error) => {
        useToastStore.getState().showToast(error.message, "error");
      },
    }),
  );
}

export function useDeleteTask({ closeDialog }: { closeDialog: () => void }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    trpc.delete.mutationOptions({
      onSuccess: async () => {
        await onSuccessMutation({
          message: "Task deleted successfully",
          queryClient,
          router,
          trpc,
        });
        closeDialog();
      },
      onError: (error) => {
        useToastStore.getState().showToast(error.message, "error");
      },
    }),
  );
}
