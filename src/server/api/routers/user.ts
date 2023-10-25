
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

    createTestData: publicProcedure
        .mutation(({ ctx, input }) => {
            const now = new Date();
            const dateDate = now;
            const dateTime = now;
            const dateTimestamp = now;
            const dateTimestamptz = now;
            const dateTimestz = now;
            return ctx.prisma.testDateDelete.create({ data: { dateDate, dateTime, dateTimestamp, dateTimestamptz, dateTimestz } });
        }),

    createTestDataFront: publicProcedure
        .input(z.object({ time: z.date() }))
        .mutation(({ ctx, input }) => {
            const time = input.time;
            console.log({ timeBackEnd: time })
            const dateDate = time;
            const dateTime = time;
            const dateTimestamp = time;
            const dateTimestamptz = time;
            const dateTimestz = time;
            return ctx.prisma.testDateDelete.create({ data: { dateDate, dateTime, dateTimestamp, dateTimestamptz, dateTimestz } });
        }),

    getWhereId: publicProcedure.query(({ ctx, input }) => { return ctx.prisma.testDateDelete.findMany() })
    // deleteSalesTable: publicProcedure
    //     .mutation(({ ctx, input }) => {
    //         const now = new Date();
    //         return ctx.prisma.sale.delete({ data: { createDate: now } });
    //     }),
});
