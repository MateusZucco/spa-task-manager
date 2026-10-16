import { publicProcedure, router } from "../trpc";
import { TaskSchema } from "../utils/schemas/tasks.schema";
import zod from "zod";
import * as taskController from "./app.controller";

export const appRouter = router({
  getAll: publicProcedure
    .output(TaskSchema.array())
    .query(() => taskController.getAll()),

  getById: publicProcedure
    .input(TaskSchema.pick({ id: true }))
    .output(TaskSchema.or(zod.undefined()))
    .query(({ input }) => taskController.getById(input.id)),

  create: publicProcedure
    .input(TaskSchema.pick({ title: true, description: true }))
    .output(TaskSchema)
    .mutation(({ input }) => taskController.create({ ...input })),

  update: publicProcedure
    .input(TaskSchema)
    .output(TaskSchema.or(zod.undefined()))
    .mutation(({ input }) => taskController.update(input)),

  delete: publicProcedure
    .input(TaskSchema.pick({ id: true }))
    .output(zod.boolean())
    .mutation(({ input }) => taskController.delete(input.id)),
});
export type AppRouter = typeof appRouter;
