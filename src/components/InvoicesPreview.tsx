import { type BillCustomerResult } from "~/server/api/routers/sale";
import { EmailTemplate } from "./email-template";
import { useState } from "react";

export const InvoicesPreview = ({ billResults }: { billResults: BillCustomerResult[] }) => {
  const [index, setIndex] = useState<number>(0);
  const [showEmailTemplate, setShowEmailTemplate] = useState<boolean>(false);
  return (
    <main>
      <div className="flex items-center justify-center gap-4 mx-auto mb-2">
        <button className="w-20 h-10 bg-green-400 rounded-lg hover:bg-green-700 hover:text-gray-100 text-sm" onClick={() => setShowEmailTemplate(!showEmailTemplate)}>
          {showEmailTemplate ? "Show Text" : "Show Email"}
        </button>
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
        {showEmailTemplate ? (
          <EmailTemplate {...billResults[index]!} />
        ) : (
          <div>
            <pre className="bg-slate-100 p-4 rounded-lg">{billResults[index]!.textSummary}</pre>
          </div>
        )}
      </div>
    </main>
  );
};
