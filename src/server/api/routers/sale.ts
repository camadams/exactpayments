
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const saleRouter = createTRPCRouter({
  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  getAllSalesBetweenFromAndTo: publicProcedure
    .input(z.object({ from: z.date().optional(), to: z.date() }))
    .query(({ ctx, input }) => {
      // input.to = input.to ?? input.from;
      // if(from === undefined) { 
      const saless = ctx.prisma.sale.findMany({ where: { saleDate: { gte: input.from, lte: input.to } } })
      return saless;
    }),

  getAllSalesBetweenFromAndToByUserId: publicProcedure
    .input(z.object({ from: z.date().nullish(), to: z.date().nullish(), userId: z.number().optional() }))
    .query(({ ctx, input }) => {
      // input.to = input.to ?? input.from;
      // if(from === undefined) { 
      const saless = ctx.prisma.sale.findMany({ where: { saleDate: { gte: input.from ?? undefined, lte: input.to ?? undefined }, userId: input.userId } })
      return saless;
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    const a = ctx.prisma.example.findMany();
    return a;
  }),

  getForMonth: publicProcedure.query(({ ctx }) => {
    const a = ctx.prisma.sale.findMany();
    return a;
  }),

  getForMontsfredafdsh: publicProcedure.query(({ ctx }) => {
    const a = ctx.prisma.product.findMany();
    return a;
  }),

  create: publicProcedure
    .input(z.object({ saleDate: z.date(), quantity: z.number(), productId: z.number().min(1), customerId: z.number(), }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.sale.create({
        data: {
          saleDate: input.saleDate,
          quantity: input.quantity,
          productId: input.productId,
          customerId: input.customerId,
          userId: 1,
        }
      });
    }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),
});
