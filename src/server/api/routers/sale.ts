// import { InvoiceLine } from '~/components/email-template';
import { type Prisma, type PrismaClient } from '@prisma/client';
import { billCustomerResultRouter } from './billcustomerresult';

import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { type DefaultArgs } from '@prisma/client/runtime/library';
// import { InvoiceLine } from "~/utils/businessLogic";

const saleSchema = z.object({
  quantity: z.number().min(0),
});

// Define a schema for the SheetRow type
const sheetRowSchema = z.object({
  date: z.date(),
  sales: z.array(saleSchema),
});

// Define a schema for the SpreadSheet type
export const spreadsheetSchema = z.object({
  rows: z.array(sheetRowSchema),
});

const invoiceLineSchema = z.object({
  description: z.string(),
  quantity: z.number().min(0),
  unitPrice: z.number().min(0),
  total: z.number().min(0),
});

export interface BillCustomerResult {
  firstName: string;
  customerEmail: string;
  invoiceLines: InvoiceLine[];
  invoiceNumber: string;
  grandTotal: number;
  filename?: string;
  billFromDate: Date;
  billToDate: Date;
  billDate: Date;
}


type SpreadSheet = z.infer<typeof spreadsheetSchema>;
type SheetRow = z.infer<typeof sheetRowSchema>;
type InvoiceLine = z.infer<typeof invoiceLineSchema>;

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

  bill: publicProcedure
    .input(spreadsheetSchema)
    .query(async ({ input, ctx }) => {
      const poipoi = await bill(input, ctx.prisma);
      return poipoi;
    }),

  bill2: publicProcedure
    .input(spreadsheetSchema)
    .mutation(async ({ input, ctx }) => {
      return await bill(input, ctx.prisma);;
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

  tata: publicProcedure
    .input(z.object({ content: z.string(), }))
    .mutation(({ ctx, input }) => {
      return input.content;
    }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),
});


const bill = async (spreadSheet: SpreadSheet, prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>): Promise<BillCustomerResult[]> => {

  // if (!spreadSheet.rows[0])
  //   return [];
  console.log("inside bill function on server");
  const custProdLength = spreadSheet.rows[0]!.sales.length;
  const accum: number[] = [...new Array<number>(custProdLength).fill(0)];

  const customers = await prisma.customer.findMany({ orderBy: { id: "asc" } });
  const products = await prisma.product.findMany();

  for (let x = 0; x < custProdLength; x++) {
    for (const row of spreadSheet.rows) {
      accum[x] += row.sales[x]!.quantity;
    }
  }
  const allCustomersBillResult = []
  let i = 0;
  for (const customer of customers) {

    let grandTotal = 0;
    const invoiceLines = [];

    for (const product of products) {
      const newLine: InvoiceLine = {
        description: product.name,
        quantity: accum[i]!,
        unitPrice: product.unitPrice,
        total: accum[i]! * product.unitPrice,
      };
      invoiceLines.push(newLine);
      grandTotal += newLine.total;
      i++;
    }

    const lastbillCustomerResultForCustomer = await prisma.billCustomerResult.findFirst({ where: { firstName: customer.name } });
    const invoiceNumber = customer.invoicePrefix + (lastbillCustomerResultForCustomer?.id ?? 0) + 1;

    // generatePDF(document, "C:/halaha.pdf");
    const billResultForThisCustomer: BillCustomerResult = {
      firstName: customer.name,
      customerEmail: customer.email,
      invoiceLines: invoiceLines,
      invoiceNumber: invoiceNumber,
      grandTotal: grandTotal,
      billDate: new Date(),
      billFromDate: spreadSheet.rows[0]!.date,
      billToDate: spreadSheet.rows[spreadSheet.rows.length - 1]!.date,
      // filename: "C:/halaha.pdf",
    };
    // console.log(billResultForThisCustomer)
    allCustomersBillResult.push(billResultForThisCustomer);
  }

  return allCustomersBillResult;
};
