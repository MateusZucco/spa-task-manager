import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { appRouter } from "./app/app.router";

const PORT = Number(process.env.PORT ?? 8000);

const server = createHTTPServer({
  middleware: cors(),
  router: appRouter,
});

server.listen(PORT, () => {
  console.log(`Task API listening on http://localhost:${PORT}`);
});
