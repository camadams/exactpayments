import { useRouter } from "next/router";
import { useState } from "react";
import { addTimezoneOffset } from "~/lib/utils";
import { type BillCustomerResult } from "~/server/api/routers/sale";
import { api } from "~/utils/api";

export default function BillPage() {
  function parseDateFromString(dateString: string): Date {
    const year = parseInt((dateString || "").slice(4, 6), 10) + 2000; // Add 2000 to get the full year
    const month = parseInt((dateString || "").slice(2, 4), 10) - 1; // Month is zero-based
    const day = parseInt((dateString || "").slice(0, 2), 10);

    return new Date(year, month, day);
  }

  const router = useRouter();
  const [hasBilled, setHasBilled] = useState(false);
  const [billResult, setBillResultt] = useState<BillCustomerResult[] | undefined>(undefined);

  const fromQ = router.query.from as string;
  const toQ = router.query.to as string;

  const from = addTimezoneOffset(parseDateFromString(fromQ));
  const to = addTimezoneOffset(parseDateFromString(toQ));

  const { data: freshBillResult, mutate: doBillMutation } = api.sale.billDateInput.useMutation();

  const handleBillClicked = () => {
    if (from && to) {
      doBillMutation({ from, to, userId: 1 });
      setHasBilled(false);
    }
  };

  if (freshBillResult && !hasBilled) {
    setHasBilled(true);
    // setBillResultt(freshBillResult);
  }

  return (
    <div>
      <div>{billResult?.[0]?.grandTotal}</div>
      <button onClick={() => handleBillClicked()}>Bill</button>
    </div>
  );
}
