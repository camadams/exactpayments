import { Img, Tailwind } from "@react-email/components";
import * as React from "react";

export interface InvoiceLine {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface EmailTemplateProps {
  firstName: string;
  customerEmail: string;
  invoiceLines: InvoiceLine[];
  grandTotal: number;
}

// export const EmailTemplate: React.FC<EmailTemplateProps> = (props) => (
//   <div className="flex flex-col justify-center items-center">
//     <Invoice propss={props.firstName} />
//   </div>
// );

export const EmailTemplatee = (billResult: EmailTemplateProps) => {
  return (
    <Tailwind>
      <div className="bg-gray-100 p-4 w-full mx-auto relative aspect-[1/1.41] ">
        {/* Logo in the top right-hand corner */}

        <div style={{ position: "absolute", top: "2.5rem", right: "2.5rem", margin: "1rem", width: "4rem", height: "4rem" }}>
          <Img src="/a.jpeg" alt="Company Logo" width="64" height="64" />
        </div>

        <div className="bg-white p-8 rounded-lg h-full">
          <h1 className="text-2xl font-semibold mb-4">Invoice</h1>
          <div className="flex justify-between mb-4">
            <div className="w-1/2">
              <div className="mb-2">
                <p className="text-gray-600">Invoice From:</p>
                <address className="">
                  Emz Vegan Baking
                  <br />
                  emzveganbaking@email.com
                  <br />
                  +27 83 456-7890
                </address>
              </div>
            </div>
            <div className="w-1/2">
              <div className="mb-2">
                <p className="text-gray-600">Invoice To:</p>
                <address>
                  {billResult.firstName}
                  <br />
                  {billResult.customerEmail}
                  <br />
                  +27 83 111-1111
                </address>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between">
              <div className="w-1/2">
                <p className="text-gray-600">Billing Period:</p>
                <p>From: 2023-08-01</p>
                <p>To: 2023-08-31</p>
              </div>
              <div className="w-1/2">
                <p className="text-gray-600">Invoice Date:</p>
                <p>2023-09-02</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-200 p-4 rounded-md">
            <div className="flex justify-between mb-2">
              <div className="w-1/2 text-gray-800 font-semibold"> Description </div>
              <div className="w-1/6 text-right text-gray-800 font-semibold">Quantity</div>
              <div className="w-1/6 text-right text-gray-800 font-semibold"> Unit Price</div>
              <div className="w-1/6 text-right text-gray-800 font-semibold"> Total</div>
            </div>
            {billResult.invoiceLines.map((invoiceLine, i) => (
              <div key={i} className="flex justify-between mb-2">
                <div className="w-1/2">{invoiceLine.description}</div>
                <div className="w-1/6 text-right">{invoiceLine.quantity}</div>
                <div className="w-1/6 text-right">R{invoiceLine.unitPrice}</div>
                <div className="w-1/6 text-right">R{invoiceLine.total}</div>
              </div>
            ))}
          </div>

          <div className="flex">
            <div className="w-1/3"></div>
            <div className="w-1/3 text-right font-semibold">Total</div>
            <div className="w-1/3 text-right text-xl font-bold pr-3">R{billResult.grandTotal}</div>
          </div>
          <div className="mt-4">
            <p className="text-gray-600">Payment Details:</p>
            <p>Bank Name: Standard Bank</p>
            <p>Account Number: 1234567890</p>
          </div>
        </div>
      </div>
    </Tailwind>
  );
};
