import { z } from "zod";
import { type InvoiceLine, invoiceLineSchema } from "./InvoiceLine";
import { prisma } from '~/server/db';

export interface BillCustomerResult {
    firstName: string;
    customerEmail: string;
    invoiceLines: InvoiceLine[];
    invoiceNumber: string;
    grandTotal: number;
    filename?: string | null;
    billFromDate: Date;
    billToDate: Date;
    billDate: Date;
    textSummary: string;
}

export const billCustomerResultSchema = z.object({
    firstName: z.string(),
    customerEmail: z.string(),
    invoiceLines: z.array(invoiceLineSchema),
    invoiceNumber: z.string(),
    grandTotal: z.number(),
    filename: z.string().nullish(),
    billFromDate: z.date(), // Using z.date() for Date fields
    billToDate: z.date(),
    billDate: z.date(),
    textSummary: z.string(),
});

export const billCustomerResultNoLinesSchema = z.object({
    firstName: z.string(),
    customerEmail: z.string(),
    invoiceNumber: z.string(),
    grandTotal: z.number(),
    filename: z.string().optional(),
    billFromDate: z.date(), // Using z.date() for Date fields
    billToDate: z.date(),
    billDate: z.date(),
    textSummary: z.string(),
});

export type xBillCustomerResultNoLines = z.infer<typeof billCustomerResultNoLinesSchema>;
export type TBillCustomerResult = z.infer<typeof billCustomerResultSchema>;

export async function getInvoiceLines(billCustomerResultId: number): Promise<InvoiceLine[]> {
    const lines = await prisma.invoiceLine.findMany({ where: { billCustomerResultId } });
    return lines;
}