import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { TaskPageInputSchema, TaskPageSchema, TaskSchema } from '../schema/tasks.schema';
import {getAll, getById, create, update, remove} from '../controller/task.controller';


export const appRouter = createTRPCRouter({
    getAll: baseProcedure
    .input(TaskPageInputSchema)
    .output(TaskPageSchema)
    .query(({ input }) => getAll(input)),

  getById: baseProcedure
    .input(TaskSchema.pick({ id: true }))
    .output(TaskSchema.or(z.undefined()))
    .query(({ input }) => getById(input.id)),

  create: baseProcedure
    .input(TaskSchema.pick({ title: true, description: true }))
    .output(TaskSchema)
    .mutation(({ input }) => create({ ...input })),

  update: baseProcedure
    .input(TaskSchema)
    .output(TaskSchema.or(z.undefined()))
    .mutation(({ input }) => update(input)),

  delete: baseProcedure
    .input(TaskSchema.pick({ id: true }))
    .output(z.boolean())
    .mutation(({ input }) => remove(input.id)),
});
 
// export type definition of API
export type AppRouter = typeof appRouter;