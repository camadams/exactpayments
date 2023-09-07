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
];

type Grid = number[][]; // Define your grid data type

function GridTable() {
  const [grid, setGrid] = useState<Grid>([[...new Array<number>(customers.length * products.length).fill(0)], [...new Array<number>(customers.length * products.length).fill(0)]]);
  const [activeCell, setActiveCell] = useState<Cell>({ row: -1, col: -1 });
  // const tableRef: RefObject<HTMLTableElement> = React.createRef();

  useEffect(() => {
    const handleArrowKeys = (event: KeyboardEvent) => {
      if (activeCell.row === -1 || activeCell.col === -1) return;

      const handleNavigation = (rowChange: number, colChange: number) => {
        const newRow = activeCell.row + rowChange;
        const newCol = activeCell.col + colChange;

        if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0]!.length) {
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
  }, [activeCell, grid]);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setActiveCell({ row: rowIndex, col: colIndex });
  };

  const handleCellValueChange = (event: ChangeEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
    const updatedGrid = [...grid];
    const newValue = parseInt(event.target.value);
    updatedGrid[rowIndex]![colIndex] = newValue;
    setGrid(updatedGrid);
  };

  const handleOnBlur = () => {
    if (isNaN(grid[activeCell.row]![activeCell.col]!)) {
      const updatedGrid = [...grid];
      updatedGrid[activeCell.row]![activeCell.col] = 0;
      setGrid(updatedGrid);
    }

    setActiveCell({ row: -1, col: -1 });
  };

  // const updateGridCell = (rowIndex: number, colIndex: number, val: any) => {
  //   const updatedGrid = [...grid];
  //   updatedGrid[rowIndex]![colIndex] = Number(val);
  //   setGrid(updatedGrid);
  // };

  // const x = [0, 0, 0, 0];
  const numOfCustomers = new Array<number>(customers.length);
  return (
    <div className="bg-gray-400 p-4 ">
      <div className="flex ">
        <div className="w-1/12 bg-red-300">Hi</div>
        <div className=" w-full" style={{ overflowX: "auto", scrollbarGutter: "stable" }}>
          <div className="pr-4" style={{ scrollbarGutter: "stable" }}>
            <div className="flex ">
              {customers.map((val, i) => (
                <div key={i} className="border  w-full">
                  {val.name}
                </div>
              ))}
            </div>
            <div className="flex">
              {[...numOfCustomers].map((_, j) => (
                <div key={j} className="flex" style={{ width: `${100 / customers.length}%` }}>
                  {products.map((val, i) => (
                    <div key={i} className="border text-sm" style={{ width: `${100 / products.length}%` }}>
                      {val.name}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="table-container" style={{ overflowY: "auto", maxHeight: "600px" }}>
            <table className="table-fixed border-collapse border data-table w-full">
              <tbody>
                {grid.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td
                        key={colIndex}
                        className={`border p-1 ${Math.floor(colIndex / products.length) % products.length === 0 ? "bg-zinc-500" : ""} `}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                        {activeCell.row === rowIndex && activeCell.col === colIndex ? (
                          <input
                            className="focus:outline-none appearance-none bg-gray-400 w-full"
                            type="number"
                            value={cell}
                            onChange={(e) => handleCellValueChange(e, rowIndex, colIndex)}
                            onBlur={() => handleOnBlur()}
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
