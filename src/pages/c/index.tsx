// Import React and any other necessary dependencies

import { useEffect, useState } from "react";
import { CalendarDateRangePicker } from "~/components/date-range-picker";
import { api, type RouterOutputs } from "~/utils/api";

type Example = RouterOutputs["example"]["getAll"];

interface Resp {
  respp: string; // Adjust the type to match your JSON structure
  stuff: number[];
}

function YourComponent(propps: Resp) {
  const [dataState, setDataState] = useState<Resp>();
  const { data, isLoading } = api.example.getAllBeforeDate.useQuery({ date: new Date(2023, 8, 17, 14, 30) });

  useEffect(() => {
    // const response = fetch("/api/test")
    //   .then((response) => response.json())
    //   .then((responseData: Resp) => {
    //     setDataState(responseData);
    //     console.log(responseData);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching data:", error);
    //   });
    // Replace with your API endpoint path
    // const doodoo = (await response.json()) as YourComponentProps; // Use .json() to parse JSON response
  }, []);
  return (
    <>
      <div>{isLoading ? <div>Loading</div> : <div>{data?.[0]?.id}</div>}</div>
      <div>
        <CalendarDateRangePicker />
      </div>
    </>
  );
}

// export async function getServerSideProps() {
//   const response = await fetch("http:/localhost:3000/api/test"); // Replace with your API endpoint path
//   const resppppp = (await response.json()) as YourComponentProps; // Use .json() to parse JSON response
//   // resppp.data.message = "Hello World";
//   // const { data } = api.example.getAll.useQuery();
//   return {
//     props: {
//       resppppp,
//     },
//   };
// }

export default YourComponent;
