"use client";

import { useDeleteTask } from "@/app/hooks/useTask";
import { formatDateTime } from "@/app/utils/formatDateTime";
import Link from "next/link";
import { useRef, useState } from "react";
import { AppLoader } from "../AppLoader";

export type Task = {
  id: string;
  title: string;
  description?: string;
  createDateTime?: string;
  updateDateTime?: string;
};

type TasksListProps = {
  tasks: Task[];
};

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

export function TasksList({ tasks }: TasksListProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const deleteTask = useDeleteTask({ closeDialog: closeDeleteDialog });
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  function openDeleteDialog(task: Task) {
    setTaskToDelete(task);
    dialogRef.current?.showModal();
  }

  function closeDeleteDialog() {
    dialogRef.current?.close();
  }

  function confirmDelete() {
    if (!taskToDelete) return;

    const id = taskToDelete.id;
    deleteTask.mutate({ id });
  }

  const isDeleting = deleteTask?.isPending;

  return (
    <div className="@container mt-6 overflow-x-auto rounded-lg border border-foreground/10">
      <table className="w-full min-w-160 border-collapse text-left text-sm">
        <thead className="bg-foreground/5 text-xs uppercase tracking-wide text-foreground/60">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium whitespace-nowrap">
              Title
            </th>
            <th scope="col" className="px-4 py-3 font-medium whitespace-nowrap">
              Description
            </th>
            <th scope="col" className="px-4 py-3 font-medium whitespace-nowrap">
              Created at
            </th>
            <th scope="col" className="px-4 py-3 font-medium whitespace-nowrap">
              Updated at
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right font-medium whitespace-nowrap"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-0">
                <p className="sticky left-0 w-[100cqw] px-4 py-8 text-center text-foreground/70">
                  No tasks yet.
                </p>
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr
                key={task.id}
                className="border-t border-foreground/10 hover:bg-foreground/5"
              >
                <td className="px-4 py-3 font-medium">{task.title}</td>
                <td className="px-4 py-3 text-foreground/70">
                  {task.description || "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDateTime(task.createDateTime) || "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDateTime(task.updateDateTime) || "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`task/${task.id}/edit`}
                      aria-label={`Edit ${task.title}`}
                      title="Edit"
                      className="inline-flex size-8 items-center justify-center rounded-md text-primary hover:bg-primary/10"
                    >
                      <EditIcon />
                    </Link>
                    <button
                      type="button"
                      onClick={() => openDeleteDialog(task)}
                      aria-label={`Delete ${task.title}`}
                      title="Delete"
                      className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-danger hover:bg-danger/10"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <dialog
        ref={dialogRef}
        aria-labelledby="delete-task-title"
        className="w-[min(24rem,calc(100%-2rem))] rounded-lg border border-foreground/10 bg-background p-6 text-foreground shadow-lg"
        onClose={() => setTaskToDelete(null)}
      >
        <h2 id="delete-task-title" className="text-lg font-semibold">
          Delete task
        </h2>
        <p className="mt-2 text-sm text-foreground/70">
          Delete “{taskToDelete?.title}”? This cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          {isDeleting ? (
            <AppLoader />
          ) : (
            <>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={closeDeleteDialog}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
