import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { createErrorMiddleware } from "./middleware/middleware";

export async function createTRPCContext(_opts: { headers: Headers }) {
  return {};
}

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context().create({
  transformer: superjson,
});

const errorMiddleware = createErrorMiddleware(t);

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure
  .use(errorMiddleware)
