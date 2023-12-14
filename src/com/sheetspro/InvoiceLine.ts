import { z } from "zod";

export const invoiceLineSchema = z.object({
    description: z.string(),
    quantity: z.number().min(0),
    unitPrice: z.number().min(0),
    total: z.number().min(0),
});

export type InvoiceLine = z.infer<typeof invoiceLineSchema>;
