import React from "react";
import { Container } from "react-bootstrap";
import { useTable, useSortBy, usePagination } from "react-table";

const GeneralTable = ({ columns, data }) => {
  columns = React.useMemo(() => {
    if (data.length === 0) {
      return [];
    }
    const keys = Object.keys(data[0]);
    const filteredKeys = keys.filter((key) => key !== "_id");
    const generatedColumns = filteredKeys.map((key) => ({
      Header: formatKey(key),
      accessor: key,
    }));

    return generatedColumns;
  }, [data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  );

  return (
    <Container>
      <table {...getTableProps()} className="table">
        <thead className="thead-dark text-center">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? "🔽" : "🔼") : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="text-center" {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="d-flex justify-content-center align-items-center">
        <button
          className="btn btn-primary mx-2"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          Previous
        </button>
        <button
          className="btn btn-primary"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          Next
        </button>
        <span className="ml-2">
          Page
          <strong>
            {pageIndex + 1} of {Math.ceil(data.length / 10)}
          </strong>
        </span>
      </div>
    </Container>
  );
};

const formatKey = (key) => {
  // Replace underscores with spaces
  const formattedKey = key.replace(/_/g, " ");

  // Convert camelCase to Title Case
  const titleCaseKey = formattedKey.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

  return titleCaseKey;
};

export default GeneralTable;
