import { useRouter } from "next/router";
import { InvoicesPreview } from "~/components/InvoicesPreview";
import { LoadingSpinner } from "~/components/loading";
import { api } from "~/utils/api";

export default function Invoice() {
  const router = useRouter();
  const invoiceNumber = router.query.invoiceNumber as string;
  const { data, isLoading } = api.billCustomerResult.getInvoiceDetailsFromInvoiceNumber.useQuery({ invoiceNumber });
  if (!data) return <LoadingSpinner />;
  return (
    <div className="container py-4 mx-auto">
      {/* {data && <InvoicesPreview billResults={[data.billResult]} />} */}
      <h1 className="text-lg">{data?.billResult.invoiceNumber}</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Unit Price</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.invoiceLines.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{item.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">R{item.unitPrice}</td>
                <td className="px-6 py-4 whitespace-nowrap">R{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
