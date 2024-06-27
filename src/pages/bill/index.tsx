import { format } from "date-fns";
import { useRouter } from "next/router";
import { useState } from "react";
import { TBillCustomerResult, type BillCustomerResult } from "~/com/sheetspro/BillCustomerResult";
import { InvoicesPreview } from "~/components/InvoicesPreview";
import { LoadingSpinner } from "~/components/loading";
import { addTimezoneOffset } from "~/lib/utils";
import { api } from "~/utils/api";
import { sendEmail } from "~/utils/businessLogic";

export default function BillPage() {
  const router = useRouter();
  const [hasReceivedBill, setHasReceivedBill] = useState(false);
  const [hasStartedBill, setHasStartedBill] = useState(false);
  const [billResults, setBillResults] = useState<TBillCustomerResult[] | undefined>(undefined);

  const fromQ = router.query.from as string;
  const toQ = router.query.to as string;

  // console.log({ fromQ, toQ });

  const from = addTimezoneOffset(parseDateFromString(fromQ));
  const to = addTimezoneOffset(parseDateFromString(toQ));

  // console.log({ from, to });

  const { data: freshBillResults, mutate: doBill } = api.sale.billDateInput.useMutation();
  const yaya = api.sale.sendEmail.useMutation();

  if (!hasStartedBill && from && to && !isNaN(from.getTime()) && !isNaN(to.getTime())) {
    doBill({ from, to });
    setHasStartedBill(true);
  }

  if (!hasReceivedBill && freshBillResults) {
    console.log({ freshBillResults });
    setBillResults(freshBillResults);
    setHasReceivedBill(true);
  }

  function handleSendEmail(billResults: TBillCustomerResult[]) {
    const confirmed = window.confirm(
      `You are about to send ${billResults.filter((br) => br.grandTotal != 0).length} email(s), each to a different customer. Are you sure?`,
    );
    if (confirmed) {
      const asdf = yaya.mutate(billResults);
      // sendEmail(billResults)
      //   .then((x) => console.log(x))
      //   .catch((x) => alert(x));
    }
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
              <div className="inline-block">{yaya.isLoading && <LoadingSpinner />}</div>
            </button>
            {/* <div>id: {xx?.data.id}</div> */}
            {yaya.data}
            <pre>{JSON.stringify(yaya, null, 4)}</pre>x
          </>
        )}
      </div>
    </div>
  );
}

function parseDateFromString(dateString: string): Date {
  const year = parseInt((dateString || "").slice(4, 6), 10) + 2000; // Add 2000 to get the full year
  const month = parseInt((dateString || "").slice(2, 4), 10) - 1; // Month is zero-based
  const day = parseInt((dateString || "").slice(0, 2), 10);

  return new Date(year, month, day);
}
