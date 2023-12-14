import { Img } from "@react-email/img";
import { Tailwind } from "@react-email/tailwind";
import { addDays, format } from "date-fns";
import * as React from "react";
import { type BillCustomerResult } from "~/com/sheetspro/BillCustomerResult";

// export const EmailTemplate: React.FC<EmailTemplateProps> = (props) => (
//   <div className="flex flex-col items-center justify-center">
//     <Invoice propss={props.firstName} />
//   </div>
// );

export const EmailTemplate = (billResult: BillCustomerResult) => {
  return (
    <Tailwind>
      <div className="bg-gray-100 p-4 h-[1410px] w-[1000px] ">
        {/* Logo in the top right-hand corner */}
        {/* <div style={{ position: "absolute", top: "2.5rem", right: "2.5rem" }}> */}
        {/* <div>
          <Img src="https://picsum.photos/400/400" alt="Company Logo" width="200" height="200" />
        </div> */}

        <div className="h-full bg-[#ffffff] rounded-lg p-14">
          {/* <div className="p-4"></div> */}
          <div className="flex ">
            <div className="w-full">
              <h1 className="mb-2 text-3xl font-semibold">Emz Bakery</h1>
              <h2 className="mb-1 text-lg font-normal">www.emzbakery.com</h2>
              <h2 className="text-lg font-normal"> +27 11 123-45-7</h2>
            </div>
            <div className="">
              <div className="mx-auto text-3xl font-semibold text-center">Invoice</div>
              <div className="p-2"></div>
              <div className="">
                <Img src="https://sheetspro.vercel.app/a.png" alt="Company Logo" width="300" height="300" />
              </div>
              {/* <Img src="https://picsum.photos/400/400" alt="Company Logo" width="200" height="200" /> */}
            </div>
          </div>

          <div className="p-4"></div>
          <div className="flex mb-4">
            <div className="w-full">
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
            <div className="w-[500px]">
              <div className="mb-2">
                <div className="gap-1 ">
                  <p className="flex mb-1">
                    <span className="mr-3 text-gray-600"> Invoice Number: </span> {billResult.invoiceNumber}
                  </p>
                  <p className="flex mb-1">
                    <span className="mr-3 text-gray-600">Invoice Created: </span> {format(billResult.billDate, "dd MMM yyyy")}
                  </p>
                  <p className="flex mb-1">
                    <span className="mr-3 text-gray-600">Due Date: </span> {format(addDays(billResult.billDate, 7), "dd MMM yyyy")}
                  </p>
                  <p className="flex mb-1">
                    <span className="mr-3 text-gray-600">Billing Period: </span> {format(billResult.billFromDate, "dd MMM yyyy")} -{" "}
                    {format(billResult.billToDate, "dd MMM yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6"></div>
          <div className="p-4 bg-gray-200 rounded-md">
            <div className="flex mb-2">
              <div className="w-1/2 font-semibold text-gray-800"> Description </div>
              <div className="w-1/6 font-semibold text-right text-gray-800">Quantity</div>
              <div className="w-1/6 font-semibold text-right text-gray-800"> Unit Price</div>
              <div className="w-1/6 font-semibold text-right text-gray-800"> Total</div>
            </div>
            {billResult.invoiceLines.map((invoiceLine, i) => (
              <div key={i} className="flex mb-2">
                <div className="w-1/2">{invoiceLine.description}</div>
                <div className="w-1/6 text-right">{invoiceLine.quantity}</div>
                <div className="w-1/6 text-right">R{invoiceLine.unitPrice}</div>
                <div className="w-1/6 text-right">R{invoiceLine.total}</div>
              </div>
            ))}
          </div>

          <div className="flex">
            <div className="w-1/3"></div>
            <div className="w-1/3 font-semibold text-right">Total</div>
            <div className="w-1/3 pr-3 text-xl font-bold text-right">R{billResult.grandTotal}</div>
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
