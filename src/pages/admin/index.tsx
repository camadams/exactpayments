import React, { useState } from "react";
import { funcFromBill } from "~/server/api/bill";

const App = ({ data }: { data: number[][] }) => {
  const [invoiceLines, setInvoiceLines] = useState("hi");

  const almPrice = 18;
  const cinnaPrice = 12;

  const calculateInvoiceLines = (grid: number[][]) => {
    const accum: number[] = [0, 0, 0, 0, 0];
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let j = 0; j < grid.length; j++) {
      for (let i = 0; i < grid[0]!.length; i++) {
        accum[i] += grid[j]![i]!;
      }
    }
    const line = `${accum[1]} X Almond Cros @ R${almPrice} = R${accum[1]! * almPrice} \n ${accum[2]} X Cinna Twist @ R${almPrice} = R${accum[2]! * cinnaPrice}`;
    setInvoiceLines((prev) => line);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">React TypeScript Spreadsheet App</h1>
      <Spreadsheet initialGrid={data} calcInvoiceLines={calculateInvoiceLines} />
      <div>{invoiceLines}</div>
    </div>
  );
};

interface SpreadSheetProps {
  initialGrid: number[][];
  calcInvoiceLines: (grid: number[][]) => void;
}

const Spreadsheet = (props: SpreadSheetProps) => {
  // const grid = props.initialGrid;
  const [grid, setGrid] = useState(props.initialGrid);
  const [activeCell, setActiveCell] = useState<{ row: number; col: number }>({
    row: -1,
    col: -1,
  });

  const handleCellClick = (row: number, col: number) => {
    setActiveCell({ row, col });
  };

  const handleCellValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (activeCell !== undefined) {
      const updatedGrid = [...grid];
      updatedGrid[activeCell.row]![activeCell.col] = parseInt(event.target.value);

      setGrid(updatedGrid);
    }
  };

  return (
    <div className="bg-gray-400 p-4">
      <table className="table-fixed border-collapse border">
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="border px-6 py-4" onClick={() => handleCellClick(rowIndex, colIndex)}>
                  {activeCell.row === rowIndex && activeCell.col === colIndex ? (
                    <input type="number" value={cell} onChange={handleCellValueChange} onBlur={() => setActiveCell({ row: -1, col: -1 })} autoFocus className="w-1/2" />
                  ) : (
                    <span className="w-1/2">{cell}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => props.calcInvoiceLines(grid)}>Bill</button>
    </div>
  );
};

export default App;

// This gets called on every request
// eslint-disable-next-line @typescript-eslint/require-await
export async function getServerSideProps() {
  // Fetch data from external API
  // const res = await fetch(`https://.../data`);
  // const data: any = await res.json();

  // Pass data to the page via props
  const data: number[][] = [
    [1, 12, 3],
    [2, 12, 3],
    [3, 0, 3],
    [4, 0, 3],
    [5, 0, 3],
  ];

  return { props: { data } };
}
