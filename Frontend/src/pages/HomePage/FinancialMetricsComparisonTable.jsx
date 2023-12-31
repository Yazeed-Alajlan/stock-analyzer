import { CustomCard } from "components/utils/cards/CustomCard";
import InputSelect from "components/utils/inputs/InputSelect";
import React, { useMemo, useState } from "react";
import { Container, Form } from "react-bootstrap";
import { useTable, useSortBy, usePagination } from "react-table";

const FinancialMetricsComparisonTable = ({
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

    const generatedColumns = filteredKeys.map((key) => ({
      Header: formatKey(key),
      accessor: key,
    }));
    return generatedColumns;
  }, [tableData]);

  const [selectedColumns, setSelectedColumns] = useState(tableColumns || []);

  const handleColumnChange = (selected) => {
    setSelectedColumns(selected);
  };

  const generateColumnOptions = () => {
    return columns.map((column) => ({
      value: column.accessor,
      label: column.Header,
    }));
  };

  const visibleColumns = useMemo(
    () => columns.filter((column) => selectedColumns.includes(column.accessor)),
    [columns, selectedColumns]
  );

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
      columns: visibleColumns, // Use visibleColumns instead of tableColumns
      data: filteredData,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  );

  const dataToMap = isScrollable ? rows : page;

  return (
    <CustomCard header={header} style={{ overflowX: "auto" }}>
      {tableData && (
        <>
          <div className="mb-2"></div>

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
              <div className="d-flex w-100">
                <InputSelect
                  label="القطاع"
                  placeholder="تصفية حسب القطاع"
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
                <InputSelect
                  label="إختر الأعمدة"
                  placeholder="إختر الأعمدة"
                  value={selectedColumns}
                  options={generateColumnOptions()}
                  isMulti
                  onChange={(selected) =>
                    handleColumnChange(selected.map((item) => item.value))
                  }
                  isSearchable={true}
                />
              </div>
            )}
          </Form>

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
              className="table table-striped table-borderless table-hover text-center"
            >
              <thead className="position-sticky top-0">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        className="text-primary fs-5"
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
              <tbody {...getTableBodyProps()}>
                {dataToMap.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell, index) => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
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
  const formattedKey = key.replace(/_/g, " ");
  const titleCaseKey = formattedKey
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  return titleCaseKey;
};

export default FinancialMetricsComparisonTable;
