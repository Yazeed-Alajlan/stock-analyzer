import React, { useState } from "react";
import { useTable, useSortBy } from "react-table";
import { useStocksData } from "contexts/StocksDataContext";
import CustomButton from "components/utils/buttons/CustomButton";
import IconButton from "components/utils/buttons/IconButton";
import { TbFilter } from "react-icons/tb";
import { useModal } from "contexts/ModalContext";
import GlobalModal from "components/utils/modals/GlobalModal";
import FilterStocksModal from "components/utils/modals/FilterStocksModal";

const SidebarSelection = ({ onRowClick }) => {
  const { stocksData } = useStocksData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (symbol) => {
    onRowClick(symbol);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "الشركة",
        accessor: "symbol",
        Cell: ({ row }) => <span>{row.original.symbol}</span>,
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
  console.log(data);
  console.log(columns);
  return (
    <div className="d-flex flex-column align-items-center bg-dark">
      <IconButton
        icon={TbFilter}
        hoverText={"filter"}
        onClick={() => setIsModalOpen(true)}
      />
      <br />

      <FilterStocksModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title={"Filter Data"}
      ></FilterStocksModal>

      <div
        className="custom-scrollbar"
        style={{ maxHeight: "100vh", overflowY: "auto" }}
      >
        <table
          {...getTableProps()}
          className="table table-borderless  table-hover text-center"
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
    </div>
  );
};

export default SidebarSelection;
