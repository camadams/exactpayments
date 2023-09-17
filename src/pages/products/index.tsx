import Nav from "~/components/nav";
import { products } from "~/utils/businessLogic";

const Products = () => {
  return (
    <div className="flex w-full h-screen">
      <Nav />
      <div className="w-2/3 p-6 mx-auto">
        <table className="border-collapse w-full text-left">
          <thead>
            <tr className="border-b border-gray-600">
              {/* <th className="text-bold p-2">Id</th> */}
              <th className="text-bold p-2">Name</th>
              <th className="text-bold p-2">Unit Price</th>
              <th className="p-2"></th> {/* You can add your Icon here */}
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr key={i} className="border-b border-gray-600">
                {/* <td className="p-2 ">{product.id}</td> */}
                <td className="p-2">{product.name}</td>
                <td className="p-2">R{product.unitPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
