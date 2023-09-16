import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { compareAsc } from "date-fns";
import addDays from "date-fns/addDays";
import add from "date-fns/add";

interface Customer {
  value: string;
  label: string;
}

const customers: Customer[] = [
  { value: "customer1", label: "Customer 1" },
  { value: "customer2", label: "Customer 2" },
  { value: "customer3", label: "Customer 3" },
  // Add more customers as needed
];

const today = new Date();
const data = [
  [addDays(today, 0), 0, 0],
  [addDays(today, 1), 0, 0],
  [addDays(today, 2), 0, 0],
  [addDays(today, 3), 0, 0],
  [addDays(today, 4), 0, 0],
  [addDays(today, 5), 0, 0],
  [addDays(today, 6), 0, 0],
  [addDays(today, 7), 0, 0],
  [addDays(today, 8), 0, 0],
  [addDays(today, 9), 0, 0],
];

const BillForm: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(add(today, { days: 3 }));
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  // const handleCustomerChange = (selectedOptions: Customer[] | null) => {
  //   if (selectedOptions) {
  //     setSelectedCustomers(selectedOptions);
  //     setSelectAll(selectedOptions.length === customers.length);
  //   } else {
  //     setSelectedCustomers([]);
  //     setSelectAll(false);
  //   }
  // };

  const handleSelectAll = () => {
    if (!selectAll) {
      setSelectedCustomers(customers);
    } else {
      setSelectedCustomers([]);
    }
    setSelectAll(!selectAll);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Selected Customers:", selectedCustomers);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl mb-4">Billing Form</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Billing Start Date:
            </label>
            <DatePicker selected={startDate} onChange={handleStartDateChange} id="startDate" className="form-input mt-1" />
          </div>

          <div className="mb-4">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              Billing End Date:
            </label>
            <DatePicker selected={endDate} onChange={handleEndDateChange} id="endDate" className="form-input mt-1" />
          </div>

          <div className="mb-4">
            <label htmlFor="customers" className="block text-sm font-medium text-gray-700">
              Select Customers:
            </label>
            {/* <Select options={customers} value={selectedCustomers} onChange={handleCustomerChange} className="form-input mt-1" /> */}
            <div className="mt-2">
              <input type="checkbox" id="selectAll" checked={selectAll} onChange={handleSelectAll} className="form-checkbox" />
              <label htmlFor="selectAll" className="ml-2">
                Select All
              </label>
            </div>
          </div>

          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Submit
          </button>
        </form>
      </div>
      <div className="bg-red-300 flex flex-col">
        {data
          .filter((row) => compareAsc(row[0]!, startDate!) >= 0 && compareAsc(endDate!, row[0]!) >= 0)
          // .filter((row) => true)
          .map((row, rowIndex) => (
            <div key={rowIndex}>{row[0]!.toString()}</div>
          ))}
        <div className="bg-gray-300">data[0]: {data[0]![0]!.toString()} </div>
        <div className="bg-pink-400">{compareAsc(endDate!, data[0]![0]!) >= 0 ? "End is after" : "data[0]![0]!  is after "}</div>
        <div className="w-full h-8 bg-yellow-400">{0 === 0 ? 10 : 1}</div>
        <br></br>
        <br></br>
        <div className="bg-green-200">Start: {startDate!.toString()}</div>
        <div className="bg-green-200">End: {endDate!.toString()}</div>
      </div>
    </div>
  );
};

export default BillForm;
