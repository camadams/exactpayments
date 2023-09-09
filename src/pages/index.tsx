/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/prefer-for-of */
import React, { useState } from "react";
import Spreadsheet from "~/components/Spreadsheet";
import { EmailTemplate, type EmailTemplateProps } from "~/components/email-template";
import Nav from "~/components/nav";
import generatePDF from "~/utils/generatePDF";
import POST from "./api/sendd";

const App = ({ data }: { data: number[][] }) => {
  const [hasBilled, setHasBilled] = useState(false);
  const [billResult, setBillResultt] = useState({
    firstName: "Hang Ten",
    customerEmail: "hangten@gmail.com",
    invoiceLines: [],
    grandTotal: 0,
  } as EmailTemplateProps);

  const products = [
    { name: "Almond Croisant", unitPrice: 18 },
    { name: "Cinnamon Stick", unitPrice: 12 },
  ];

  const calculateInvoiceLines = (grid: number[][]) => {
    const accum: number[] = [0, 0, 0];
    for (let x = 1; x < grid[0]!.length; x++) {
      for (let y = 0; y < grid.length; y++) {
        accum[x] += grid[y]![x]!;
      }
    }
    console.log(accum);
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
    setBillResultt(() => billResult);
    // const line = `${accum[1]} X Almond Cros @ R${almPrice} = R${accum[1]! * almPrice} \n ${accum[2]} X Cinna Twist @ R${almPrice} = R${accum[2]! * cinnaPrice}`;
    setHasBilled(true);
  };

  async function handleClickTheirApiButNotMyRoute(): Promise<void> {
    // await sendEmail(billResult)
    //   .then((x) => alert(x))
    //   .catch((err) => alert(err));

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Acme <onboarding@resend.dev>",
        to: ["delivered@resend.dev"],
        subject: "handleClickk",
        html: JSON.stringify({ ...billResult }),
      }),
    })
      .then((x) => console.log(x))
      .catch((err) => console.log(err));
  }

  async function handleClickMe(): Promise<void> {
    await fetch("http://localhost:3000/api/send", {
      method: "POST", // You may need to adjust the HTTP method based on your server API
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...billResult }),
    })
      .then((x) => alert(x))
      .catch((err) => alert(err));
  }

  async function handleClickEdge(): Promise<void> {
    await POST(billResult)
      .then((x) => alert(x))
      .catch((err) => alert(err));
  }

  return (
    <div className="flex w-full">
      <Nav />

      <div className="w-full flex flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">HangTen September</h1>
        <Spreadsheet initialGrid={data} />
        <div className="flex gap-4 my-4">
          {hasBilled ? (
            <>
              <button className="text-sm rounded-lg bg-green-400 hover:bg-green-700 hover:text-gray-100 w-20" onClick={() => generatePDF(document, "sample.pdf")}>
                Download Pdf
              </button>
              <button className="rounded-lg bg-green-400 hover:bg-green-700 hover:text-gray-100 w-20" onClick={handleClickMe}>
                Send me
              </button>{" "}
              <button className="rounded-lg bg-green-400 hover:bg-green-700 hover:text-gray-100 w-20" onClick={handleClickEdge}>
                Send edge
              </button>{" "}
              <button className="rounded-lg bg-green-400 hover:bg-green-700 hover:text-gray-100 w-20" onClick={handleClickTheirApiButNotMyRoute}>
                SendTheirApiButNotInMyRoute
              </button>
            </>
          ) : (
            <button className="rounded-lg bg-green-400 hover:bg-green-700 hover:text-gray-100 w-20" onClick={() => calculateInvoiceLines(data)}>
              Bill
            </button>
          )}
        </div>
        <div className="actual-receipt aspect-[1/1.41] w-full">
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

// async function sendEmail(billResultt: string): Promise<void> {
//   // // Send a POST request with the JSON data in the request body

//   // const url = "/api/sendd";
//   // await POST(JSON.stringify({ ...billResultt }));
//   await fetch("http://localhost:3000/api/send", {
//     method: "POST", // You may need to adjust the HTTP method based on your server API
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(billResultt),
//   });

//   // await fetch("http://localhost:3000/api/send");
// }

// eslint-disable-next-line @typescript-eslint/require-await
export async function getServerSideProps() {
  // const res = await fetch(`https://.../data`);
  // const data: any = await res.json();
  const data: number[][] = [
    [1, 0, 0],
    [2, 0, 0],
    [3, 0, 0],
    [4, 0, 0],
    [5, 0, 0],
  ];

  return { props: { data } };
}
