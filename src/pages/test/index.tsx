import React, { useState, useEffect, ChangeEvent, RefObject } from "react";

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
];

type Grid = number[][]; // Define your grid data type

function GridTable() {
  const [grid, setGrid] = useState<Grid>([
    [2, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  ]);
  const [activeCell, setActiveCell] = useState<Cell>({ row: -1, col: -1 });
  const tableRef: RefObject<HTMLTableElement> = React.createRef();

  // useEffect(() => {
  //   // Add event listener to synchronize horizontal scrolling of header and data tables
  //   const handleScroll = () => {
  //     // if (tableRef.current) {
  //     //   const headerTable = tableRef.current.querySelector(".header-table");
  //     //   const dataTable = tableRef.current.querySelector(".data-table");
  //     //   if (headerTable && dataTable) {
  //     //     headerTable.scrollLeft = dataTable.scrollLeft;
  //     //   }
  //     // }
  //   };

  //   if (tableRef.current) {
  //     tableRef.current.addEventListener("scroll", handleScroll);
  //   }

  //   return () => {
  //     if (tableRef.current) {
  //       tableRef.current.removeEventListener("scroll", handleScroll);
  //     }
  //   };
  // }, []);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setActiveCell({ row: rowIndex, col: colIndex });
  };

  const handleCellValueChange = (event: ChangeEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
    const updatedGrid = [...grid];
    const newValue = Number(event.target.value);

    if (!isNaN(newValue)) {
      updatedGrid[rowIndex]![colIndex] = newValue;
      setGrid(updatedGrid);
    }
  };

  return (
    <div className="bg-gray-400 p-4 ">
      <div className="flex ">
        <div className="w-1/12 bg-red-300">Hi</div>
        <div className=" w-full" style={{ overflowX: "auto", scrollbarGutter: "stable" }}>
          <div className="pr-3" style={{ scrollbarGutter: "stable" }}>
            <div className="flex ">
              {customers.map((val, i) => (
                <div key={i} className="border  w-full">
                  {val.name}
                </div>
              ))}
            </div>
            <div className="flex">
              {[...Array(customers.length)].map((val, j) => (
                <div key={j} className="flex" style={{ width: `${100 / customers.length}%` }}>
                  {products.map((val, i) => (
                    <div key={i} className="border text-[0.6rem]" style={{ width: `${100 / products.length}%` }}>
                      {val.name}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="table-container" style={{ overflowY: "auto", maxHeight: "400px" }}>
            <table className="table-fixed border-collapse border data-table w-full">
              <tbody>
                {grid.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td
                        key={colIndex}
                        className={`border px-6 py-4 ${Math.floor(colIndex / products.length) % products.length === 0 ? "bg-zinc-500" : ""} `}
                        onClick={() => handleCellClick(rowIndex + 1, colIndex)}
                      >
                        {activeCell.row === rowIndex + 1 && activeCell.col === colIndex ? (
                          <input
                            className="focus:outline-none appearance-none bg-gray-400 w-5"
                            type="number"
                            value={cell}
                            onChange={(e) => handleCellValueChange(e, rowIndex + 1, colIndex)}
                            onBlur={() => setActiveCell({ row: -1, col: -1 })}
                            autoFocus
                          />
                        ) : (
                          <span>{cell}</span>
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
}

export default GridTable;
