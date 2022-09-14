// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { roomRouter } from "./room";
import { listingRouter } from "./listings";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("room.", roomRouter)
  .merge("listing.", listingRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
