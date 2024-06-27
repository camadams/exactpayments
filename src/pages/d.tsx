import { useState } from "react";

function YourComponent() {
  const [x, setx] = useState<number>(20);
  return (
    <>
      <div className="flex">
        <div className="w-full bg-gray-300 ">1</div>
        <div className="w-full bg-gray-400 ">reallylooooooooooooooooooongword</div>
        <div className="w-full bg-gray-500 ">3</div>
        <div className="w-full bg-gray-600 ">4</div>
        <div className="w-full bg-gray-700 ">5</div>
      </div>

      <div className="p-5" />

      <div className="flex w-full">
        <div className={`w-[${x}%] bg-gray-300 `}>1</div>
        <div className={`w-[${x}%] bg-gray-400 `}>2</div>
        <div className={`w-[${x}%] bg-gray-500 `}>3</div>
        <div className={`w-[${x}%] bg-gray-600 `}>4</div>
        <div className={`w-[${x}%] bg-gray-700 `}>5</div>
      </div>
    </>
  );
}

export default YourComponent;
