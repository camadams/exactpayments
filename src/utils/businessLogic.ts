/* eslint-disable @typescript-eslint/prefer-for-of */
import { addDays } from "date-fns";
import React, { useState } from "react";
import { EmailTemplate, type BillResult as BillResult, InvoiceLine } from "~/components/email-template";
import Nav from "~/components/nav";
import type { Sale, SpreadSheet } from "~/components/spreadsheet2";
import { api } from "~/utils/api";
import generatePDF from "~/utils/generatePDF";



export const customers = [
    { name: "Customer 1", emailAddress: "customer1@gmail.com" },
    { name: "Customer 2", emailAddress: "customer2@gmail.com" },
    { name: "Customer 3", emailAddress: "customer3@gmail.com" },
    { name: "Customer 4", emailAddress: "customer4@gmail.com" },
    { name: "Customer 5", emailAddress: "customer5@gmail.com" },
    { name: "Customer 6", emailAddress: "customer6@gmail.com" },
    { name: "Customer 7", emailAddress: "customer7@gmail.com" },
    { name: "Customer 8", emailAddress: "customer8@gmail.com" },
];

export const products = [
    { name: "Product 1", unitPrice: 18 },
    { name: "Product 2", unitPrice: 12 },
];

export const initialSpreadSheet: SpreadSheet = {
    rows: [
        { date: new Date(), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: addDays(new Date(), 1), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: addDays(new Date(), 2), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: addDays(new Date(), 3), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: addDays(new Date(), 4), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: addDays(new Date(), 5), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: addDays(new Date(), 5), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: addDays(new Date(), 5), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: addDays(new Date(), 5), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: addDays(new Date(), 5), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: addDays(new Date(), 5), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: addDays(new Date(), 5), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: addDays(new Date(), 5), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: addDays(new Date(), 5), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: addDays(new Date(), 5), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: addDays(new Date(), 5), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: addDays(new Date(), 5), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: addDays(new Date(), 5), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: addDays(new Date(), 5), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
    ],
};

type Product = {
    name: string;
    unitPrice: number;
};

export const bill = (spreadSheet: SpreadSheet): BillResult[] => {

    const custProdLength = spreadSheet.rows[0]!.sales.length;
    const accum: number[] = [...new Array<number>(custProdLength).fill(0)];

    for (let x = 0; x < custProdLength; x++) {
        for (let y = 0; y < spreadSheet.rows.length; y++) {
            accum[x] += spreadSheet.rows[y]!.sales[x]!.quantity;
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

        const billResultForThisCustomer: BillResult = {
            firstName: customer.name,
            customerEmail: customer.emailAddress,
            invoiceLines: invoiceLines,
            grandTotal: grandTotal,
        };
        allCustomersBillResult.push(billResultForThisCustomer);
    }

    return allCustomersBillResult;
};

export const initialBillResult = null;

export async function sendEmail(billResult: BillResult[]): Promise<void> {
    await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/send`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...billResult[0] }),
    })
        .then((x) => alert("Email sent!"))
        .catch((err) => console.log(err));
}
