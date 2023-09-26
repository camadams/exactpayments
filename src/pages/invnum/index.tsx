import { api } from "~/utils/api";

const App = () => {
  const { data } = api.billCustomerResultRouter.getLatestInvoiceNumber.useQuery();
  console.log(data);
  return <div> {data}</div>;
};

export default App;
