/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from "react";
import SpreadSheetComponent, { type SpreadSheet } from "~/components/spreadsheet2";
import { bill, initialBillResult, initialSpreadSheet, products, sendEmail } from "~/utils/businessLogic";
import Nav from "~/components/nav";
import { type BillResult, EmailTemplate } from "~/components/email-template";
import generatePDF from "~/utils/generatePDF";
import { InvoicesPreview } from "~/components/InvoicesPreview";

function Home() {
  const [hasBilled, setHasBilled] = useState(false);
  const [billResult, setBillResultt] = useState<BillResult[] | null>(initialBillResult);
  const [spreadSheet, setSpreadSheet] = useState<SpreadSheet>(initialSpreadSheet);

  const handleBillClicked = (spreadSheet: SpreadSheet) => {
    setBillResultt(() => bill(spreadSheet));
    setHasBilled(true);
  };

  // const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  // const openModal = () => {
  //   setModalIsOpen(true);
  // };

  // const closeModal = () => {
  //   setModalIsOpen(false);
  // };

  async function handelSendEmailClicked(billResult: BillResult[]): Promise<void> {
    await sendEmail(billResult);
  }

  return (
    <div className="flex w-full">
      <Nav />

      <div className="w-full flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">HangTen September</h1>
        <SpreadSheetComponent spreadSheet={spreadSheet} setSpreadSheet={setSpreadSheet} />
        <div className="flex gap-4 my-4">
          {billResult ? (
            <>
              <button className="text-sm rounded-lg bg-green-400 hover:bg-green-700 hover:text-gray-100 w-20 h-10" onClick={() => generatePDF(document, "sample.pdf")}>
                Download
              </button>
              <button className="rounded-lg bg-green-400 hover:bg-green-700 hover:text-gray-100 w-20 h-10" onClick={() => handelSendEmailClicked(billResult)}>
                Send
              </button>
            </>
          ) : (
            <button className="rounded-lg bg-green-400 hover:bg-green-700 hover:text-gray-100 w-20 h-10" onClick={() => handleBillClicked(spreadSheet)}>
              Bill
            </button>
          )}
        </div>
        <div className="actual-receipt  w-[1000px]">
          {billResult && (
            <>
              <InvoicesPreview billResults={billResult} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;

// <div>
// <SpreadSheet2 initialSpreadSheet={initialSpreadSheet} />
// {/* <BillForm /> */}
// </div>
