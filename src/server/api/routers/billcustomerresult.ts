import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { billCustomerResultSchema } from "~/com/sheetspro/BillCustomerResult";
import { invoiceLineSchema } from "~/com/sheetspro/InvoiceLine";

const billResultSchema = z.object({ hi: z.string() })

export const billCustomerResultRouter = createTRPCRouter({
  getAllSalesBetweenFromAndTo: publicProcedure
    .input(z.object({ from: z.date().optional(), to: z.date() }))
    .query(({ ctx, input }) => {
      // input.to = input.to ?? input.from;
      // if(from === undefined) { 
      const saless = ctx.prisma.sale.findMany({ where: { saleDate: { gte: input.from, lte: input.to } } })
      return saless;
    }),

  // getAllSalesBetweenFromAndToByUserId: publicProcedure
  //   .input(z.object({ from: z.date().nullish(), to: z.date().nullish(), userId: z.number().optional() }))
  //   .query(({ ctx, input }) => {
  //     // input.to = input.to ?? input.from;
  //     // if(from === undefined) { 
  //     const saless = ctx.prisma.sale.findMany({ where: { saleDate: { gte: input.from ?? undefined, lte: input.to ?? undefined }, userId: input.userId } })
  //     return saless;
  //   }),

  getAll: publicProcedure.query(({ ctx }) => {
    const a = ctx.prisma.billCustomerResult.findMany();
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


  getInvoiceDetailsFromInvoiceNumber: publicProcedure
    .input(z.object({ invoiceNumber: z.string() }))
    .query(async ({ ctx, input }) => {
      const invoiceNumber = input.invoiceNumber;
      const billResult = await ctx.prisma.billCustomerResult.findFirst({ where: { invoiceNumber } });
      if (!billResult) throw new TRPCError({ message: "eh", code: "INTERNAL_SERVER_ERROR" })
      const invoiceLines = await ctx.prisma.invoiceLine.findMany({ where: { billCustomerResultId: billResult.id } });

      return { billResult, invoiceLines };
    }),

  create: publicProcedure
    .input(billCustomerResultSchema)
    .mutation(async ({ ctx, input }) => {
      const { billDate, billFromDate, billToDate, customerEmail, firstName, grandTotal, invoiceLines, invoiceNumber, textSummary, filename } = input;
      const a = await ctx.prisma.billCustomerResult.create({
        data: {
          firstName: firstName,
          customerEmail: customerEmail,
          invoiceLines: {
            create: invoiceLines.map((line) => ({
              description: line.description,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
              total: line.total,
            })),
          },
          invoiceNumber: invoiceNumber,
          grandTotal: grandTotal,
          filename: filename,
          billFromDate: billFromDate,
          billToDate: billToDate,
          billDate: billDate,
          textSummary: textSummary
        }
      });
      return a;
    }),

  // create: publicProcedure
  //   .input(z.object({ saleDate: z.date(), quantity: z.number(), productId: z.number().min(1), customerId: z.number(), }))
  //   .mutation(({ ctx, input }) => {
  //     return ctx.prisma.sale.create({
  //       data: {
  //         saleDate: input.saleDate,
  //         quantity: input.quantity,
  //         productId: input.productId,
  //         customerId: input.customerId,
  //         userId: 1,
  //       }
  //     });
  //   }),

  getLatestInvoiceNumber: publicProcedure.query(({ ctx }) => {
    return "1";
  }),
  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),
});


