"use client";

import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/app/stores/app.store";
import { formatDateTime } from "@/app/utils/format-date-time";
import { Task } from "@/trpc/schema/tasks.schema";
import { useCreateTask, useUpdateTask } from "@/app/hooks/use-task";
import { AppLoader } from "../AppLoader";

const fieldClassName =
  "w-full rounded-lg border border-foreground/15 bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-primary disabled:cursor-not-allowed disabled:bg-foreground/5 disabled:text-foreground/60";

export function TaskForm({ task }: { task?: Task | null }) {
  const router = useRouter();
  const appState = useAppStore().state;
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const { control, handleSubmit } = useForm<{
    id: string;
    title: string;
    description: string;
    createDateTime?: string;
    updateDateTime?: string;
  }>({
    defaultValues: {
      id: task?.id ?? "",
      title: task?.title ?? "",
      description: task?.description ?? "",
      createDateTime: task?.createDateTime ?? undefined,
      updateDateTime: task?.updateDateTime ?? undefined,
    },
  });

  const onSubmit = handleSubmit((data) => {
    if (appState === "edit" && task) {
      updateTask.mutate({
        id: data.id,
        title: data.title,
        description: data.description,
      });
      return;
    }

    createTask.mutate({
      title: data.title,
      description: data.description,
    });
  });

  const isSaving = updateTask?.isPending || createTask?.isPending;

  return (
    <form className="mt-6 flex flex-col gap-5" onSubmit={onSubmit}>
      <Controller
        name="title"
        control={control}
        rules={{ required: "Title is required" }}
        render={({ field, fieldState }) => (
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Title</span>
            <input
              {...field}
              disabled={isSaving}
              required
              placeholder="What needs to be done?"
              aria-invalid={fieldState.invalid}
              className={`${fieldClassName} ${fieldState.invalid ? "border-danger" : ""}`}
            />
            {fieldState.error && (
              <span className="text-xs text-danger">
                {fieldState.error.message}
              </span>
            )}
          </label>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">
              Description{" "}
              <span className="font-normal text-foreground/50">(optional)</span>
            </span>
            <textarea
              {...field}
              disabled={isSaving}
              rows={4}
              placeholder="Add more detail"
              className={`${fieldClassName} resize-y`}
            />
          </label>
        )}
      />

      {appState === "edit" && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Controller
            name="createDateTime"
            control={control}
            disabled={true}
            render={({ field }) => (
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Created</span>
                <input
                  {...field}
                  value={formatDateTime(field.value)}
                  disabled
                  className={fieldClassName}
                />
              </label>
            )}
          />
          <Controller
            name="updateDateTime"
            control={control}
            disabled={true}
            render={({ field }) => (
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Updated</span>
                <input
                  {...field}
                  value={formatDateTime(field.value)}
                  disabled
                  className={fieldClassName}
                />
              </label>
            )}
          />
        </div>
      )}

      <div className="mt-1 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {isSaving ?  <AppLoader /> : <><button
          type="button"
          onClick={() => router.push("/")}
          className="btn btn-ghost"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="btn btn-primary sm:min-w-28"
        >
          {task ? "Save" : "Create"}
        </button></>}
      </div>
    </form>
  );
}
