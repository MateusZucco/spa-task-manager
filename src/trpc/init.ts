import { initTRPC, TRPCError } from "@trpc/server";
import { MiddlewareResult } from "@trpc/server/unstable-core-do-not-import";
import superjson from "superjson";

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context().create({
  transformer: superjson,
});

function logError({
  error,
  path,
  type,
}: {
  error: TRPCError;
  path: string;
  type: string;
}) {
  const start = Date.now();
  if (error.code === "INTERNAL_SERVER_ERROR") {
    console.error(`[CRITICAL] route: ${path}`, {
      type,
      ...error,
    });
  } else if (error.code === "BAD_REQUEST") {
    console.debug(`[VALIDATION] route: ${path}`);
  }

  const durationMs = Date.now() - start;
  if (durationMs > 2000) {
    console.warn(`[PERFORMANCE] route: ${path} latency ${durationMs}ms`);
  }
}

function handleError(error: TRPCError) {
  if (error instanceof TRPCError) {
    throw new TRPCError({ ...error });
  } else {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred, please try again later.",
      cause: error,
    });
  }
}

/*
 *  middleware to log and handle error
 */
const errorMiddleware = t.middleware(async ({ path, type, next }) => {
  const result = await next();

  if (!result.ok) {
    const { error } = result;

    logError({ error, path, type });
    handleError(error);
  }
  return result;
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure
  .use(errorMiddleware)
