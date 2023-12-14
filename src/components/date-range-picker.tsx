"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { type DateRange } from "react-day-picker";

import { cn } from "~/utils/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";

interface CalendarDateRangePickerProps {
  className?: string;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  date: DateRange | undefined;
  disabledYes: boolean;
}
export function CalendarDateRangePicker({ className, setDate, date, disabledYes }: CalendarDateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            // disabled={disabledYes}
            id="date"
            variant={"outline"}
            className={cn("w-[260px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            <div className="text-xs">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "eee d MMM yyy")} - {format(date.to, "eee d MMM yyy")}
                  </>
                ) : (
                  format(date.from, "eee d MMM yyy")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} weekStartsOn={1} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
