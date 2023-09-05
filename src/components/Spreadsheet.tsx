import React, { useEffect, useState } from "react";

interface SpreadSheetProps {
  initialGrid: number[][];
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
    if (activeCell !== undefined && !Number.isNaN(event.target.value)) {
      const updatedGrid = [...grid];
      updatedGrid[activeCell.row]![activeCell.col] = parseInt(event.target.value);

      setGrid(updatedGrid);
    }
  };
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

  return (
    <div className="bg-gray-400 p-4">
      <table className="table-fixed border-collapse border">
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="border px-6 py-4" onClick={() => handleCellClick(rowIndex, colIndex)}>
                  {activeCell.row === rowIndex && activeCell.col === colIndex ? (
                    <input
                      className="focus:outline-none appearance-none bg-gray-400  w-5"
                      type="number"
                      value={cell}
                      onChange={handleCellValueChange}
                      onBlur={() => setActiveCell({ row: -1, col: -1 })}
                      autoFocus
                    />
                  ) : (
                    <span className="">{cell}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Spreadsheet;
