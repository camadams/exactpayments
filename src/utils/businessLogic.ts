import { addHours, compareAsc, isSameDay } from 'date-fns';
import { addDays } from 'date-fns';
import { api, type RouterOutputs } from './api';
/* eslint-disable @typescript-eslint/prefer-for-of */
import generatePDF from './generatePDF';
import { type BillCustomerResult } from '~/server/api/routers/sale';

export const customers = [
    { name: "Customer 1", emailAddress: "customer1@gmail.com" },
    { name: "Customer 2", emailAddress: "customer2@gmail.com" },
    { name: "Customer 3", emailAddress: "customer3@gmail.com" },
    // { name: "Customer 4", emailAddress: "customer4@gmail.com" },
    // { name: "Customer 5", emailAddress: "customer5@gmail.com" },
    // { name: "Customer 6", emailAddress: "customer6@gmail.com" },
    // { name: "Customer 7", emailAddress: "customer7@gmail.com" },
    // { name: "Customer 8", emailAddress: "customer8@gmail.com" },
    // { name: "Customer 9", emailAddress: "customer9@gmail.com" },
    // { name: "Customer 10", emailAddress: "customer10@gmail.com" },
];

export const products = [
    { name: "Alm Cros", unitPrice: 18 },
    { name: "Cin Twist", unitPrice: 16 },
    { name: "Choc Cros", unitPrice: 17 },
];


export interface InvoiceLine {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

// export interface BillCustomerResult {
//     firstName: string;
//     customerEmail: string;
//     invoiceLines: InvoiceLine[];
//     invoiceNumber: string;
//     grandTotal: number;
//     filename?: string;
//     billFromDate: Date;
//     billToDate: Date;
//     billDate: Date;
// }


export interface Sale {
    quantity: number;
}

export interface SheetRow {
    date: Date;
    sales: Sale[];
}

export interface SpreadSheet {
    rows: SheetRow[];
}

export const initialSpreadSheet: SpreadSheet = {
    rows: [
        { date: new Date(2023, 9, 1), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 2), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 3), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 4), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 5), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 6), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 7), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 8), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 9), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 10), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 11), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 12), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 13), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 14), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 15), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 16), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 17), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 18), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 18), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 19), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 20), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 21), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 22), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 23), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 24), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 25), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 26), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 27), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 28), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 29), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
        { date: new Date(2023, 9, 30), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
    ],
};

type Product = {
    name: string;
    unitPrice: number;
};



export async function sendEmail(billResult: BillCustomerResult[]): Promise<void> {
    await fetch(`${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://sheetspro.vercel.app"}/api/send`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(billResult),
    })
        .then((x) => alert("Email sent! Result: " + x.status + " " + x.statusText))
        .catch((err) => console.log(err));
}

type Saley = RouterOutputs["sale"]["getAllSalesBetweenFromAndTo"][number];


export function convertSalesToSpreadsheet(sales: Saley[], from: Date, to: Date, liveSpreadSheet: SpreadSheet | undefined): SpreadSheet {
    const returnSpreadSheet = null ?? initBlankSpreadSheet(from, to);
    for (const row of returnSpreadSheet.rows) {
        for (const sale of sales) {
            if (isSameDay(addHours(sale.saleDate, 0), row.date)) {
                const productId = sale.productId;
                const customerId = sale.customerId;
                const index = ((customerId - 1) * products.length) - 1 + productId;
                row.sales[index]!.quantity = sale.quantity;
            }
        }
    }

    return returnSpreadSheet;
}

function initBlankSpreadSheet(startDate: Date, stopDate: Date): SpreadSheet {
    const days: Date[] = getDatesBetween(startDate, stopDate);
    const rows: SheetRow[] = [];
    for (const day of days) {
        const sales = new Array<Sale>(customers.length * products.length);

        for (let i = 0; i < customers.length * products.length; i++) {
            sales[i] = { quantity: 0 };
        }
        const row: SheetRow = {
            date: day,
            sales: sales,
        }
        rows.push(row);
    }
    return { rows: rows };
}


export function getDatesBetween(startDate: Date, stopDate: Date): Date[] {
    let cnt = 0
    let dateArray = [];
    let currentDate = startDate;
    while (!(compareAsc(currentDate, stopDate) > 0)) { // while not current after stop
        dateArray.push(currentDate)
        currentDate = addDays(currentDate, 1);
        if (++cnt > 1000)
            return [new Date(2023, 2, 2)];
    }
    return dateArray;
}


export function getCustomerAndProductFromIndex(index: number) {
    const productId = index % products.length + 1;
    const customerId = Math.floor(index / products.length) + 1;
    return [customerId, productId];
}

export function getMyDate(datedate: number) {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

// consolew.log(getDates(new Date(2023, 8, 1), new Date(2023, 8, 30)))