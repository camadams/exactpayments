import { type RouterOutputs, api } from "~/utils/api";
const SalesTest = () => {
  const { data: freshBillResult, mutate: dodo } = api.user.createTestData.useMutation();
  const { data: frontt, mutate: front } = api.user.createTestDataFront.useMutation();
  const { data: datess } = api.user.getWhereId.useQuery();

  const handlepopo = () => {
    dodo();
  };

  const handleFront = () => {
    const noww = new Date();
    console.log({ noww });
    front({ time: noww });
  };
  return (
    <div className="flex flex-col gap-4 bg-white">
      <button className="bg-red-300 h-fit w-fit" onClick={() => handlepopo()}>
        Create with now on back end
      </button>
      <button className="bg-red-300 h-fit w-fit" onClick={() => handleFront()}>
        Create with now on front end
      </button>
      {/* {datess?.map((date, i) => <pre key={i}>{JSON.stringify(date, null, "\t")}</pre>)} */}
      <pre>{JSON.stringify(datess, null, "\t")}</pre>
    </div>
  );
};

export default SalesTest;
