import { addDays } from "date-fns";
import React, { useState } from "react";
import { type DateRange } from "react-day-picker";
import { type SpreadSheet, initialSpreadSheet } from "~/utils/businessLogic";
export default function Home() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2023, 10, 20),
    to: addDays(new Date(2023, 10, 20), 3),
  });

  const [spreadSheet, setSpreadSheet] = useState<SpreadSheet>(initialSpreadSheet);

  return (
    <div>
      {/* <SpreadSheetComponent spreadSheet={spreadSheet} setSpreadSheet={setSpreadSheet} date={date} /> */}
      <p>hii</p>
    </div>
  );
}
