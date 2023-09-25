/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useState } from "react";
import SpreadSheetComponent from "~/components/spreadsheet2";
import { type SpreadSheet, bill, initialBillResult, sendEmail, convertSalesToSpreadsheet } from "~/utils/businessLogic";
import Nav from "~/components/nav";
import { type BillResult } from "~/components/email-template";
import generatePDF from "~/utils/generatePDF";
import { InvoicesPreview } from "~/components/InvoicesPreview";

import { addDays, addHours, startOfDay } from "date-fns";
import { type DateRange } from "react-day-picker";

import { CalendarDateRangePicker } from "~/components/date-range-picker";
import { api, type RouterOutputs } from "~/utils/api";
import { useSession } from "next-auth/react";

function Home() {
  type a = RouterOutputs["sale"]["getAllSalesBetweenFromAndTo"];
  const [hasBilled, setHasBilled] = useState(false);
  const [billResult, setBillResultt] = useState<BillResult[] | null>(initialBillResult);
  const [spreadSheet, setSpreadSheet] = useState<SpreadSheet | null>(null);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addHours(startOfDay(new Date()), 0), //8 is september
    to: addDays(startOfDay(new Date()), 7),
  });
  const handleBillClicked = (spreadSheet: SpreadSheet) => {
    setBillResultt(() => bill(spreadSheet));
    setHasBilled(true);
  };

  const { data } = useSession();
  const { data: salesFromDB, isLoading, refetch } = api.sale.getAllSalesBetweenFromAndToByUserId.useQuery({ from: date?.from, to: date?.to }, { refetchInterval: false, refetchOnWindowFocus: false });
  // console.log("date ?", salesFromDB ? "true" : "false");
  const salesMutation = api.sale.create.useMutation({ onSuccess: () => console.log("successfull creation") });
  useEffect(() => {
    if (salesFromDB && date) {
      const convertedSpreadSheet = convertSalesToSpreadsheet(salesFromDB, date.from!, date.to!, spreadSheet);

      setSpreadSheet(convertedSpreadSheet);
      // console.log("************* spreadsheeeettt after set in use effect", spreadSheet);
    }
  }, [salesFromDB]);

  // let cnt = 0;
  // if (data && cnt === 0) {
  //   const convertedSpreadSheet = convertSalesToSpreadsheet(data, date!.from!, date!.to!);
  //   console.log("*************", convertedSpreadSheet.rows[convertedSpreadSheet.rows.length - 1]?.sales);
  //   setSpreadSheet(convertedSpreadSheet);
  //   cnt++;
  // }

  function saveSheet() {
    salesMutation.mutate({
      saleDate: new Date(2023, 8, 11),
      quantity: 88,
      productId: 2,
      customerId: 2,
    });
  }

  return (
    <div className="flex w-full p-2">
      {/* <div> Date: {date ? "true" : "false"}</div>
      <div> From: {date?.from ? "true" : "false"}</div>
      <div> to: {date?.to ? "true" : "false"}</div> */}
      <div className="absolute top-0 bg-green-300 bg-opacity-50 rounded-lg w-15 ">{salesMutation.isLoading ? "Saving..." : "Auto Saved"}</div>
      {/* {isLoading ? <div>Loading</div> : data?.map((a) => <div key={a.id}>{a.quantity}</div>)} */}
      {/* <Nav /> */}
      <div className="flex flex-col items-center w-full">
        <CalendarDateRangePicker className={""} setDate={setDate} date={date} />

        <SpreadSheetComponent spreadSheet={spreadSheet} setSpreadSheet={setSpreadSheet} date={date} salesMutation={salesMutation} />
        <div className="flex gap-4 my-4">
          {billResult ? (
            <>
              <button className="w-20 h-10 text-sm bg-green-400 rounded-lg hover:bg-green-700 hover:text-gray-100" onClick={() => generatePDF(document, "sample.pdf")}>
                Download
              </button>
              <button className="w-20 h-10 bg-green-400 rounded-lg hover:bg-green-700 hover:text-gray-100" onClick={async () => await sendEmail(billResult)}>
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
