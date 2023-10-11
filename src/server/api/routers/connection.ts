import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { type RouterOutputs } from "~/utils/api";

type MyConnection = RouterOutputs["connection"]["getAll"][number];

export const connectionRouter = createTRPCRouter({


  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.connection.findMany();
  }),


  create: publicProcedure
    .input(z.object({ sellingUserId: z.number(), buyingUserId: z.number(), status: z.number(), sentFromUserId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { sellingUserId, buyingUserId, status, sentFromUserId } = input;
      return await ctx.prisma.connection.create({
        data: {
          sellingUserId, buyingUserId, status, sentFromUserId
        }
      })
    }),

  updateStatus: publicProcedure
    .input(z.object({ connectionId: z.number(), connectionStatus: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { connectionId, connectionStatus } = input;
      return await ctx.prisma.connection.update({
        where: { id: connectionId },
        data: { status: connectionStatus },
      })
    }),

  getConnectionsThatAreBuyingFromMe: publicProcedure
    .input(z.object({ userId: z.number().nullish() }))
    .query(async ({ ctx, input }) => {
      const { userId: myUserId } = input;
      const usersThatAreSellingToMe = [];
      const usersThatAreBuyingFromMe = [];

      if (myUserId) {


        const connectionsWhereIAmBuying = await ctx.prisma.connection.findMany({ where: { buyingUserId: myUserId } });
        for (const connectionWhereIAmBuying of connectionsWhereIAmBuying) {
          const userThatIsSellingToMe = await ctx.prisma.user.findFirst({ where: { id: connectionWhereIAmBuying.sellingUserId } });
          if (userThatIsSellingToMe) usersThatAreSellingToMe.push(userThatIsSellingToMe);
        }

        const connectionsWhereIAmSelling = await ctx.prisma.connection.findMany({ where: { sellingUserId: myUserId } });
        for (const connectionWhereIAmSelling of connectionsWhereIAmSelling) {
          const userThatIsBuyingFromMe = await ctx.prisma.user.findFirst({ where: { id: connectionWhereIAmSelling.buyingUserId } });
          if (userThatIsBuyingFromMe) {
            usersThatAreBuyingFromMe.push({ ...userThatIsBuyingFromMe, status: 1 })
          };
        }


      }

      return { usersThatAreSellingToMe, usersThatAreBuyingFromMe };
    }),

  getMyConnectionsWhereIAmX: publicProcedure
    .input(z.object({ userId: z.number().nullish(), isSelling: z.boolean() }))
    .query(async ({ ctx, input }) => {
      const { userId: myUserId } = input;
      const myConnections = [];

      if (myUserId) {
        const _myConnections = await ctx.prisma.connection.findMany({ where: input.isSelling ? { sellingUserId: myUserId } : { buyingUserId: myUserId } });
        for (const connection of _myConnections) {
          const user = await ctx.prisma.user.findFirst({ where: input.isSelling ? { id: connection.buyingUserId } : { id: connection.sellingUserId } });
          if (user) myConnections.push({ ...connection, name: user.name, email: user.email });
        }
      }

      return myConnections;
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
