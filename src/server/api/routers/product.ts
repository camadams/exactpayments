
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  getAll: publicProcedure.query(({ ctx }) => {
    const allCustomers = ctx.prisma.product.findMany();
    return allCustomers;
  }),

  getForMonth: publicProcedure.query(({ ctx }) => {
    const a = ctx.prisma.example.findMany();
    return a;
  }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),
});
