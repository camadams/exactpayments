import { type BillCustomerResult } from "~/utils/businessLogic";
import { EmailTemplate } from "./email-template";
import { useState } from "react";

export const InvoicesPreview = ({ billResults }: { billResults: BillCustomerResult[] }) => {
  const [index, setIndex] = useState<number>(0);
  return (
    <main>
      <div className="flex items-center justify-center gap-4 mx-auto mb-2">
        <button className="w-20 h-10 bg-green-400 rounded-lg hover:bg-green-700 hover:text-gray-100" onClick={() => setIndex((prev) => (prev == 0 ? billResults.length - 1 : prev - 1))}>
          👈
        </button>
        <div className="flex items-center justify-center w-20 h-10 bg-green-400 rounded-lg">
          {index + 1}/{billResults.length}
        </div>
        <button className="w-20 h-10 bg-green-400 rounded-lg hover:bg-green-700 hover:text-gray-100" onClick={() => setIndex((prev) => (prev == billResults.length - 1 ? 0 : prev + 1))}>
          👉
        </button>
      </div>
      <div className="actual-receipt">
        <EmailTemplate {...billResults[index]!} />
      </div>
    </main>
  );
};
