/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from "react";
import SpreadSheetComponent from "~/components/spreadsheet2";
import { type SpreadSheet, bill, initialBillResult, initialSpreadSheet, products, sendEmail } from "~/utils/businessLogic";
import Nav from "~/components/nav";
import { type BillResult, EmailTemplate } from "~/components/email-template";
import generatePDF from "~/utils/generatePDF";
import { InvoicesPreview } from "~/components/InvoicesPreview";

import { addDays } from "date-fns";
import { type DateRange } from "react-day-picker";

import { CalendarDateRangePicker } from "~/components/date-range-picker";

function Home() {
  const [hasBilled, setHasBilled] = useState(false);
  const [billResult, setBillResultt] = useState<BillResult[] | null>(initialBillResult);
  const [spreadSheet, setSpreadSheet] = useState<SpreadSheet>(initialSpreadSheet);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2023, 9, 19),
    to: addDays(new Date(2023, 9, 19), 3),
  });
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
    <div className="flex w-full pt-5">
      <Nav />
      <div className="flex flex-col items-center w-full">
        <CalendarDateRangePicker className={"mb-5"} setDate={setDate} date={date} />

        <SpreadSheetComponent spreadSheet={spreadSheet} setSpreadSheet={setSpreadSheet} date={date} />
        <div className="flex gap-4 my-4">
          {billResult ? (
            <>
              <button className="w-20 h-10 text-sm bg-green-400 rounded-lg hover:bg-green-700 hover:text-gray-100" onClick={() => generatePDF(document, "sample.pdf")}>
                Download
              </button>
              <button className="w-20 h-10 bg-green-400 rounded-lg hover:bg-green-700 hover:text-gray-100" onClick={() => handelSendEmailClicked(billResult)}>
                Send
              </button>
            </>
          ) : (
            <button className="w-20 h-10 bg-green-400 rounded-lg hover:bg-green-700 hover:text-gray-100" onClick={() => handleBillClicked(spreadSheet)}>
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
