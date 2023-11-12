// import { InvoiceLine } from '~/components/email-template';
import { type Prisma, type PrismaClient } from '@prisma/client';

import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import type { DefaultArgs } from '@prisma/client/runtime/library';
import { type RouterOutputs } from '~/utils/api';
import { addDays, addHours, isSameDay, compareAsc, format } from 'date-fns';
import type { Session } from 'next-auth';
import { TRPCError } from '@trpc/server';
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

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  image: z.string(),
  invoicePrefix: z.string(),
  password: z.string()
});

const businessSchema = z.object({
  user: userSchema,
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

type User = z.infer<typeof userSchema>;
// user.


export type SpreadSheet = z.infer<typeof spreadsheetSchema>;
export type SheetRow = z.infer<typeof sheetRowSchema>;
type InvoiceLine = z.infer<typeof invoiceLineSchema>;
export type CellType = z.infer<typeof cellSchema>;

export type Sale = RouterOutputs["sale"]["getAllSalesBetweenFromAndTo"][number];
type Product = z.infer<typeof productSchema>;
type Customer = z.infer<typeof customerSchema>;
type Business = z.infer<typeof businessSchema>;
type PrismaType = PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
type MyConnection = RouterOutputs["connection"]["getAll"][number];

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

  // getAllSalesBetweenFromAndToByUserId: publicProcedure
  //   .input(z.object({ from: z.date().nullish(), to: z.date().nullish(), userId: z.number().optional() }))
  //   .query(({ ctx, input }) => {
  //     // input.to = input.to ?? input.from;
  //     // if(from === undefined) { 
  //     const saless = ctx.prisma.sale.findMany({
  //       where: {
  //         saleDate: { gte: input.from ?? undefined, lte: input.to ?? undefined },
  //         userId: input.userId
  //       }
  //     })
  //     return saless;
  //   }),

  getSpreadSheetFromAndTo: protectedProcedure
    .input(z.object({ from: z.date().nullish(), to: z.date().nullish(), isSelling: z.boolean() }))
    .query(async ({ ctx, input }) => {
      // input.to = input.to ?? input.from;
      // if(from === undefined) { 
      let { from, to, isSelling } = input
      const userId = ctx.session.user.id;
      if (from && to && userId) {
        return resolveSpreadSheet(from, to, userId, isSelling, ctx.prisma);
      }
      return null;
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
      return await bill(input, ctx.prisma);
    }),

  billDateInput: publicProcedure
    .input(z.object({ from: z.date().nullish(), to: z.date().nullish(), userId: z.number().nullish() }))
    .mutation(async ({ input, ctx }) => {
      const { from, to, userId } = input
      if (from && to && userId) {
        return resolveSpreadSheet(from, to, userId, true, ctx.prisma);
      }      // return await bill(spreadSheet, ctx.prisma);
      return new TRPCError({ message: "Please implement. I just", code: 'INTERNAL_SERVER_ERROR' });
    }),


  // getAll: publicProcedure.query(({ ctx }) => {
  //   const a = ctx.prisma.example.findMany();
  //   return a;
  // }),

  // getForMonth: publicProcedure.query(({ ctx }) => {
  //   const a = ctx.prisma.sale.findMany();
  //   return a;
  // }),

  // getForMontsfredafdsh: publicProcedure.query(({ ctx }) => {
  //   const a = ctx.prisma.product.findMany();
  //   return a;
  // }),

  createOrUpdate: protectedProcedure
    .input(z.object({ saleDate: z.date(), quantity: z.number(), productId: z.number().min(1), buyingUserId: z.number(), rowIndex: z.number(), colIndex: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { saleDate, quantity, productId, buyingUserId } = input;
      const sellingUserId = ctx.session.user.id;
      const existingSale = await ctx.prisma.sale.findFirst({ where: { AND: [{ saleDate, quantity, productId, buyingUserId }] } });
      if (!existingSale) {
        return ctx.prisma.sale.create({ data: { saleDate, quantity, productId, buyingUserId, sellingUserId } });
      } else {
        return ctx.prisma.sale.update({ where: { id: existingSale.id }, data: { quantity } })
      }

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


const bill = async (spreadSheet: SpreadSheet | null, prisma: PrismaType): Promise<BillCustomerResult[]> => {

  // if (!spreadSheet.rows[0])
  //   return [];
  if (!spreadSheet) return [];
  const custProdLength = spreadSheet.rows[0]!.sales.length;
  const accum: number[] = [...new Array<number>(custProdLength).fill(0)];

  // const customers = await prisma.customer.findMany({ orderBy: { id: "asc" } });
  const connectionsWhereIAmSelling = await prisma.connection.findMany({ where: { sellingUserId: 1 } }) //todo
  const usersThatAreBuyingFromMe = await getUsersFromConnections(true, 1, prisma);

  const products = await prisma.product.findMany();
  for (let x = 0; x < custProdLength; x++) {
    for (const row of spreadSheet.rows) {
      accum[x] += row.sales[x]!.quantity;
    }
  }
  const allCustomersBillResult: BillCustomerResult[] = []
  let i = 0;
  for (const customer of usersThatAreBuyingFromMe) {

    let grandTotal = 0;
    const invoiceLines: InvoiceLine[] = [];

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
    // if (grandTotal === 0) {
    //   continue;
    // }

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
Emily`,
      // filename: "C:/halaha.pdf",
    };
    // console.log(billResultForThisCustomer)
    allCustomersBillResult.push(billResultForThisCustomer);
  }

  return allCustomersBillResult;
};

async function resolveSpreadSheet(from: Date, to: Date, userId: number, isSelling: boolean, prisma: PrismaType): Promise<SpreadSheet | null> {
  const saless = await prisma.sale.findMany({
    where: {
      saleDate: { gte: from, lte: to },
      [isSelling ? 'sellingUserId' : 'buyingUserId']: userId
    }
  })
  // console.log({ saless, userId, haha: "haha" })
  // let customers = await prisma.customer.findMany({ orderBy: { id: "asc" } });
  const connections = await getUsersFromConnections(isSelling, userId, prisma);
  const products: Product[] = await prisma.product.findMany();

  const rows: SheetRow[] = addSalesToEmptyRows(saless, products, initEmptySheetRows(from, to, products, connections), isSelling);
  const header: Business[] = connections.map(user => ({ user, products }));
  return { header, rows }
}

async function getUsersFromConnections(isSelling: boolean, userId: number, prisma: PrismaType): Promise<User[]> {
  const connections: MyConnection[] = await prisma.connection.findMany({ where: isSelling ? { sellingUserId: userId } : { buyingUserId: userId } })

  const userss = [];
  for (const connection of connections) {
    // const user = await prisma.user.findFirst({ where: { id: connection.buyingUserId } });
    const user = await prisma.user.findFirst({ where: isSelling ? { id: connection.buyingUserId } : { id: connection.sellingUserId } });
    if (user) {
      userss.push({ id: user.id, name: user.name!, email: user.email!, invoicePrefix: "hi", image: "hi", password: "123" });
    }
  }
  return userss;
}

function initEmptySheetRows(startDate: Date, stopDate: Date, products: Product[], customers: User[]): SheetRow[] {
  const days: Date[] = getDatesBetween(startDate, stopDate);
  const rows: SheetRow[] = [];
  const custProdLength = customers.length * products.length;
  for (const date of days) {
    const sales = new Array<CellType>(custProdLength);
    for (let i = 0; i < custProdLength; i++) {
      sales[i] = { quantity: 0 };
    }
    rows.push({ date, sales });
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

function addSalesToEmptyRows(sales: Sale[], products: Product[], emptySheetRows: SheetRow[], isSelling: boolean) {
  // console.log(JSON.stringify(emptySheetRows, null, 1))
  for (const emptyRow of emptySheetRows) {
    for (const sale of sales) {
      if (isSameDay(sale.saleDate, emptyRow.date)) {
        const productId = sale.productId;
        const userId = isSelling ? sale.buyingUserId : sale.sellingUserId;
        const index = ((userId - 2) * products.length) + productId - 1;
        if (emptyRow.sales[index] === undefined) {
          console.log({ productId, userId, index, ok: emptyRow.sales })
        }
        emptyRow.sales[index]!.quantity = sale.quantity;
        // }
      }
    }
  }
  return emptySheetRows;
}
