import { z } from "zod";
import { type InvoiceLine, invoiceLineSchema } from "./InvoiceLine";

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

export const billCustomerResultSchema = z.object({
    firstName: z.string(),
    customerEmail: z.string(),
    invoiceLines: z.array(invoiceLineSchema),
    invoiceNumber: z.string(),
    grandTotal: z.number(),
    filename: z.string().optional(),
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

export type xBillCustomerResult = z.infer<typeof billCustomerResultSchema>;
export type xBillCustomerResultNoLines = z.infer<typeof billCustomerResultNoLinesSchema>;

