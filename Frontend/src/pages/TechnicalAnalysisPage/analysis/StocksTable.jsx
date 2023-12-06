import React from "react";
import { useTable, useSortBy } from "react-table";

const StocksTable = ({ data, columns, handleRowClick }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);
  return (
    <div
      className="custom-scrollbar border-top"
      style={{
        // maxHeight: "100%",x
        overflowY: "auto",
      }}
    >
      <table
        {...getTableProps()}
        className="table table-borderless table-light table-hover text-center "
      >
        <thead className="position-sticky top-0 ">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="table-header"
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                onClick={() => handleRowClick(row.original.symbol)} // Pass symbol on row click
                className="border-top border-bottom"
                style={{ cursor: "pointer" }} // Change cursor to indicate clickability
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StocksTable;
