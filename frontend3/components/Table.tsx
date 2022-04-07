import React from "react";
import { useTable } from "react-table";

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
    <div className={classNames(" overflow-hidden", exchangeStyle?.borderStyle)}>
      <table className=" text-white text-center w-full " {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              className=" font-bold  text-md "
              {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  className="text-yellow-500 text-md md:text-sm lg:text-lg"
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
            return (
              <tr
                className={classNames(
                  " text-gray-300 font-medium md:font-bold  ",
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
