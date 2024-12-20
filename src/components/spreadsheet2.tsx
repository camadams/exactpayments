/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { compareAsc, format, isSameDay, isToday } from "date-fns";
import React, { useState, useEffect, type ChangeEvent } from "react";
import { type CellType, type SheetRow, type SpreadSheet } from "~/server/api/routers/sale";
import { type RouterInputs } from "~/utils/api";

interface Cell {
  row: number;
  col: number;
}

interface SpreadSheetProps {
  spreadSheet: SpreadSheet;
  setSpreadSheet: React.Dispatch<React.SetStateAction<SpreadSheet | undefined>>;
  from: Date;
  to: Date;
  salesMutation: any;
  isSelling: boolean;
}

type SaleToAdd = RouterInputs["sale"]["createOrUpdate"];

export default function SpreadSheet({ spreadSheet, setSpreadSheet, from, to, salesMutation, isSelling }: SpreadSheetProps) {
  const [activeCell, setActiveCell] = useState<Cell>({ row: -1, col: -1 });
  const [salesToBeAddedOrUpdatedOnDb, setSalesToBeAddedOrUpdatedOnDb] = useState<SaleToAdd[]>();
  useEffect(() => {
    const intervalId = setTimeout(() => {
      if (salesToBeAddedOrUpdatedOnDb && salesToBeAddedOrUpdatedOnDb.length > 0) {
        for (const newSale of salesToBeAddedOrUpdatedOnDb) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          salesMutation.mutate(newSale);
        }
        setSalesToBeAddedOrUpdatedOnDb((prev) => []);
      }
    }, 3000);
    return () => {
      // todo possibly empty array here too
      clearTimeout(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesToBeAddedOrUpdatedOnDb]);

  useEffect(() => {
    const handleArrowKeys = (event: KeyboardEvent) => {
      if (activeCell.row === -1 || activeCell.col === -1) return;

      const handleNavigation = (rowChange: number, colChange: number) => {
        const newRow = activeCell.row + rowChange;
        const newCol = activeCell.col + colChange;

        if (newRow >= 0 && newRow < spreadSheet.rows.length && newCol >= 0 && newCol < spreadSheet.rows[0]!.sales.length) {
          setActiveCell({ row: newRow, col: newCol });
          // handleOnBlur();
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
    if (isSelling) {
      setActiveCell({ row: rowIndex, col: colIndex });
    }
  };

  const handleCellValueChange = (event: ChangeEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
    let quantity = parseInt(event.target.value);
    if (isNaN(quantity)) quantity = 0;
    const updatedSpreadSheet: SpreadSheet = {
      ...spreadSheet,
      rows: spreadSheet.rows.map((row, i) => ({
        ...row,
        sales:
          i === rowIndex
            ? row.sales.map((sale, j) => ({
                ...sale,
                quantity: j === colIndex ? quantity : sale.quantity,
              }))
            : [...row.sales],
      })),
    };
    setSpreadSheet(updatedSpreadSheet);

    const saleDate = spreadSheet?.rows[activeCell.row]!.date;
    spreadSheet.header[activeCell.col]?.user.id;
    const productId = (activeCell.col % 3) + 1;
    const buyingUserId = spreadSheet.header[Math.floor(activeCell.col / 3)]?.user.id!;

    // const { buyingUserId, productId } = getCustomerAndProductFromIndex(activeCell.col);
    // console.log(spreadSheet.header[buyingUserIddd]?.user);
    // console.log(Z);
    const newSale: SaleToAdd = { saleDate, quantity, productId, buyingUserId, rowIndex, colIndex };
    setSalesToBeAddedOrUpdatedOnDb((prevSales) => {
      if (!prevSales) return [newSale];

      const index = prevSales.findIndex(
        (sale) => sale.productId === newSale.productId && sale.buyingUserId === newSale.buyingUserId && isSameDay(sale.saleDate, newSale.saleDate),
      );

      if (index !== -1) {
        // Update existing sale
        return prevSales.map((sale, i) => (i === index ? { ...sale, quantity: newSale.quantity } : sale));
      } else {
        // Add the new sale
        return [...prevSales, newSale];
      }
    });
  };

  // const handleOnBlur = () => {
  //   const activeCol = activeCell.col;
  //   const activeRow = activeCell.row;
  //   const sheetRow = spreadSheet?.rows[activeRow]!;
  //   const sheetRowDate = sheetRow.date;

  //   const [customerId, productId] = getCustomerAndProductFromIndex(activeCol);
  //   const quantity = sheetRow.sales[activeCol]!.quantity;
  //   if (quantity == 0 || !quantity) return;
  //   console.log({ sheetRowDate, activeCol, activeRow });
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  //   salesMutation.mutate({
  //     saleDate: sheetRow.date,
  //     quantity: quantity,
  //     productId: productId,
  //     customerId: customerId,
  //   });
  // };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent the default behavior of the up and down arrow keys
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
    }
  };

  const sumItUp = (spreadSheet: SpreadSheet) => {
    const custProdLength = spreadSheet.rows[0]!.sales.length;
    const accum: number[] = [...new Array<number>(custProdLength).fill(0)];
    for (let x = 0; x < custProdLength; x++) {
      for (const row of spreadSheet.rows) {
        accum[x] += row.sales[x]!.quantity;
      }
    }
    return accum;
  };

  function sumNConsecutiveNumbers(arr: number[], n: number): number[] {
    if (n <= 0 || n > arr.length) return [];

    const result: number[] = [];
    for (let i = 0; i < arr.length; i += n) {
      let sum = 0;
      for (let j = i; j < i + n; j++) {
        sum += arr[j]!;
      }
      result.push(sum);
    }

    return result;
  }

  // const x = [0, 0, 0, 0];
  const usersLen = spreadSheet.header.length;
  // const numProducts = spreadSheet.header[0].products.length;
  const productsLen = spreadSheet.header[0] ? spreadSheet.header[0].products.length : 0;
  const usersLenTemp = new Array<number>(usersLen);
  const sheetWidth = (productsLen * usersLen + 1) * 55;
  const cellWidth = sheetWidth / (productsLen * usersLen + 1);
  const users = spreadSheet.header.map((h) => h.user);
  const products = spreadSheet.header[0]?.products;
  const filteredRows = spreadSheet.rows.filter((row) => compareAsc(row.date, from) >= 0 && compareAsc(to, row.date) >= 0);

  if (products === undefined) {
    return <div>no products</div>;
  }
  const sumQuantity = sumItUp(spreadSheet);

  const sumQuantityTimesPrice = sumQuantity.map((q, i) => q * products[i % productsLen]?.unitPrice!);
  const totalPerUser = sumNConsecutiveNumbers(sumQuantityTimesPrice, productsLen);
  return (
    <>
      {spreadSheet && products && products.length > 0 ? (
        <div className="max-w-full overflow-x-auto">
          <div>{sheetWidth}</div>
          <div className="bg-cyan-400" style={{ width: `${sheetWidth}px` }}>
            {/* <div className={`bg-cyan-400 w-[${sheetWidth}px]`}> */}
            {/* <div className={`bg-cyan-400 w-[${Math.round(sheetWidth)}px]`}> */}
            <TopHeader cellWidth={20} />
            <div className="table-container overflow-y-auto max-h-[550px]" style={{ scrollbarGutter: "stable" }}>
              <table className="w-full border border-collapse table-fixed data-table">
                <tbody>
                  {filteredRows.map((row, rowIndex) => (
                    <Row key={rowIndex} rowIndex={rowIndex} row={row} />
                  ))}
                </tbody>
              </table>
            </div>
            <Footer />
          </div>
        </div>
      ) : (
        <div>loading</div>
      )}
    </>
  );

  function Row({ rowIndex, row }: { rowIndex: number; row: SheetRow }) {
    let baseColor = rowIndex % 2 === 0 ? "bg-gray-400" : "bg-gray-300";
    const dayColor = isToday(row.date) ? "bg-blue-400" : baseColor;
    return (
      <tr key={rowIndex}>
        <td className={`text-xs w-20 pl-1 ${dayColor} border-r-2`}>{format(row.date, "eee d MMM")}</td>
        {row.sales.map((sale, colIndex) => {
          let saleColor = sale.status == 1 ? (rowIndex % 2 === 0 ? "bg-red-400" : "bg-red-300") : baseColor;
          return <Celll key={colIndex} {...{ rowIndex, colIndex, saleColor, sale }} />;
        })}
      </tr>
    );
  }

  function Celll({ rowIndex, colIndex, saleColor, sale }: { rowIndex: number; colIndex: number; saleColor: string; sale: CellType }) {
    const borderColor = (colIndex + 1) % (products ? products.length : 0) === 0 ? " border-black" : "border-gray-300";
    // const borderColor = (colIndex + 1) % (products.length ?? 0) === 0 ? " border-black" : "border-gray-300";
    return (
      <td key={colIndex} className={`border-r-2 p-1 h-8 ${saleColor} ${borderColor}`} onClick={() => handleCellClick(rowIndex, colIndex)}>
        {activeCell.row === rowIndex && activeCell.col === colIndex ? (
          <input
            className={`w-full ${saleColor} appearance-none `}
            type="number"
            value={sale.quantity}
            onChange={(e) => handleCellValueChange(e, rowIndex, colIndex)}
            onKeyDown={handleKeyDown}
            autoFocus
            disabled={sale.status == 1}
          />
        ) : (
          // <span>{sale.quantity}</span>
          <span>{sale.quantity == 0 ? "" : sale.quantity}</span>
        )}
      </td>
    );
  }

  function TopHeader({ cellWidth }: { cellWidth: number }) {
    return (
      <div className="flex">
        {/*filler */}
        <div className="min-w-[80px]"></div>

        <div className="w-full pr-4">
          {/*User names row */}
          <div className="flex ">
            {users.map((user, i) => (
              <div key={i} className="w-full p-1 border">
                {user.name}
              </div>
            ))}
          </div>
          <div className="flex">
            {[...usersLenTemp].map(
              (_, j) =>
                products?.map((product, i) => (
                  <div key={i} className={`text-xs border w-full`}>
                    {product.name}
                  </div>
                )),
            )}
          </div>
        </div>
      </div>
    );
  }

  function Footer() {
    return (
      <div className="flex">
        <div className="min-w-[80px] flex flex-col text-sm">
          <div className="w-full border ">Quantity</div>
          <div className="w-full border ">Total</div>
          <div className="w-full border ">Grand Total</div>
        </div>
        {/*filler */}
        <div className="w-full pr-4">
          <div className="flex">
            {sumQuantity.map((val, j) => (
              // <div key={j} className={`flex w-[${100 / customers.length}%]`}>
              <div key={j} className={`flex w-full border`}>
                {val}
              </div>
            ))}
          </div>
          <div className="flex">
            {sumQuantityTimesPrice.map((val, j) => (
              // <div key={j} className={`flex w-[${100 / customers.length}%]`}>
              <div key={j} className={`flex text-sm w-full border`}>
                {`R${val}`}
              </div>
            ))}
          </div>

          <div className="flex ">
            {totalPerUser.map((total, i) => (
              <div key={i} className="flex justify-center w-full text-sm border">
                {`R${total}`}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
