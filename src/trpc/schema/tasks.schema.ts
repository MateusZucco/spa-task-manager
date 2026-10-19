import { z } from "zod";

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().optional(),
  createDateTime: z.string().optional(),
  updateDateTime: z.string().optional(),
});

export const TASK_PAGE_SIZE = 10;

export const TaskPageInputSchema = z.object({
  limit: z.number().int().min(1).max(50).optional(),
  cursor: z.string().nullish(),
});

export const TaskPageSchema = z.object({
  items: TaskSchema.array(),
  nextCursor: z.string().nullable(),
});

export type Task = z.infer<typeof TaskSchema>;
export type TaskList = Task[];
export type TaskPage = z.infer<typeof TaskPageSchema>;
export type TaskPageInput = z.infer<typeof TaskPageInputSchema>;
