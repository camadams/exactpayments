import Nav from "~/components/nav";

const customers = [
  { id: 1, name: "Salt", emailAddress: "salt@gmail.com" },
  { id: 2, name: "Hang Ten", emailAddress: "hangten@gmail.com" },
];
const Customers = () => {
  return (
    <div className="flex w-full h-screen">
      <Nav />
      <div className="w-2/3 p-6 mx-auto">
        <table className="border-collapse w-full text-left">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-bold p-2">Id</th>
              <th className="text-bold p-2">Name</th>
              <th className="text-bold p-2">Email Address</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, i) => (
              <tr key={i} className="border-b border-gray-600">
                <td className="p-2 ">{customer.id}</td>
                <td className="p-2">{customer.name}</td>
                <td className="p-2">{customer.emailAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
