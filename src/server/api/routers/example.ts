import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .mutation(({ ctx, input }) => {
      return ctx.prisma.example.create({ data: {} })
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getAllAfterDate: publicProcedure
    .input(z.object({ date: z.date() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.example.findMany({ where: { createdAt: { gte: input.date } } });
    }),

  getAllBeforeDate: publicProcedure
    .input(z.object({ date: z.date() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.example.findMany({ where: { createdAt: { lte: input.date } } });
    }),

  getByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.example.findMany({ where: { username: input.username } });
    }),


  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
