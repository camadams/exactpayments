/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { compareAsc, format, isToday } from "date-fns";
import React, { useState, useEffect, type ChangeEvent } from "react";
import { type DateRange } from "react-day-picker";
import { type SpreadSheet } from "~/server/api/routers/sale";
import { type SheetRow, getCustomerAndProductFromIndex } from "~/utils/businessLogic";

interface Cell {
  row: number;
  col: number;
}

interface SpreadSheetProps {
  spreadSheet: SpreadSheet;
  setSpreadSheet: React.Dispatch<React.SetStateAction<SpreadSheet | undefined>>;
  date: DateRange | undefined;
  salesMutation: any;
}

export default function App({ spreadSheet, setSpreadSheet, date, salesMutation }: SpreadSheetProps) {
  // const <div spreadSheet,="" setSpreadSheet=""></div> = useState<SpreadSheet>(spreadSheet);
  const [activeCell, setActiveCell] = useState<Cell>({ row: -1, col: -1 });
  // const tableRef: RefObject<HTMLTableElement> = React.createRef();

  useEffect(() => {
    const handleArrowKeys = (event: KeyboardEvent) => {
      if (activeCell.row === -1 || activeCell.col === -1) return;

      const handleNavigation = (rowChange: number, colChange: number) => {
        const newRow = activeCell.row + rowChange;
        const newCol = activeCell.col + colChange;

        if (newRow >= 0 && newRow < spreadSheet.rows.length && newCol >= 0 && newCol < spreadSheet.rows[0]!.sales.length) {
          setActiveCell({ row: newRow, col: newCol });
          handleOnBlur();
        }
      };

      switch (event.key) {
        case "ArrowUp":
          handleNavigation(-1, 0);
          break;
        case "ArrowDown":
          handleNavigation(1, 0);
          break;
        case "ArrowLeft":
          handleNavigation(0, -1);
          break;
        case "ArrowRight":
          handleNavigation(0, 1);
          break;
        default:
          return;
      }
    };
    window.addEventListener("keydown", handleArrowKeys);
    return () => {
      window.removeEventListener("keydown", handleArrowKeys);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCell, spreadSheet]);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setActiveCell({ row: rowIndex, col: colIndex });
  };

  const handleCellValueChange = (event: ChangeEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
    const newValue = parseInt(event.target.value);
    const updatedSpreadSheet: SpreadSheet = {
      ...spreadSheet,
      rows: spreadSheet.rows.map((row, i) => ({
        ...row,
        sales:
          i === rowIndex
            ? row.sales.map((sale, currentColIndex) => ({
                ...sale,
                quantity: currentColIndex === colIndex ? newValue : sale.quantity,
              }))
            : [...row.sales],
      })),
    };

    setSpreadSheet(updatedSpreadSheet);
  };

  const handleOnBlur = () => {
    const sheetRow = spreadSheet?.rows[activeCell.row]!;
    const [customerId, productId] = getCustomerAndProductFromIndex(activeCell.col);
    const quantity = sheetRow.sales[activeCell.col]!.quantity;
    if (quantity == 0) return;
    // console.log("sheetRow.date ^^^^^^^^^", sheetRow.date);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    // salesMutation.mutate({
    //   saleDate: sheetRow.date,
    //   quantity: quantity,
    //   productId: productId,
    //   customerId: customerId,
    // });

    // alert("hi");
    // if (isNaN(spreadSheet.rows[activeCell.row]!.sales[activeCell.col]!.quantity)) {
    //   const updatedGrid = [...spreadSheet.rows];
    //   updatedGrid[activeCell.row]!.sales[activeCell.col]!.quantity = 0;
    //   spreadSheet.rows = updatedGrid;
    //   setSpreadSheet(spreadSheet);
    // }
    // setActiveCell({ row: -1, col: -1 });
  };

  // const updateGridCell = (rowIndex: number, colIndex: number, val: number ) => {
  //   const updatedGrid = [...spreadSheet.rows];
  //   updatedGrid[rowIndex]!.sales[colIndex]!.quantity = val;
  //   spreadSheet.rows = updatedGrid;
  //   setSpreadSheet(spreadSheet);
  // };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent the default behavior of the up and down arrow keys
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
    }
  };

  // const x = [0, 0, 0, 0];
  const numCustomers = spreadSheet.header.length;
  const numProducts = spreadSheet.header[0] ? spreadSheet.header[0].products.length : 0;
  const temp = new Array<number>(numCustomers);
  const sheetWidth = (numProducts * numCustomers + 1) * 100;
  const customers = spreadSheet.header.map((h) => h.customer);
  const products = spreadSheet.header[0]!.products;
  return (
    <>
      {spreadSheet ? (
        <div className="max-w-full overflow-x-auto">
          <div className="w-full bg-cyan-400" style={{ width: `${sheetWidth}px` }}>
            <TopHeader />
            <div className="table-container overflow-y-auto max-h-[700px]" style={{ scrollbarGutter: "stable" }}>
              <table className="w-full border border-collapse table-fixed data-table">
                <tbody>
                  {spreadSheet.rows
                    .filter((row) => compareAsc(row.date, date?.from!) >= 0 && compareAsc(date?.to!, row.date) >= 0)
                    .map((row, rowIndex) => (
                      <Row key={rowIndex} rowIndex={rowIndex} row={row} />
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div>loading</div>
      )}
    </>
  );

  function TopHeader() {
    return (
      <div className="flex">
        <div style={{ minWidth: "80px" }}></div> {/*filler */}
        <div className="w-full pr-4">
          <div className="flex ">
            {customers.map((customer, i) => (
              <div key={i} className="w-full p-2 border">
                {customer.name}
              </div>
            ))}
          </div>
          <div className="flex">
            {[...temp].map((_, j) => (
              <div key={j} className="flex" style={{ width: `${100 / customers.length}%` }}>
                {products.map((product, i) => (
                  <div key={i} className="p-1 text-xs border" style={{ width: `${100 / products.length}%` }}>
                    {product.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function Row({ rowIndex, row }: { rowIndex: number; row: SheetRow }) {
    const color = rowIndex % 2 === 0 ? "bg-gray-400" : "bg-gray-300";
    const dayColor = isToday(row.date) ? "bg-blue-400" : color;
    // const borderColor = wor % products.length === 0 ? "border-r-2" : "";
    return (
      <tr key={rowIndex}>
        {/* date */}
        {/* <td className={`text-[13px] ${row.date.getDay() === 1 ? "bg-red-200" : ""}`}>{format(row.date, "eee d MMM")}</td> */}
        <td className={`text-xs w-20 pl-1 ${dayColor} border-r-2`}>{format(row.date, "eee d MMM")}</td>
        {/* sales */}
        {row.sales.map((sale, colIndex) => (
          <td
            key={colIndex}
            className={`p-1  border-r-2 ${color} ${(colIndex + 1) % products.length === 0 ? " border-black" : "border-gray-300"}`}
            onClick={() => handleCellClick(rowIndex, colIndex)}
            // style={{ overflowX: "auto", maxWidth: "1800px" }}
          >
            {activeCell.row === rowIndex && activeCell.col === colIndex ? (
              <input
                className={`w-10 ${color} appearance-none focus:outline-none`}
                type="number"
                value={sale.quantity}
                onChange={(e) => handleCellValueChange(e, rowIndex, colIndex)}
                onBlur={() => handleOnBlur()}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            ) : (
              <span>{sale.quantity}</span>
            )}
          </td>
        ))}
      </tr>
    );
  }
}
