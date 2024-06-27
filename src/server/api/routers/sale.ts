/* eslint-disable @typescript-eslint/prefer-for-of */
import { Resend } from 'resend';
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
import { addDays, isSameDay, compareAsc, format, isWithinInterval } from 'date-fns';
import { type InvoiceLine } from '~/com/sheetspro/InvoiceLine';
import { billCustomerResultSchema, type BillCustomerResult } from '~/com/sheetspro/BillCustomerResult';
import { type CreateEmailOptions } from 'resend/build/src/emails/interfaces';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';

// import { InvoiceLine } from "~/utils/businessLogic";

const cellSchema = z.object({
  quantity: z.number().min(0),
  status: z.number(),
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





type User = z.infer<typeof userSchema>;

// user.


export type SpreadSheet = z.infer<typeof spreadsheetSchema>;
export type SheetRow = z.infer<typeof sheetRowSchema>;
export type CellType = z.infer<typeof cellSchema>;

export type Sale = RouterOutputs["sale"]["getAllSalesBetweenFromAndTo"][number];
type Product = z.infer<typeof productSchema>;
type Customer = z.infer<typeof customerSchema>;
type Business = z.infer<typeof businessSchema>;
type PrismaType = PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
type MyConnection = RouterOutputs["connection"]["getAll"][number];

export const saleRouter = createTRPCRouter({

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
      // console.log({ from, to })
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
    .input(z.object({ from: z.date().nullish(), to: z.date().nullish() }))
    .mutation(async ({ input, ctx }) => {
      const { from, to } = input
      const userId = ctx.session?.user.id
      if (from && to && userId) {
        const spreadsheet = await resolveSpreadSheet(from, to, userId, true, ctx.prisma);
        return await bill(spreadsheet, ctx.prisma);
      }
      // return new TRPCError({ message: "Please implement. I just", code: 'INTERNAL_SERVER_ERROR' });
    }),

  sendEmail: publicProcedure
    .input(z.array(billCustomerResultSchema))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user.id
      const resend = new Resend(process.env.RESEND_API_KEY);
      // console.log({ resend })
      const test = true;
      const email: CreateEmailOptions = {
        from: test ? 'Acme <onboarding@resend.dev>' : 'Emz <billing@mail.emzbakery.com>',
        to: test ? 'camgadams@gmail.com' : "dummy",
        subject: "test subject",
        text: "test text",
      }
      try {
        // throw new TRPCError({ message: "hi", code: "INTERNAL_SERVER_ERROR" });
        const data = await resend.emails.send(email);
        console.log({ data })

        return { data }

      } catch (error) {

        console.log({ error })
        if (error instanceof Error) {

          return error;
        } else if (error instanceof TRPCError) {
          const httpCode = getHTTPStatusCodeFromError(error);
          console.log({ httpCode })
          return error;
        }
        return error;

      }

    }),

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


  // const customers = await prisma.customer.findMany({ orderBy: { id: "asc" } });
  const connectionsWhereIAmSelling = await prisma.connection.findMany({ where: { sellingUserId: 1 } }) //todo
  const usersThatAreBuyingFromMe: User[] = await getUsersFromConnections(true, 1, prisma);
  const products = await prisma.product.findMany();
  const custXProdLength = spreadSheet.rows[0]!.sales.length;
  const accum: number[] = [...new Array<number>(custXProdLength).fill(0)];
  for (let x = 0; x < custXProdLength; x++) {
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

    const invoiceCountForCustomer = await prisma.billCustomerResult.count({ where: { firstName: customer.name } });
    const invoiceNumber = customer.invoicePrefix + (invoiceCountForCustomer + 1);
    const billFromDate = spreadSheet.rows[0]!.date;
    const billToDate = spreadSheet.rows[spreadSheet.rows.length - 1]!.date;
    // generatePDF(document, "C:/halaha.pdf");
    const billResultForThisCustomer: BillCustomerResult = {
      firstName: customer.name,
      customerEmail: customer.email,
      invoiceLines,
      invoiceNumber,
      grandTotal,
      billDate: new Date(),
      billFromDate,
      billToDate,
      textSummary: `Hi ${customer.name},\n
Please note from ${format(billFromDate, "eeee d MMM")} - ${format(billToDate, "eeee d MMM")} you received the following items:
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
  const billCustomerResults = await prisma.billCustomerResult.findMany({
    where: {
      AND: { billFromDate: { gte: from }, billToDate: { lte: to } }
    }
  })

  const users: User[] = await getUsersFromConnections(isSelling, userId, prisma);
  const products: Product[] = await prisma.product.findMany();

  const emptySheet: SheetRow[] = initEmptySheetRows(from, to, products, users);
  let rows: SheetRow[] = addSalesToEmptyRows(saless, products, emptySheet, isSelling);
  const header: Business[] = users.map(user => ({ user, products }));
  if (!!billCustomerResults) rows = addBilledStyleToRows(rows, header, billCustomerResults, products);
  return { header, rows }
}

async function getUsersFromConnections(isSelling: boolean, userId: number, prisma: PrismaType): Promise<User[]> {
  const connections: MyConnection[] = await prisma.connection.findMany({ where: isSelling ? { sellingUserId: userId } : { buyingUserId: userId } })
  const users: User[] = [];
  for (const connection of connections) {
    // const user = await prisma.user.findFirst({ where: { id: connection.buyingUserId } });
    const user = await prisma.user.findFirst({ where: isSelling ? { id: connection.buyingUserId } : { id: connection.sellingUserId } });
    if (user) {
      users.push({ id: user.id, name: user.name!, email: user.email!, invoicePrefix: user.name!.substring(0, 4), image: "hi", password: "123" });
    }
  }
  return users;
}

function initEmptySheetRows(startDate: Date, stopDate: Date, products: Product[], customers: User[]): SheetRow[] {
  const days: Date[] = getDatesBetween(startDate, stopDate);
  const rows: SheetRow[] = [];
  const custProdLength = customers.length * products.length;
  for (const date of days) {
    const sales = new Array<CellType>(custProdLength);
    for (let i = 0; i < custProdLength; i++) {
      sales[i] = { quantity: 0, status: 0 };
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
  for (const emptyRow of emptySheetRows) {
    for (const sale of sales) {
      if (isSameDay(sale.saleDate, emptyRow.date)) {
        const userId = isSelling ? sale.buyingUserId : sale.sellingUserId;
        const index = ((userId - 1 - 1) * products.length) + sale.productId - 1; // the extra -1 is cause the seller is part of users list
        emptyRow.sales[index]!.quantity = sale.quantity;
      }
    }
  }
  return emptySheetRows;
}

function addBilledStyleToRows(rows: SheetRow[], header: Business[], billCustomerResults: RouterOutputs["billCustomerResult"]["getAll"], products: Product[]): SheetRow[] {
  for (const billCustomerResult of billCustomerResults) {
    for (let i = 0; i < header.length; i++) {
      if (header[i]!.user.name === billCustomerResult.firstName) {
        // this means this customer/header[i] has some(all) rows that have been billed
        // check which row has been billed - if the row.data
        for (let j = 0; j < rows.length; j++) {
          const rowDate = rows[j]!.date;
          if (isWithinInterval(rowDate, { start: billCustomerResult.billFromDate, end: billCustomerResult.billToDate })) {
            for (let k = 0; k < products.length; k++) {
              const index = ((i * products.length) - 1) + k + 1;
              rows[j]!.sales[index]!.status = 1;
            }
          }
        }
      }
    }
  }
  return rows;
}