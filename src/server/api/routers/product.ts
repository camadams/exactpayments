
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { productSchema } from "./sale";


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

  createProduct: publicProcedure
    .input(productSchema)
    .mutation(({ ctx, input }) => {
      const { name, unitPrice } = input;
      return ctx.prisma.product.create({
        data: {
          name, unitPrice
        }
      });
    }),

  updateProduct: publicProcedure
    .input(z.object({ id: z.number(), name: z.string(), unitPrice: z.number() }))
    .mutation(({ ctx, input }) => {
      const { id, name, unitPrice } = input;
      return ctx.prisma.product.update({
        where: { id },
        data: { name, unitPrice }
      });
    }),

  getForMonth: publicProcedure.query(({ ctx }) => {
    const a = ctx.prisma.example.findMany();
    return a;
  }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),

});
