/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useState } from "react";
import SpreadSheetComponent from "~/components/spreadsheet2";
import { sendEmail, sendWhatsapp } from "~/utils/businessLogic";
import generatePDF from "~/utils/generatePDF";
import { InvoicesPreview } from "~/components/InvoicesPreview";

import { addDays, format, startOfWeek } from "date-fns";
import { type DateRange } from "react-day-picker";

import { CalendarDateRangePicker } from "~/components/date-range-picker";
import { api, type RouterOutputs } from "~/utils/api";
import { useSession } from "next-auth/react";

import { type BillCustomerResult } from "~/com/sheetspro/BillCustomerResult";

import { type SpreadSheet } from "~/server/api/routers/sale";
import Link from "next/link";
import { AuthShowcase } from "~/components/AuthShowcase";
import { useRouter } from "next/router";
import { addTimezoneOffset } from "~/lib/utils";
import { LoadingSpinner } from "~/components/loading";

function Home() {
  type a = RouterOutputs["sale"]["getAllSalesBetweenFromAndTo"];
  const [hasBilled, setHasBilled] = useState(false);
  const [billResult, setBillResultt] = useState<BillCustomerResult[] | undefined>(undefined);
  const [spreadSheet, setSpreadSheet] = useState<SpreadSheet | undefined>(undefined);
  const [isSelling, setIsSelling] = useState(true);
  const router = useRouter();
  const [date, setDate] = useState<DateRange | undefined>({
    from: addTimezoneOffset(startOfWeek(new Date(), { weekStartsOn: 1 })),
    to: addTimezoneOffset(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 6)),
  });

  const from = addTimezoneOffset(date?.from);
  const to = addTimezoneOffset(date?.to);
  // console.log("Added time zone start of weeeeeeeekekeke ", addTimezoneOffset(addDays(startOfWeek(new Date()), 1)));
  // console.log({ frontEndState: date });
  const { data: sesh } = useSession();
  const utils = api.useContext();

  const salesMutation = api.sale.createOrUpdate.useMutation({
    onMutate(newSale) {
      console.log({ newSale });

      /*
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.sale.getSpreadSheetFromAndToByUserId.cancel();

      // Get the data from the queryCache
      const prevData = utils.sale.getSpreadSheetFromAndToByUserId.getData();

      const emptyInputParamsToGetSpreadSheetFromAndToByUserId = { isSelling: true, from: new Date(), to: new Date(), userId: 1 };
      // Optimistically update the data with our new post
      // utils.sale.getSpreadSheetFromAndToByUserId.setData(emptyInputParamsToGetSpreadSheetFromAndToByUserId, spreadSheet);
      if (spreadSheet) {
        const updatedSpreadSheet = {
          ...spreadSheet,
          rows: spreadSheet.rows.map((row, i) => ({
            ...row,
            sales:
              i === newSale.rowIndex
                ? row.sales.map((sale, currentColIndex) => ({
                    ...sale,
                    quantity: currentColIndex === newSale.colIndex ? newSale.quantity : sale.quantity,
                  }))
                : [...row.sales],
          })),
        };
        setSpreadSheet(updatedSpreadSheet);
      }

      // Return the previous data so we can revert if something goes wrong
      return { prevData };
      */
    },
    onError(err, newPost, ctx) {
      // // If the mutation fails, use the context-value from onMutate
      // utils.sale.getSpreadSheetFromAndToByUserId.setData({ isSelling: true, from: new Date(), to: new Date(), userId: 1 }, ctx?.prevData);
      // alert("An error occuring while creating/updating a sale");
    },
    async onSettled() {
      // // Sync with server once mutation has settled
      // await utils.sale.getSpreadSheetFromAndToByUserId.invalidate();
    },
    onSuccess: () => console.log("successfull creation"),
  });

  const { data: spreadFromDb, isLoading } = api.sale.getSpreadSheetFromAndTo.useQuery(
    { from, to, isSelling },
    { refetchInterval: false, refetchOnWindowFocus: false },
  );

  // console.log(date);

  useEffect(() => {
    if (spreadFromDb && date) {
      setSpreadSheet(spreadFromDb);
    }
  }, [date, spreadFromDb]);

  const { data: freshBillResult, mutate: doBillMutation } = api.sale.bill2.useMutation();

  const handleBillClicked = async () => {
    if (from && to) {
      await router.push({
        pathname: "/bill",
        query: {
          from: format(from, "ddMMyy"),
          to: format(to, "ddMMyy"),
        },
      });
    } else {
      alert("an error occured, no from and to date");
    }
    // if (spreadSheet) {
    //   doBillMutation({ ...spreadSheet });
    //   setHasBilled(false);
    // }
  };

  if (freshBillResult && !hasBilled) {
    setHasBilled(true);
    setBillResultt(freshBillResult);
  }

  if (!sesh?.user.id) {
    return <AuthShowcase />;
  }

  return (
    <div className="flex w-full px-2">
      <div className="absolute top-0 bg-green-300 bg-opacity-50 rounded-lg w-15 ">{salesMutation.isLoading ? "Saving..." : "Auto Saved"}</div>
      <div className="flex flex-col items-center w-full">
        {/* {JSON.stringify(sesh.user, null, 4)} */}
        <div className="flex gap-2 mb-2">
          <CalendarDateRangePicker className={""} setDate={setDate} date={date} disabledYes={isLoading} />
          <Link href="/connections" className="flex items-center justify-center p-2 text-sm text-center bg-green-400 rounded-lg">
            Connections
          </Link>
          <Link href="/settings" className="flex items-center justify-center p-2 text-sm text-center bg-green-400 rounded-lg">
            Settings
          </Link>
          <Link href="/invoices" className="btn">
            Invoices
          </Link>
          <button onClick={() => setIsSelling((prev) => !prev)} className="p-2 text-sm bg-green-400 rounded-lg">
            {isSelling ? "I am selling" : "I am buying"}
          </button>
        </div>

        {!isLoading && spreadSheet && from && to ? (
          <SpreadSheetComponent {...{ spreadSheet, setSpreadSheet, from, to, salesMutation, isSelling }} />
        ) : (
          <div className="w-4/5 bg-blue-200/20 h-72">
            <span>Loading SpreadSheet</span>
            <LoadingSpinner />
          </div>
        )}
        <div className="flex gap-4 my-4">
          {billResult ? (
            <>
              <button className="px-6 py-2 text-sm bg-green-400 rounded-lg" onClick={() => generatePDF(document, "sample.pdf")}>
                Download
              </button>
              <button className="px-6 py-2 bg-green-400 rounded-lg" onClick={async () => await sendEmail(billResult)}>
                Send
              </button>
              <button className="px-6 py-2 bg-green-400 rounded-lg" onClick={() => alert("need to implement")}>
                Save Bill
              </button>
              <button onClick={async () => await sendWhatsapp(billResult)}>+</button>
            </>
          ) : (
            <>
              <button className="px-6 py-2 bg-green-400 rounded-lg" onClick={() => handleBillClicked()}>
                Bill
              </button>
            </>
          )}
        </div>
        <div className="">
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
