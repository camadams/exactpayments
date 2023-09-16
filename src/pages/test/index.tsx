/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from "react";
import SpreadSheetComponent, { type SpreadSheet } from "~/components/spreadsheet2";
import { bill, initialBillResult, initialSpreadSheet, products, sendEmail } from "..";
import Nav from "~/components/nav";
import { EmailTemplate, type EmailTemplateProps } from "~/components/email-template";
import generatePDF from "~/utils/generatePDF";

function Home() {
  const [hasBilled, setHasBilled] = useState(false);
  const [billResult, setBillResultt] = useState(initialBillResult);
  const [spreadSheet, setSpreadSheet] = useState<SpreadSheet>(initialSpreadSheet);

  const handleBillClicked = (spreadSheet: SpreadSheet) => {
    setBillResultt(() => bill(spreadSheet, products, billResult));
    setHasBilled(true);
  };

  // const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  // const openModal = () => {
  //   setModalIsOpen(true);
  // };

  // const closeModal = () => {
  //   setModalIsOpen(false);
  // };

  async function handelSendEmailClicked(billResult: EmailTemplateProps): Promise<void> {
    await sendEmail(billResult);
  }

  return (
    <div className="flex w-full">
      <Nav />

      <div className="w-full flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">HangTen September</h1>
        <SpreadSheetComponent spreadSheet={spreadSheet} setSpreadSheet={setSpreadSheet} />
        <div className="flex gap-4 my-4">
          {hasBilled ? (
            <>
              <button className="text-sm rounded-lg bg-green-400 hover:bg-green-700 hover:text-gray-100 w-20" onClick={() => generatePDF(document, "sample.pdf")}>
                Download Pdf
              </button>
              <button className="rounded-lg bg-green-400 hover:bg-green-700 hover:text-gray-100 w-20" onClick={() => handelSendEmailClicked(billResult)}>
                Send
              </button>
            </>
          ) : (
            <button className="rounded-lg bg-green-400 hover:bg-green-700 hover:text-gray-100 w-20" onClick={() => handleBillClicked(spreadSheet)}>
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
}

export default Home;

// <div>
// <SpreadSheet2 initialSpreadSheet={initialSpreadSheet} />
// {/* <BillForm /> */}
// </div>
