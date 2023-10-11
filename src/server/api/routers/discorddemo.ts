
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type RouterOutputs } from "~/utils/api";

export const discordDemoRouter = createTRPCRouter({
    getAll: publicProcedure
        .query(({ ctx, input }) => {
            return ctx.prisma.discordDemo.findMany();
        }),
});

import { Prisma } from '@prisma/client'



type discordDemoType = RouterOutputs["discordDemo"]["getAll"][number];
const discordDemoVariable = {} as discordDemoType;
discordDemoVariable.abc
