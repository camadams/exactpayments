/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";

import { type RouterOutputs } from "~/utils/api";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: number;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
  vibe: string;
};

type qwer = RouterOutputs["billCustomerResult"]["getAll"][number];

export const columns: ColumnDef<qwer>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Invoice Number",
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      const columnFilterValue = column.getFilterValue();
      return (
        <>
          <h1>Customer</h1>
          <input
            type="text"
            value={(columnFilterValue ?? "") as string}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder={`Search...`}
            className="border rounded w-36"
          />
        </>
      );
    },
  },
  {
    accessorKey: "customerEmail",
    header: "Email",
  },
  {
    accessorKey: "billDate",
    header: "Billed Date",
    cell: ({ row }) => {
      const d: Date = row.getValue("billDate");
      return <div>{format(d, "eee, d MMM")}</div>;
    },
  },
  {
    accessorKey: "billFromDate",
    header: "From",
    cell: ({ row }) => {
      const d: Date = row.getValue("billFromDate");
      return <div>{format(d, "eee, d MMM")}</div>;
    },
  },
  {
    accessorKey: "billToDate",
    header: "To",
    cell: ({ row }) => {
      const d: Date = row.getValue("billToDate");
      return <div>{format(d, "eee, d MMM")}</div>;
    },
  },
  {
    accessorKey: "grandTotal",
    header: "Grand Total",
    cell: ({ row }) => {
      return <div>R{parseFloat(row.getValue("grandTotal"))}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "Open",
    cell: ({ row }) => {
      const invoiceNumber = row.original.invoiceNumber;
      console.log({ invoiceNumber });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      return (
        <Link className="shadow-md btn shadow-green-500" href={`/invoices/${invoiceNumber}`}>
          open
        </Link>
      );
    },
  },
];

// export const columns: ColumnDef<qwer>[] = [
//   {
//     accessorKey: "id",
//     header: "Id",
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//   },
//   {
//     accessorKey: "email",
//     header: ({ column }) => {
//       const columnFilterValue = column.getFilterValue();

//       return (
//         <>
//           {/* <Button variant="outline" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//             Email
//             <ArrowUpDown className="w-4 h-4 ml-2" />
//           </Button>
//           <br /> */}
//           <h1>Email</h1>
//           <input
//             type="text"
//             value={(columnFilterValue ?? "") as string}
//             onChange={(e) => column.setFilterValue(e.target.value)}
//             placeholder={`Search...`}
//             className="border rounded shadow w-36"
//           />
//         </>
//       );
//     },
//   },
//   {
//     accessorKey: "amount",
//     header: "Ammount",
//     cell: ({ row }) => {
//       const amount = parseFloat(row.getValue("amount"));
//       const formatted = new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "USD",
//       }).format(amount);

//       return <div className="font-medium ">{formatted}</div>;
//     },
//   },
//   {
//     accessorKey: "vibe",
//     header: "Vibe",
//   },
//   {
//     id: "actions",
//     header: "action",
//     cell: ({ row }) => {
//       const payment = row.original;

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="w-8 h-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal className="w-4 h-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             {/* <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(payment.id))}>Copy payment ID</DropdownMenuItem> */}
//             <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String("payment.id"))}>Copy payment ID</DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>View customer</DropdownMenuItem>
//             <DropdownMenuItem>View payment details</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       );
//     },
//   },
// ];
