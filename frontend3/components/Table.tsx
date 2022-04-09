import React from "react";
import { useTable } from "react-table";
import TableSkeleton from "./TableSkeleton";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function Table({ columns, data, exchangeStyle }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });
  return (
    <div
      className={classNames(
        "overflow-y-auto h-[500px] border-2 border-gray-400/20 rounded-sm overflow-hidden"
      )}>
      <table className=" text-white text-center w-full " {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              className=" font-bold  text-md "
              {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  className="text-yellow-500 text-md md:text-sm lg:text-lg "
                  {...column.getHeaderProps()}>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return row?.values?.key === undefined ? (
              <tr>
                <td colSpan={6}>
                  <TableSkeleton
                    base="#010C27"
                    highlight={
                      exchangeStyle ? exchangeStyle?.highlight : "#233242"
                    }
                  />
                </td>
              </tr>
            ) : (
              <tr
                className={classNames(
                  "border-b-gray-400/20 border-b-2 text-gray-300 font-sm sm:font-bold  ",
                  exchangeStyle?.exchangeStyle
                )}
                {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
