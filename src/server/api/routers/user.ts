
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    getAllExceptMeAndNotSellingTo: publicProcedure
        .input(z.object({ userId: z.number().nullish() }))
        .query(async ({ ctx, input }) => {
            const { userId } = input;
            if (!userId) {
                return []
            }
            const connections = await ctx.prisma.connection.findMany({ where: { sellingUserId: userId } });
            const connectionsUserIdThatAreBuyingFromMe = connections.map(connection => connection.buyingUserId);
            const allCustomers = ctx.prisma.user.findMany({ where: { id: { notIn: [userId, ...connectionsUserIdThatAreBuyingFromMe] } } });
            return allCustomers;
        }),
});
