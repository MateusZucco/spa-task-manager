import { initTRPC, TRPCError } from "@trpc/server";

type TRPCInstance = ReturnType<ReturnType<typeof initTRPC.context>["create"]>;
type ErrorMiddlewareFn = Parameters<TRPCInstance["middleware"]>[0];

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
export function createErrorMiddleware(t: {
  middleware: (fn: ErrorMiddlewareFn) => ReturnType<TRPCInstance["middleware"]>;
}) {
  return t.middleware(async ({ path, type, next }) => {
    const result = await next();

    if (!result.ok) {
      const { error } = result;

      logError({ error, path, type });
      handleError(error);
    }
    return result;
  });
}
