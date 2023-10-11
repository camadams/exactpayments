/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useState } from "react";
import SpreadSheetComponent from "~/components/spreadsheet2";
import { sendEmail, convertSalesToSpreadsheet, SheetRow } from "~/utils/businessLogic";
import generatePDF from "~/utils/generatePDF";
import { InvoicesPreview } from "~/components/InvoicesPreview";

import { addDays, addHours, startOfDay } from "date-fns";
import { type DateRange } from "react-day-picker";

import { CalendarDateRangePicker } from "~/components/date-range-picker";
import { api, type RouterOutputs, type RouterInputs } from "~/utils/api";
import { useSession } from "next-auth/react";

import { type SpreadSheet, type BillCustomerResult } from "~/server/api/routers/sale";
import Link from "next/link";
import { AuthShowcase } from "~/components/AuthShowcase";

function Home() {
  type a = RouterOutputs["sale"]["getAllSalesBetweenFromAndTo"];
  const [hasBilled, setHasBilled] = useState(false);
  const [billResult, setBillResultt] = useState<BillCustomerResult[] | undefined>(undefined);
  const [spreadSheet, setSpreadSheet] = useState<SpreadSheet | undefined>(undefined);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addHours(startOfDay(new Date()), 0), //8 is september
    to: addDays(startOfDay(new Date()), 7),
  });

  const [isSelling, setIsSelling] = useState(false);

  const { data: sesh } = useSession();

  const salesMutation = api.sale.create.useMutation({ onSuccess: () => console.log("successfull creation") });

  const { data: spreadSheetFromDB } = api.sale.getSpreadSheetFromAndToByUserId.useQuery(
    { from: date?.from, to: date?.to, userId: sesh?.user.id, isSelling: true },
    { refetchInterval: false, refetchOnWindowFocus: false },
  );

  useEffect(() => {
    if (spreadSheetFromDB && date) {
      setSpreadSheet(spreadSheetFromDB);
    }
  }, [date, spreadSheetFromDB]);

  const { data: freshBillResult, mutate: doBillMutation } = api.sale.bill2.useMutation();

  const handleBillClicked = () => {
    if (spreadSheet) {
      doBillMutation({ ...spreadSheet });
      setHasBilled(false);
    }
  };

  if (freshBillResult && !hasBilled) {
    setHasBilled(true);
    setBillResultt(freshBillResult);
  }

  function saveSheet() {
    salesMutation.mutate({
      saleDate: new Date(2023, 8, 11),
      quantity: 88,
      productId: 2,
      customerId: 2,
    });
  }
  if (!sesh?.user.id) {
    return <AuthShowcase />;
  }
  return (
    <div className="flex w-full px-2">
      <div className="absolute top-0 bg-green-300 bg-opacity-50 rounded-lg w-15 ">{salesMutation.isLoading ? "Saving..." : "Auto Saved"}</div>
      <div className="flex flex-col items-center w-full">
        <button onClick={() => setIsSelling((prev) => !prev)} className="w-20 h-10 text-xs bg-green-400 rounded-lg hover:bg-green-700 hover:text-gray-100">
          {isSelling ? "I am selling" : "I am buying"}
        </button>

        <div className="flex">
          <CalendarDateRangePicker className={""} setDate={setDate} date={date} />
          <Link href="/connections" className="absolute top-0 w-20 h-10 bg-yellow-300 rounded-lg right-20">
            Connections
          </Link>
          <Link href="/settings" className="absolute top-0 right-0 w-20 h-10 bg-yellow-300 rounded-lg">
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
              <button className="w-20 h-10 bg-green-400 rounded-lg hover:bg-green-700 hover:text-gray-100" onClick={() => handleBillClicked()}>
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
