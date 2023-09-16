import React, { useState, useEffect, type ChangeEvent } from "react";

interface Cell {
  row: number;
  col: number;
}

const products = [
  { name: "Almond Croisant", unitPrice: 18 },
  { name: "Cinnamon Stick", unitPrice: 12 },
];

const customers = [
  { name: "Hang Ten", emailAddress: "hangten@gmail.com" },
  { name: "Surf Shack", emailAddress: "surfshack@gmail.com" },
  { name: "Salt", emailAddress: "surfshack@gmail.com" },
  { name: "Ohana", emailAddress: "surfshack@gmail.com" },
  { name: "Blue Door", emailAddress: "surfshack@gmail.com" },
  { name: "Blue Door", emailAddress: "surfshack@gmail.com" },
  { name: "Blue Door", emailAddress: "surfshack@gmail.com" },
  { name: "Blue Door", emailAddress: "surfshack@gmail.com" },
];

export interface Sale {
  quantity: number;
}

export interface SheetRow {
  date: Date;
  sales: Sale[];
}

export interface SpreadSheet {
  rows: SheetRow[];
}

interface SpreadSheetProps {
  spreadSheet: SpreadSheet;
  setSpreadSheet: React.Dispatch<React.SetStateAction<SpreadSheet>>;
}

const App = ({ spreadSheet, setSpreadSheet }: SpreadSheetProps) => {
  // const [spreadSheet, setSpreadSheet] = useState<SpreadSheet>(spreadSheet);
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
  }, [activeCell, spreadSheet]);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setActiveCell({ row: rowIndex, col: colIndex });
  };

  const handleCellValueChange = (event: ChangeEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
    const newValue = parseInt(event.target.value);

    // Create a deep copy of the current state and update the quantity
    const updatedSpreadSheet = {
      rows: spreadSheet.rows.map((row, currentRowIndex) => {
        return currentRowIndex === rowIndex ? updateCell(row, colIndex, newValue) : { ...row };
      }),
    };

    // Update the state with the new spreadsheet
    setSpreadSheet(updatedSpreadSheet);
  };

  // Function to update a single cell's quantity
  const updateCell = (row: SheetRow, colIndex: number, newValue: number): SheetRow => ({
    date: row.date,
    sales: row.sales.map((sale, currentColIndex) => ({
      ...sale,
      quantity: currentColIndex === colIndex ? newValue : sale.quantity,
    })),
  });

  // const handleOnBlur = () => {
  //   if (isNaN(spreadSheet.rows[activeCell.row]!.sales[activeCell.col]!.quantity)) {
  //     const updatedGrid = [...spreadSheet.rows];
  //     updatedGrid[activeCell.row]!.sales[activeCell.col]!.quantity = 0;
  //     spreadSheet.rows = updatedGrid;
  //     setSpreadSheet(spreadSheet);
  //   }

  //   setActiveCell({ row: -1, col: -1 });
  // };

  // const updateGridCell = (rowIndex: number, colIndex: number, val: number ) => {
  //   const updatedGrid = [...spreadSheet.rows];
  //   updatedGrid[rowIndex]!.sales[colIndex]!.quantity = val;
  //   spreadSheet.rows = updatedGrid;
  //   setSpreadSheet(spreadSheet);
  // };

  // const x = [0, 0, 0, 0];
  const numOfCustomers = new Array<number>(customers.length);
  return (
    <div className="bg-gray-400 ">
      <div className="flex ">
        {/* Vertical Date Bar */}
        <div className="w-1/12 bg-red-100 flex flex-col justify-end">
          {[...spreadSheet.rows].map((sheetRow, j) => (
            <div key={j} className="flex bg-red-200 h-[33px] p-1 border-b border-white text-sm" /*style={{ width: `${100 / customers.length}%` }}*/>
              {/* {sheetRow.date.toString()} */}
            </div>
          ))}
        </div>

        {/* Sheet Content */}
        <div className=" w-full" style={{ overflowX: "auto", scrollbarGutter: "stable" }}>
          {/* Frozen Header */}
          <div className="pr-4" style={{ scrollbarGutter: "stable" }}>
            <div className="flex ">
              {customers.map((customer, i) => (
                <div key={i} className="border  w-full">
                  {customer.name}
                </div>
              ))}
            </div>
            <div className="flex">
              {[...numOfCustomers].map((_, j) => (
                <div key={j} className="flex" style={{ width: `${100 / customers.length}%` }}>
                  {products.map((product, i) => (
                    <div key={i} className="border text-sm" style={{ width: `${100 / products.length}%` }}>
                      {product.name}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* The actual Sales */}
          <div className="table-container" style={{ overflowY: "auto", maxHeight: "600px" }}>
            <table className="table-fixed border-collapse border data-table w-full">
              <tbody>
                {spreadSheet.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.sales.map((sale, colIndex) => (
                      <td
                        key={colIndex}
                        className={`border p-1 ${Math.floor(colIndex / products.length) % products.length === 0 ? "bg-zinc-500" : ""} `}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                        {activeCell.row === rowIndex && activeCell.col === colIndex ? (
                          <input
                            className="focus:outline-none appearance-none bg-gray-400 w-full"
                            type="number"
                            value={sale.quantity}
                            onChange={(e) => handleCellValueChange(e, rowIndex, colIndex)}
                            // onBlur={() => handleOnBlur()}
                            autoFocus
                          />
                        ) : (
                          <span>{sale.quantity}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
