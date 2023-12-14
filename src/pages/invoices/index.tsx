import { api } from "~/utils/api";
import { type Payment, columns } from "./columns";
import { DataTable } from "./data-table";
import { useRouter } from "next/router";

function getData(): Payment[] {
  // Fetch data from your API here.
  return [
    {
      id: 1,
      amount: 100,
      status: "pending",
      email: "m@example.com",
      vibe: "good",
    },
    {
      id: 2,
      amount: 75,
      status: "pending",
      email: "a@example.com",
      vibe: "excellent",
    },
    {
      id: 3,
      amount: 150,
      status: "pending",
      email: "b@example.com",
      vibe: "neutral",
    },
    {
      id: 4,
      amount: 200,
      status: "pending",
      email: "c@example.com",
      vibe: "great",
    },
    {
      id: 5,
      amount: 50,
      status: "pending",
      email: "d@example.com",
      vibe: "satisfactory",
    },
    {
      id: 6,
      amount: 120,
      status: "pending",
      email: "e@example.com",
      vibe: "awesome",
    },
    {
      id: 7,
      amount: 90,
      status: "pending",
      email: "f@example.com",
      vibe: "fantastic",
    },
    {
      id: 8,
      amount: 180,
      status: "pending",
      email: "g@example.com",
      vibe: "superb",
    },
    {
      id: 9,
      amount: 60,
      status: "pending",
      email: "h@example.com",
      vibe: "average",
    },
    {
      id: 10,
      amount: 135,
      status: "pending",
      email: "i@example.com",
      vibe: "wonderful",
    },
    {
      id: 11,
      amount: 85,
      status: "pending",
      email: "j@example.com",
      vibe: "splendid",
    },
    {
      id: 12,
      amount: 110,
      status: "pending",
      email: "k@example.com",
      vibe: "amazing",
    },
    {
      id: 13,
      amount: 70,
      status: "pending",
      email: "l@example.com",
      vibe: "terrific",
    },
    {
      id: 14,
      amount: 95,
      status: "pending",
      email: "n@example.com",
      vibe: "fabulous",
    },
    {
      id: 15,
      amount: 165,
      status: "pending",
      email: "o@example.com",
      vibe: "remarkable",
    },
  ];
}

export default function DemoPage() {
  //   const data = getData();
  const router = useRouter();

  const { data } = api.billCustomerResult.getAll.useQuery();

  return (
    <div className="container py-4 mx-auto">
      <button className="hover:underline" onClick={() => router.back()}>
        &lt; Back
      </button>
      <div className="p-4" />
      {!!data && <DataTable columns={columns} data={data} />}
    </div>
  );
}
