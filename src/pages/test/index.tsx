/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useState } from "react";
import SpreadSheetComponent from "~/components/spreadsheet2";
import { sendEmail, convertSalesToSpreadsheet, SheetRow } from "~/utils/businessLogic";
import Nav from "~/components/nav";
import generatePDF from "~/utils/generatePDF";
import { InvoicesPreview } from "~/components/InvoicesPreview";

import { addDays, addHours, startOfDay } from "date-fns";
import { type DateRange } from "react-day-picker";

import { CalendarDateRangePicker } from "~/components/date-range-picker";
import { api, type RouterOutputs, type RouterInputs } from "~/utils/api";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { type SpreadSheet, type BillCustomerResult } from "~/server/api/routers/sale";
import Link from "next/link";

function Home() {
  type a = RouterOutputs["sale"]["getAllSalesBetweenFromAndTo"];
  const [hasBilled, setHasBilled] = useState(false);
  const [billResult, setBillResultt] = useState<BillCustomerResult[] | undefined>(undefined);
  const [spreadSheet, setSpreadSheet] = useState<SpreadSheet | undefined>(undefined);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addHours(startOfDay(new Date()), 0), //8 is september
    to: addDays(startOfDay(new Date()), 7),
  });

  const { data } = useSession();
  const { data: salesFromDB, refetch } = api.sale.getSpreadSheetFromAndToByUserId.useQuery({ from: date?.from, to: date?.to }, { refetchInterval: false, refetchOnWindowFocus: false });
  const salesMutation = api.sale.create.useMutation({ onSuccess: () => console.log("successfull creation") });
  useEffect(() => {
    if (salesFromDB && date) {
      console.log(salesFromDB);
      setSpreadSheet(salesFromDB);
    }
  }, [salesFromDB]);

  const billMutation = api.sale.bill2.useMutation();

  const handleButtonClicked = () => {
    if (spreadSheet) {
      billMutation.mutate({ ...spreadSheet });
      setHasBilled(false);
    }
  };

  if (billMutation.data && !hasBilled) {
    setHasBilled(true);
    setBillResultt(billMutation.data);
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
    <div className="flex w-full px-2">
      <div className="absolute top-0 bg-green-300 bg-opacity-50 rounded-lg w-15 ">{salesMutation.isLoading ? "Saving..." : "Auto Saved"}</div>
      <div className="flex flex-col items-center w-full">
        <div className="flex">
          <CalendarDateRangePicker className={""} setDate={setDate} date={date} />
          <Link href="/settings" className="absolute top-0 right-0 bg-yellow-300 w-20 h-10 rounded-lg">
            Settings
          </Link>
        </div>

        {spreadSheet ? <SpreadSheetComponent spreadSheet={spreadSheet} setSpreadSheet={setSpreadSheet} date={date} salesMutation={salesMutation} /> : <div>Loading spreadsheet</div>}
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
            <>
              <button className="w-20 h-10 bg-green-400 rounded-lg hover:bg-green-700 hover:text-gray-100" onClick={() => handleButtonClicked()}>
                Bill
              </button>
            </>
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
