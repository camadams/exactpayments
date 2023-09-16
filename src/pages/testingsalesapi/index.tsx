import { api } from "~/utils/api";

const SalesTest = ({ test }: { test: string }) => {
  const a = api.example.getAll.useQuery();

  return (
    <div className="flex w-full h-screen">
      <div>{test}</div>
      <div>{a.data?.map((x, i) => <div key={i}>{9}</div>)}</div>
    </div>
  );
};

// export function getServerSideProps() {
//   a.data?.map((x) => console.log(x.createdAt));
//   return { props: { test: a.data } };
// }

export default SalesTest;
