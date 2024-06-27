import { type BillCustomerResult } from "~/com/sheetspro/BillCustomerResult";
import { EmailTemplate } from "./email-template";
import { useState } from "react";

export const InvoicesPreview = ({ billResults, showEmailTemplatee }: { billResults: BillCustomerResult[]; showEmailTemplatee?: boolean }) => {
  const [index, setIndex] = useState<number>(0);
  const [showEmailTemplate, setShowEmailTemplate] = useState<boolean>(showEmailTemplatee ?? false);
  return (
    <main>
      <div className="flex flex-wrap items-center gap-2 mx-auto mb-2">
        {billResults.map((billResult, i) => (
          <div className={`btn ${billResult.grandTotal == 0 ? " bg-gray-400 hover:bg-gray-400" : ""}`} key={i} onClick={() => setIndex(i)}>
            {billResult.firstName}
          </div>
        ))}
      </div>
      <div className="actual-receipt ">
        {showEmailTemplate ? (
          <EmailTemplate {...billResults[index]!} />
        ) : (
          <div className="grid items-center grid-cols-1 p-3 font-mono divide-y divide-yellow-900 rounded-lg bg-slate-200">
            <div className="p-2">To: {billResults[index]!.customerEmail}</div>
            <div className="p-2">Subject: Emz Bakery Invoice {billResults[index]!.invoiceNumber}</div>
            <pre className="p-2">{billResults[index]!.textSummary}</pre>
          </div>
        )}
      </div>
    </main>
  );
};

{
  /* <button className="btn" onClick={() => setShowEmailTemplate(!showEmailTemplate)}>
          {showEmailTemplate ? "Show Text" : "Show Email"}
        </button>
        <button className="btn" onClick={() => setIndex((prev) => (prev == 0 ? billResults.length - 1 : prev - 1))}>
          👈
        </button>
        <div className="flex items-center justify-center w-20 h-10 bg-green-400 rounded-lg">
          {index + 1}/{billResults.length}
        </div>
        <button className="btn" onClick={() => setIndex((prev) => (prev == billResults.length - 1 ? 0 : prev + 1))}>
          👉
        </button> */
}
