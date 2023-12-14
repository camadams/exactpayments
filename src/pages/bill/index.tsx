/* eslint-disable @typescript-eslint/no-misused-promises */
import { format } from "date-fns";
import { useRouter } from "next/router";
import { useState } from "react";
import { type xBillCustomerResult } from "~/com/sheetspro/BillCustomerResult";
import { InvoicesPreview } from "~/components/InvoicesPreview";
import { LoadingSpinner } from "~/components/loading";
import { addTimezoneOffset } from "~/lib/utils";
import { api } from "~/utils/api";
import { sendEmail } from "~/utils/businessLogic";

export default function BillPage() {
  const router = useRouter();
  const [hasReceivedBill, setHasReceivedBill] = useState(false);
  const [hasStartedBill, setHasStartedBill] = useState(false);
  const [billResults, setBillResults] = useState<xBillCustomerResult[] | undefined>(undefined);

  const fromQ = router.query.from as string;
  const toQ = router.query.to as string;

  // console.log({ fromQ, toQ });

  const from = addTimezoneOffset(parseDateFromString(fromQ));
  const to = addTimezoneOffset(parseDateFromString(toQ));

  const { data: freshBillResults, mutate: doBill } = api.sale.billDateInput.useMutation();

  if (!hasStartedBill && from && to && !isNaN(from.getTime()) && !isNaN(to.getTime())) {
    doBill({ from, to });
    setHasStartedBill(true);
  }

  if (!hasReceivedBill && freshBillResults) {
    setBillResults(freshBillResults);
    setHasReceivedBill(true);
  }

  return (
    <div className="p-8">
      <button className="hover:underline" onClick={() => router.back()}>
        &lt; Back
      </button>
      <div className="p-6" />
      {from && to && !isNaN(from.getTime()) && !isNaN(to.getTime()) && (
        <h1 className="mb-4 text-2xl">
          Billing Period: {format(from, "eeee d MMM")} - {format(to, "eeee d MMM")}
        </h1>
      )}
      <div>{!hasReceivedBill && <LoadingSpinner />}</div>

      <div className="">
        {billResults && (
          <>
            <InvoicesPreview billResults={billResults} />
            <button className="btn" onClick={() => handleSendEmail(billResults)}>
              send {billResults.filter((br) => br.grandTotal != 0).length} emails
            </button>
          </>
        )}
      </div>
    </div>
  );
}

async function handleSendEmail(billResult: xBillCustomerResult[]) {
  const confirmed = window.confirm("You are about to send 3 emails, each to a different customer. Are you sure?");
  if (confirmed) {
    await sendEmail(billResult);
  } else {
  }
}

function parseDateFromString(dateString: string): Date {
  const year = parseInt((dateString || "").slice(4, 6), 10) + 2000; // Add 2000 to get the full year
  const month = parseInt((dateString || "").slice(2, 4), 10) - 1; // Month is zero-based
  const day = parseInt((dateString || "").slice(0, 2), 10);

  return new Date(year, month, day);
}
