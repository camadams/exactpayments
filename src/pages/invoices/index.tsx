import { api } from "~/utils/api";
import { type Payment, columns } from "../../com/sheetspro/invoicesColumns";
import { DataTable } from "../../components/data-table";
import { useRouter } from "next/router";

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
