/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/prefer-for-of */
import { addDays } from "date-fns";
import React, { useState } from "react";
import { EmailTemplate, type EmailTemplateProps } from "~/components/email-template";
import Nav from "~/components/nav";
import type { Sale, SpreadSheet } from "~/components/spreadsheet2";
import { api } from "~/utils/api";
import generatePDF from "~/utils/generatePDF";

export const customers = [
  { name: "Hang Ten", emailAddress: "hangten@gmail.com" },
  { name: "Surf Shack", emailAddress: "surfshack@gmail.com" },
  { name: "Salt", emailAddress: "surfshack@gmail.com" },
  { name: "Ohana", emailAddress: "surfshack@gmail.com" },
  { name: "Blue Door", emailAddress: "surfshack@gmail.com" },
  { name: "Blue Door", emailAddress: "surfshack@gmail.com" },
  { name: "Blue Door", emailAddress: "surfshack@gmail.com" },
  { name: "Blue Door", emailAddress: "surfshack@gmail.com" },
];

export const products = [
  { name: "Almond Croisant", unitPrice: 18 },
  { name: "Cinnamon Stick", unitPrice: 12 },
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

export const bill = (spreadSheet: SpreadSheet, products: Product[], billResult: EmailTemplateProps): EmailTemplateProps => {
  const accum: number[] = [0, 0, 0];
  for (let x = 1; x < spreadSheet.rows[0]!.sales.length; x++) {
    for (let y = 0; y < spreadSheet.rows.length; y++) {
      accum[x] += spreadSheet.rows[y]!.sales[x]!.quantity;
    }
  }

  let i = 1;
  let grandTotal = 0;
  for (const product of products) {
    const quant = accum[i++]!;
    const newLine = {
      description: product.name,
      quantity: quant,
      unitPrice: product.unitPrice,
      total: quant * product.unitPrice,
    };
    billResult.invoiceLines.push(newLine);
    grandTotal += newLine.total;
  }
  billResult.grandTotal = grandTotal;
  return billResult;
};

export const initialBillResult = {
  firstName: "Hang Ten",
  customerEmail: "hangten@gmail.com",
  invoiceLines: [],
  grandTotal: 0,
} as EmailTemplateProps;

export async function sendEmail(billResult: EmailTemplateProps): Promise<void> {
  await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...billResult }),
  })
    .then((x) => console.log(x))
    .catch((err) => console.log(err));
}

const App = ({ data }: { data: SpreadSheet }) => {
  const [hasBilled, setHasBilled] = useState(false);
  const [billResult, setBillResultt] = useState(initialBillResult);
  api.example.getAll.useQuery();

  const calculateInvoiceLines = (grid: SpreadSheet) => {
    setBillResultt(() => bill(grid, products, billResult));
    setHasBilled(true);
  };

  return (
    <div className="flex w-full">
      <Nav />

      <div className="w-full flex flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">HangTen September</h1>
        {/* <SpreadSheetComponent initialSpreadSheet={data} /> */}
        <div className="flex gap-4 my-4">
          {hasBilled ? (
            <>
              <button className="text-sm rounded-lg bg-green-400 hover:bg-green-700 hover:text-gray-100 w-20" onClick={() => generatePDF(document, "sample.pdf")}>
                Download Pdf
              </button>
              <button className="rounded-lg bg-green-400 hover:bg-green-700 hover:text-gray-100 w-20" onClick={() => sendEmail(billResult)}>
                Send
              </button>
            </>
          ) : (
            <button className="rounded-lg bg-green-400 hover:bg-green-700 hover:text-gray-100 w-20" onClick={() => calculateInvoiceLines(data)}>
              Bill
            </button>
          )}
        </div>
        <div className="actual-receipt  w-[1000px]">
          {hasBilled && (
            <>
              <EmailTemplate {...billResult} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default App;

// eslint-disable-next-line @typescript-eslint/require-await
// export async function getServerSideProps() {
//   // const res = await fetch(`https://.../data`);
//   // const data: any = await res.json();

//   const initialSpreadSheet: SpreadSheet = {
//     rows: [
//       { date: new Date(), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
//       { date: addDays(new Date(), 1), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
//       { date: addDays(new Date(), 2), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
//       { date: addDays(new Date(), 3), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
//       { date: addDays(new Date(), 4), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
//       { date: addDays(new Date(), 5), sales: [...new Array<Sale>(customers.length * products.length).fill({ quantity: 0 })] },
//     ],
//   };

//   // api.example.getAll.useQuery();

//   return { props: { initialSpreadSheet } };
// }
