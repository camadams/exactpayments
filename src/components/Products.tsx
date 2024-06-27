import { revalidatePath, revalidateTag } from "next/cache";
import { useState, type FormEvent } from "react";
import { api } from "~/utils/api";

export default function ProductsPage() {
  const [editProductId, setEditProductId] = useState<number>();
  const { data: products, isLoading } = api.product.getAll.useQuery();
  const productMutation = api.product.createProduct.useMutation();
  const updateProductMutation = api.product.updateProduct.useMutation();

  function handleCreateClicked(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const unitPrice = parseFloat(formData.get("unitPrice") as string);
    productMutation.mutate({ name, unitPrice });
    revalidateTag("settings");
  }

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="w-2/3 p-4 mx-auto rounded-lg bg-slate-200">
      <h1>Products {editProductId}</h1>

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
                <td className={`p-2 ${i % 2 == 0 ? "bg-gray-100" : "bg-white"}`}>
                  {product.name}
                  {/* <input type="text" placeholder={product.name} /> */}
                </td>
                <td className={`p-2 ${i % 2 == 0 ? "bg-gray-100" : "bg-white"}`}>R{product.unitPrice}</td>
                <td className={`p-2 ${i % 2 == 0 ? "bg-gray-100" : "bg-white"}`}>
                  <button
                    onClick={() => {
                      setEditProductId(() => product.id);
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
          className="flex "
          onSubmit={(e) => {
            handleCreateClicked(e);
          }}
        >
          <input className="w-1/3 " type="text" name="name" placeholder="Product Name" />
          <input className="w-1/3" type="number" name="unitPrice" placeholder="Unit Price" />
          <button className="w-1/3" type="submit">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
