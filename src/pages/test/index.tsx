/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useState } from "react";
import SpreadSheetComponent from "~/components/spreadsheet2";
import { type SpreadSheet, bill, initialBillResult, sendEmail, convertSalesToSpreadsheet } from "~/utils/businessLogic";
import Nav from "~/components/nav";
import { type BillResult } from "~/components/email-template";
import generatePDF from "~/utils/generatePDF";
import { InvoicesPreview } from "~/components/InvoicesPreview";

import { addDays, startOfDay } from "date-fns";
import { type DateRange } from "react-day-picker";

import { CalendarDateRangePicker } from "~/components/date-range-picker";
import { api, type RouterOutputs } from "~/utils/api";

function Home() {
  type a = RouterOutputs["sale"]["getAllSalesBetweenFromAndTo"];
  const [hasBilled, setHasBilled] = useState(false);
  const [billResult, setBillResultt] = useState<BillResult[] | null>(initialBillResult);
  const [spreadSheet, setSpreadSheet] = useState<SpreadSheet | null>(null);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startOfDay(new Date()), //8 is september
    to: addDays(startOfDay(new Date()), 4),
  });
  const handleBillClicked = (spreadSheet: SpreadSheet) => {
    setBillResultt(() => bill(spreadSheet));
    setHasBilled(true);
  };
  const { data, isLoading, refetch } = api.sale.getAllSalesBetweenFromAndTo.useQuery({ to: date!.to!, from: date!.from! });

  const salesMutation = api.sale.create.useMutation({ onSuccess: () => console.log("successfull creation") });
  useEffect(() => {
    if (data) {
      const convertedSpreadSheet = convertSalesToSpreadsheet(data, date!.from!, date!.to!, spreadSheet);

      setSpreadSheet(convertedSpreadSheet);
      // console.log("************* spreadsheeeettt after set in use effect", spreadSheet);
    }
  }, [data]);

  // useEffect(() => {
  //   console.log("in datE effect");

  //   async function fetchNewData() {
  //     await refetch();
  //   }

  //   fetchNewData()
  //     .then((a) => console.log("then >>> >>>", a))
  //     .catch((e) => console.log("then >>> >>>", e));
  // }, [date]);

  // useEffect(() => {

  // }, []);

  // let cnt = 0;
  // if (data && cnt === 0) {
  //   const convertedSpreadSheet = convertSalesToSpreadsheet(data, date!.from!, date!.to!);
  //   console.log("*************", convertedSpreadSheet.rows[convertedSpreadSheet.rows.length - 1]?.sales);
  //   setSpreadSheet(convertedSpreadSheet);
  //   cnt++;
  // }
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

  function saveSheet() {
    salesMutation.mutate({
      saleDate: new Date(2023, 8, 11),
      quantity: 88,
      productId: 2,
      customerId: 2,
    });
  }

  return (
    <div className="flex w-full pt-5">
      <div className="absolute top-0 bg-green-300 bg-opacity-50 rounded-lg w-15 ">{salesMutation.isLoading ? "Saving..." : "Auto Saved"}</div>
      {/* {isLoading ? <div>Loading</div> : data?.map((a) => <div key={a.id}>{a.quantity}</div>)} */}
      <Nav />
      <div className="flex flex-col items-center w-full">
        <CalendarDateRangePicker className={"mb-5"} setDate={setDate} date={date} />

        <SpreadSheetComponent spreadSheet={spreadSheet} setSpreadSheet={setSpreadSheet} date={date} salesMutation={salesMutation} />
        <div className="flex gap-4 my-4">
          {billResult ? (
            <>
              <button className="w-20 h-10 text-sm bg-green-400 rounded-lg hover:bg-green-700 hover:text-gray-100" onClick={() => generatePDF(document, "sample.pdf")}>
                Download
              </button>
              <button className="w-20 h-10 bg-green-400 rounded-lg hover:bg-green-700 hover:text-gray-100" onClick={() => handelSendEmailClicked(billResult)}>
                Send
              </button>
              <button className="w-20 h-10 bg-green-400 rounded-lg hover:bg-green-700 hover:text-gray-100" onClick={() => alert("need to implement")}>
                Save Bill
              </button>
            </>
          ) : (
            <button className="w-20 h-10 bg-green-400 rounded-lg hover:bg-green-700 hover:text-gray-100" onClick={() => handleBillClicked(spreadSheet!)}>
              Bill
            </button>
          )}
        </div>
        <div className="w-[1000px]">
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
