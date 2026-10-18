"use client";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

export default function NewTaskPage() {
  const {
    control,
    reset,
    formState: { errors },
    watch,
  } = useForm<{ title: string; description: string }>({
    // defaultValues: TaskModel(null),
    mode: "all",
    // resolver: zodResolver(TaskSchema),
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">New task</h1>
      <Controller
        name="title"
        control={control}
        rules={{ required: "O título é obrigatório" }}
        render={({ field }) => (
          <input {...field} required placeholder="Title" />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <input {...field} placeholder="Description (Optional)" />
        )}
      />
      <div className="flex gap-4 md:gap-10">
        <button
          type="button"
          
          className="px-4 py-2 underline rounded-lg cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-lg w-full md:w-fit hover:bg-primary/60 cursor-pointer"
        >
          Create
        </button>
      </div>
    </main>
  );
}
