import React, { useMemo, useState } from "react";
import { Container, Form } from "react-bootstrap";
import { useTable, useSortBy, usePagination } from "react-table";

const GeneralTable = ({ tableData, tableColumns, searchBy }) => {
  const columns = useMemo(() => {
    if (tableData.length === 0) {
      return [];
    }
    const keys = Object.keys(tableData[0]);
    const filteredKeys = keys.filter((key) => key !== "_id");
    const generatedColumns = filteredKeys.map((key) => ({
      Header: formatKey(key),
      accessor: key,
    }));
    return generatedColumns;
  }, [tableData]);

  const [searchText, setSearchText] = useState("");

  const filteredData = useMemo(() => {
    let data = tableData;
    if (searchText) {
      data = data.filter(
        (row) =>
          row[`${searchBy}`] &&
          row[`${searchBy}`].toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return data;
  }, [tableData, searchText]);

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
      columns: tableColumns ? tableColumns : columns,
      data: filteredData,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  );

  return (
    <Container style={{ overflowX: "auto" }}>
      <div style={{ maxWidth: "100%", overflowX: "auto" }}>
        {searchBy && (
          <Form className="mb-2">
            <Form.Control
              type="text"
              placeholder="Filter by Company"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Form>
        )}

        <table {...getTableProps()} className="table">
          <thead className="">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? "🔽"
                          : "🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="" {...getTableBodyProps()}>
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
      </div>

      <div className="d-flex justify-content-center align-items-center mt-2">
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
            {pageIndex + 1} of {Math.ceil(filteredData.length / 10)}
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
