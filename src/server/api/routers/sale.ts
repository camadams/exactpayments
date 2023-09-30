import { products } from '~/utils/businessLogic';
// import { InvoiceLine } from '~/components/email-template';
import { type Prisma, type PrismaClient } from '@prisma/client';

import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { type DefaultArgs } from '@prisma/client/runtime/library';
import { RouterOutputs } from '~/utils/api';
import { addDays, addHours, isSameDay, compareAsc, format } from 'date-fns';
// import { InvoiceLine } from "~/utils/businessLogic";

const cellSchema = z.object({
  quantity: z.number().min(0),
});

// Define a schema for the SheetRow type
const sheetRowSchema = z.object({
  date: z.date(),
  sales: z.array(cellSchema),
});

export const productSchema = z.object({
  name: z.string(),
  unitPrice: z.number().min(0),
});

export const customerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  invoicePrefix: z.string(),
});


const businessSchema = z.object({
  customer: customerSchema,
  products: z.array(productSchema),
});

// Define a schema for the SpreadSheet type
export const spreadsheetSchema = z.object({
  header: z.array(businessSchema),
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
  textSummary: string;
}


export type SpreadSheet = z.infer<typeof spreadsheetSchema>;
type SheetRow = z.infer<typeof sheetRowSchema>;
type InvoiceLine = z.infer<typeof invoiceLineSchema>;
type Cell = z.infer<typeof cellSchema>;

type Sale = RouterOutputs["sale"]["getAllSalesBetweenFromAndTo"][number];
type Product = z.infer<typeof productSchema>;
type Customer = z.infer<typeof customerSchema>;
type Business = z.infer<typeof businessSchema>;


const aaa = z.custom<Cell>();
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
      const saless = ctx.prisma.sale.findMany({
        where: {
          saleDate: { gte: input.from ?? undefined, lte: input.to ?? undefined },
          userId: input.userId
        }
      })
      return saless;
    }),

  getSpreadSheetFromAndToByUserId: publicProcedure
    .input(z.object({ from: z.date().nullish(), to: z.date().nullish(), userId: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      // input.to = input.to ?? input.from;
      // if(from === undefined) { 
      const { from, to, userId } = input
      const saless = await ctx.prisma.sale.findMany({
        where: {
          saleDate: { gte: from ?? undefined, lte: to ?? undefined },
          userId: userId
        }
      })
      let convertedSpreadSheet = null;
      if (saless && from && to) {
        convertedSpreadSheet = await convertSalesToSpreadsheet(saless, from, to, null, ctx.prisma);
      }

      return convertedSpreadSheet;
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

    if (grandTotal === 0) {
      continue;
    }

    const lastbillCustomerResultForCustomer = await prisma.billCustomerResult.findFirst({ where: { firstName: customer.name } });
    const invoiceNumber = customer.invoicePrefix + (lastbillCustomerResultForCustomer?.id ?? 0) + 1;
    const firstName = customer.name;
    const customerEmail = customer.email;
    const billFromDate = spreadSheet.rows[0]!.date;
    const billToDate = spreadSheet.rows[spreadSheet.rows.length - 1]!.date;

    // generatePDF(document, "C:/halaha.pdf");
    const billResultForThisCustomer: BillCustomerResult = {
      firstName,
      customerEmail,
      invoiceLines,
      invoiceNumber,
      grandTotal,
      billDate: new Date(),
      billFromDate,
      billToDate,
      textSummary: `Hi ${firstName}\n
Please note from ${format(billFromDate, "MMM d")} - ${format(billToDate, "MMM d")} you received the following items:
${invoiceLines.filter((line) => line.quantity > 0).map((line) => {
        return `\t${line.quantity} x ${line.description} @ R${line.unitPrice} = R${line.total}`;
      }).join("\n")}
Total: R${grandTotal}\n
Please pay as soon as possible.\n
Kind regards,\n
Emz x`,
      // filename: "C:/halaha.pdf",
    };
    // console.log(billResultForThisCustomer)
    allCustomersBillResult.push(billResultForThisCustomer);
  }

  return allCustomersBillResult;
};


// /*
// TEST THISSSSS
// */

async function convertSalesToSpreadsheet(sales: Sale[], from: Date, to: Date, liveSpreadSheet: SpreadSheet | null, prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>): Promise<SpreadSheet> {
  const products = await prisma.product.findMany();
  const customers = await prisma.customer.findMany({ orderBy: { id: "asc" } });

  const emptySheetRows: SheetRow[] = null ?? initEmptySheetRows(from, to, products, customers);
  const rows: SheetRow[] = addSalesToEmptyRows(sales, emptySheetRows);
  const header: Business[] = initBusinesss(customers, products);

  return { header, rows }
}

function initEmptySheetRows(startDate: Date, stopDate: Date, products: Product[], customers: Customer[]): SheetRow[] {
  const days: Date[] = getDatesBetween(startDate, stopDate);
  const rows: SheetRow[] = [];
  for (const day of days) {
    const sales = new Array<Cell>(customers.length * products.length);
    for (let i = 0; i < customers.length * products.length; i++) {
      sales[i] = { quantity: 0 };
    }
    const row: SheetRow = {
      date: day,
      sales: sales,
    }
    rows.push(row);
  }
  return rows;
}


function getDatesBetween(startDate: Date, stopDate: Date): Date[] {
  let cnt = 0
  let dateArray: Date[] = [];
  let currentDate = startDate;
  while (!(compareAsc(currentDate, stopDate) > 0)) { // while not current after stop
    dateArray.push(currentDate)
    currentDate = addDays(currentDate, 1);
    if (++cnt > 1000)
      return [new Date(2023, 2, 2)];
  }
  return dateArray;
}

function addSalesToEmptyRows(sales: Sale[], emptySheetRows: SheetRow[]) {
  for (const emptyRow of emptySheetRows) {
    for (const sale of sales) {
      if (isSameDay(addHours(sale.saleDate, 0), emptyRow.date)) {
        const productId = sale.productId;
        const customerId = sale.customerId;
        const index = ((customerId - 1) * products.length) - 1 + productId;
        emptyRow.sales[index]!.quantity = sale.quantity;
      }
    }
  }
  return emptySheetRows;
}


function initBusinesss(customers: Customer[], products: Product[]): Business[] {
  const header: Business[] = [];
  for (const customer of customers) {
    // const productsForThisCustomer = products.filter(product => product.customerId === customer.id);
    const business: Business = {
      customer: customer,
      products: products,
    };
    header.push(business);
  }
  return header;
}

