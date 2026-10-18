import { z } from "zod";

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().optional(),
  createDateTime: z.string(),
  updateDateTime: z.string().optional(),
});

export type Task = z.infer<typeof TaskSchema>;
export type TaskList = Task[];
