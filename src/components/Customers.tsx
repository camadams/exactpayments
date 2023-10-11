import { type FormEvent } from "react";
import { api } from "~/utils/api";

export default function CustomersPage() {
  const { data: products, isLoading } = api.customer.getAll.useQuery();
  const createMutation = api.customer.createCustomer.useMutation();

  if (isLoading) return <div>Loading...</div>;

  function handleCreateCustomerClicked(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const invoicePrefix = formData.get("invoicePrefix") as string;
    createMutation.mutate({ name, email, invoicePrefix });
  }
  return (
    <div className="w-1/2 p-4 mx-auto rounded-lg bg-slate-200">
      <h1>Customers</h1>

      <div className="">
        <table className="w-full rounded-lg bg-slate-300">
          <thead className="">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Invoice Prefix</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {products?.map((product, i) => (
              <tr key={product.id}>
                <td className={`p-2 ${i % 2 == 0 ? "bg-purple-100" : "bg-white"}`}>{product.name}</td>
                <td className={`p-2 ${i % 2 == 0 ? "bg-purple-100" : "bg-white"}`}>{product.email}</td>
                <td className={`p-2 ${i % 2 == 0 ? "bg-purple-100" : "bg-white"}`}>{product.invoicePrefix}</td>
                <td className={`p-2 ${i % 2 == 0 ? "bg-purple-100" : "bg-white"}`}>
                  <button
                    onClick={() => {
                      // Implement update functionality here
                    }}
                  >
                    Edit
                  </button>
                  <button
                  //   onClick={() => {
                  //     deleteMutation.mutate(product.id);
                  //   }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <form className="flex gap-4" onSubmit={(e) => handleCreateCustomerClicked(e)}>
          <input className="w-1/4" type="text" name="name" placeholder="Customer Name" />
          <input className="w-1/4" type="email" name="email" placeholder="Email" />
          <input className="w-1/4" type="text" name="invoicePrefix" placeholder="Invoice Prefix" />
          <button className="w-1/4" type="submit">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
