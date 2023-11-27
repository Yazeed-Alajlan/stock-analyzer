import React from "react";
import { useTable, useSortBy } from "react-table";
import { useStocksData } from "contexts/StocksDataContext";

const SidebarSelection = ({ onRowClick }) => {
  const { stocksData } = useStocksData();

  const handleRowClick = (symbol) => {
    onRowClick(symbol);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "الشركة",
        accessor: "symbol",
        Cell: ({ row }) => <span className="ms-3">{row.original.symbol}</span>,
      },
      {
        Header: "الإغلاق",
        accessor: (row) => row.summary[row.summary.length - 1].close,
      },
      {
        Header: "التغيير",
        accessor: (row) => row.summary[row.summary.length - 1].change_value,
        Cell: ({ value }) => (
          <span
            className={value.includes("-") ? "text-danger" : "text-success"}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "نسبة التغيير",
        accessor: (row) => row.summary[row.summary.length - 1].change_ratio,
        Cell: ({ value }) => (
          <span
            className={value.includes("-") ? "text-danger" : "text-success"}
          >
            {value}
          </span>
        ),
      },
    ],
    []
  );

  const data = React.useMemo(() => stocksData || [], [stocksData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    <div
      className="custom-scrollbar"
      style={{ maxHeight: "100vh", overflowY: "auto" }}
    >
      <table
        {...getTableProps()}
        className="table table-borderless table-striped table-hover"
      >
        <thead className="position-sticky top-0">
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

export default SidebarSelection;
