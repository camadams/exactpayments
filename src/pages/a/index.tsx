import { RouterOutputs, api } from "~/utils/api";
import format from "date-fns/format";
import { GetServerSideProps } from "next";
import { useEffect } from "react";
type Example = RouterOutputs["example"]["getAll"][number];

// const SalesTest = ({ b }: { b: Example[] }) => {
const SalesTest = () => {
  const todayDate = new Date();

  // useEffect(() => {
  //   const b = api.example.getAllBeforeDate.useQuery({ date: todayDate });
  //   console.log(b);
  // }, []);
  // const today = format(todayDate, "dd-mm-yyyy");
  // const b = api.example.getAllBeforeDate.useQuery({ date: todayDate });
  const b = api.example.getAll.useQuery();
  console.log("example datatatatt:", b.data);
  console.log("example . data is undefined ?:", b.data === undefined);
  console.log("example . data first element ?:", b.data?.[0]);
  // const b = api.example.getByUsername.useQuery({ username: "alice" });
  // const b = api.example.getAll.useQuery();
  return (
    <div className="flex w-full h-screen">
      {/* <div>{a.data?.greeting}</div> */}
      {/* {b.data?.map((x, i) => <div key={i}>{format(x.username, "dd-mm-yyyy")}</div>)} */}
      {b.data?.map((x, i) => <div key={i}>{x.username} **** </div>)}
      <div> {b.data === undefined ? "yes" : "no"}</div>
      {/* <div>{today}</div> */}
      {/* <div>{b.data?}</div> */}
    </div>
  );
};

// export function getServerSideProps() {
//   a.data?.map((x) => console.log(x.createdAt));
//   return { props: { test: a.data } };
// }

export default SalesTest;

// eslint-disable-next-line @typescript-eslint/require-await
// export async function getServerSideProps() {
//   // const res = await fetch(`https://.../data`);
//   // const data: any = await res.json();

//   const { data } = api.example.getAll.useQuery();

//   return { props: { data } };
// }
