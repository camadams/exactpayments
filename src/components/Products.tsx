import { type FormEvent } from "react";
import { api } from "~/utils/api";

export default function ProductsPage() {
  const { data: products, isLoading } = api.product.getAll.useQuery();
  const productMutation = api.product.createProduct.useMutation();

  function handleCreateClicked(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const unitPrice = parseFloat(formData.get("unitPrice") as string);
    productMutation.mutate({ name, unitPrice });
  }

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="w-1/2 p-4 mx-auto rounded-lg bg-slate-200">
      <h1>Products</h1>

      <div className="">
        <table className="w-full rounded-lg bg-slate-300">
          <thead className="">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Unit Price</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {products?.map((product, i) => (
              <tr key={product.id}>
                <td className={`p-2 ${i % 2 == 0 ? "bg-purple-100" : "bg-white"}`}>{product.name}</td>
                <td className={`p-2 ${i % 2 == 0 ? "bg-purple-100" : "bg-white"}`}>R{product.unitPrice}</td>
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
        <form
          className="flex gap-4"
          onSubmit={(e) => {
            handleCreateClicked(e);
          }}
        >
          <input className="w-1/3" type="text" name="name" placeholder="Product Name" />
          <input className="w-1/3" type="number" name="unitPrice" placeholder="Unit Price" />
          <button className="w-1/3" type="submit">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
