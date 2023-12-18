import React, { useMemo, useState } from "react";
import { Container, Form } from "react-bootstrap";
import { useTable, useSortBy, usePagination } from "react-table";
import InputSelect from "./inputs/InputSelect";
import { CustomCard } from "./cards/CustomCard";

const GeneralTable = ({
  header,
  tableData,
  tableColumns,
  searchBy,
  filterBy,
  removeFilterFromColumn,
  isScrollable,
}) => {
  const columns = useMemo(() => {
    if (!tableData || tableData.length === 0) {
      return [];
    }
    const keys = Object.keys(tableData[0]);

    const filteredKeys = keys.filter((key) =>
      removeFilterFromColumn ? key !== filterBy && key !== "_id" : true
    );

    console.log(filteredKeys);
    const generatedColumns = filteredKeys.map((key) => ({
      Header: formatKey(key),
      accessor: key,
    }));
    return generatedColumns;
  }, [tableData, tableColumns]);

  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("");

  const filteredData = useMemo(() => {
    let data = tableData;
    if (searchText) {
      data = data.filter(
        (row) =>
          row[`${searchBy}`] &&
          row[`${searchBy}`].toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (filterOption) {
      data = data.filter(
        (row) =>
          row[`${filterBy}`] &&
          row[`${filterBy}`].toLowerCase() === filterOption.toLowerCase()
      );
    }
    return data;
  }, [tableData, searchText, filterOption]);

  const uniqueFilter = useMemo(() => {
    const filters = [...new Set(tableData.map((row) => row[`${filterBy}`]))];
    console.log(filters.filter((filter) => filter));
    return filters.filter((filter) => filter);
  }, [tableData]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
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
    <CustomCard header={header} style={{ overflowX: "auto" }}>
      {tableData && (
        <>
          {searchBy ||
            (filterBy && (
              <Form className="mb-2">
                {searchBy && (
                  <Form.Control
                    type="text"
                    placeholder="Filter by Company"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                )}
                {filterBy && (
                  <InputSelect
                    label={"القطاع"}
                    placeholder="البحث عن قطاع"
                    value={filterOption}
                    options={[
                      ...uniqueFilter.map((sector, index) => ({
                        value: sector,
                        label: sector,
                      })),
                    ]}
                    onChange={(e) => {
                      setFilterOption(e && e.value);
                    }}
                    isSearchable={true}
                  />
                )}
              </Form>
            ))}

          <div
            style={{
              maxWidth: "100%",
              overflowX: "auto",
              maxHeight: "500px", // Set the maximum height here
              overflowY: "auto",
            }}
          >
            <table
              {...getTableProps()}
              className="table table-borderless text-center table-hover"
            >
              <thead className="">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
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
              {isScrollable ? (
                <>
                  <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map((cell) => (
                            <td {...cell.getCellProps()}>
                              {cell.render("Cell")}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </>
              ) : (
                <tbody className="" {...getTableBodyProps()}>
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              )}
            </table>
          </div>
          {!isScrollable && (
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
          )}
        </>
      )}
    </CustomCard>
  );
};

const formatKey = (key) => {
  // Replace underscores with spaces
  const formattedKey = key.replace(/_/g, " ");

  // Convert camelCase to Title Case
  const titleCaseKey = formattedKey
    // Handle camelCase by inserting a space before capital letters
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    // Capitalize the first letter of each word
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return titleCaseKey;
};

export default GeneralTable;
