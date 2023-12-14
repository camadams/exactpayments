/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import * as z from "zod";

import { DatePickerWithRange } from "~/components/tata";
// import { toast } from "~/components/ui/use-toast";

const FormSchema = z.object({
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

export default function DatePickerForm() {
  return <DatePickerWithRange />;
}
