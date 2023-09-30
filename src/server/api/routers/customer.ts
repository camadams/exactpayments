
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { customerSchema } from "./sale";



export const customerRouter = createTRPCRouter({
  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  createCustomer: publicProcedure
    .input(customerSchema)
    .mutation(({ ctx, input }) => {
      const { name, email, invoicePrefix } = input;
      return ctx.prisma.customer.create({
        data: {
          name, email, invoicePrefix,
        }
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    const allCustomers = ctx.prisma.customer.findMany();
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
