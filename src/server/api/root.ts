import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { customerRouter } from "./routers/customer";
import { productRouter } from "./routers/product";
import { saleRouter } from "./routers/sale";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  customer: customerRouter,
  product: productRouter,
  sale: saleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
