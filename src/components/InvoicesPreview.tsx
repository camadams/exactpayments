import { type BillResult, EmailTemplate } from "./email-template";
import { useState } from "react";

export const InvoicesPreview = ({ billResults }: { billResults: BillResult[] }) => {
  const [index, setIndex] = useState<number>(0);
  return (
    <main>
      <div className="flex mx-auto justify-center items-center gap-4 mb-2">
        <button className="rounded-lg bg-green-400 hover:bg-green-700 hover:text-gray-100 w-20 h-10" onClick={() => setIndex((prev) => (prev == 0 ? billResults.length - 1 : prev - 1))}>
          👈
        </button>
        <div className="rounded-lg bg-green-400 w-20 h-10 flex justify-center items-center">
          {index + 1}/{billResults.length}
        </div>
        <button className="rounded-lg bg-green-400 hover:bg-green-700 hover:text-gray-100 w-20 h-10" onClick={() => setIndex((prev) => (prev == billResults.length - 1 ? 0 : prev + 1))}>
          👉
        </button>
      </div>
      <div>
        <EmailTemplate {...billResults[index]!} />
      </div>
    </main>
  );
};
