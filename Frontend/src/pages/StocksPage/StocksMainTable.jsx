import CustomButton from "components/utils/buttons/CustomButton";
import FilterCard from "components/utils/inputs/FilterCard";
import Input from "components/utils/inputs/Input";
import InputSelect from "components/utils/inputs/InputSelect";
import { useStocksData } from "contexts/StocksDataContext";
import React, { useMemo, useState } from "react";
import { Container, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTable, useSortBy, usePagination } from "react-table";

const StocksMainTable = ({ tableData, tableColumns }) => {
  const { setSelectedStock } = useStocksData();

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

  const [companyFilter, setCompanyFilter] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");

  const filteredData = useMemo(() => {
    let data = tableData;
    if (companyFilter) {
      data = data.filter(
        (row) =>
          row["company"] &&
          row["company"].toLowerCase().includes(companyFilter.toLowerCase())
      );
    }
    if (sectorFilter) {
      data = data.filter(
        (row) =>
          row["sectorNameAr"] &&
          row["sectorNameAr"].toLowerCase() === sectorFilter.toLowerCase()
      );
    }
    return data;
  }, [tableData, companyFilter, sectorFilter]);

  const uniqueSectors = useMemo(() => {
    const sectors = [...new Set(tableData.map((row) => row["sectorNameAr"]))];
    return sectors.filter((sector) => sector);
  }, [tableData]);

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
        <FilterCard className="">
          <Col xs={8} xl={5}>
            <Input
              type={"text"}
              placeholder="ابحث حسب اسم الشركة أو الرمز"
              onChange={(e) => setCompanyFilter(e.target.value)}
              value={companyFilter}
              label={"الشركة"}
            />
          </Col>
          <Col xs={8} xl={5}>
            <InputSelect
              label={"القطاع"}
              placeholder="البحث عن قطاع"
              value={sectorFilter}
              options={[
                ...uniqueSectors.map((sector, index) => ({
                  value: sector,
                  label: sector,
                })),
              ]}
              onChange={(e) => setSectorFilter(e && e.value)}
              isSearchable={true}
            />
          </Col>
          <Col xs={8} xl={2} className="d-flex justify-content-center">
            <CustomButton
              variant="danger"
              text={"حذف"}
              onClick={() => {
                setSectorFilter("");
                setCompanyFilter("");
              }}
            />
          </Col>
        </FilterCard>

        <table
          {...getTableProps()}
          className="table table-striped table-borderless table-hover"
        >
          <thead>
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
                  {row.cells.map((cell, index) => {
                    const columnsToCheck = [5, 6]; // Define columns to check for color change

                    const isColored = columnsToCheck.includes(index); // Check if this column needs coloring
                    console.log(isColored);
                    const [symbol, name] = cell.value.split(" - ");
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={index}
                        className={
                          isColored
                            ? cell.value.includes("-")
                              ? "text-danger"
                              : "text-success"
                            : "text-black" // Black color for columns not in columnsToCheck
                        }
                      >
                        {index === 0 ? (
                          <Link
                            className="text-decoration-none"
                            to={`/companies/${row.original.sectorNameAr}/${symbol}/information`}
                            onClick={() => {
                              setSelectedStock({
                                value: symbol,
                                label: `${name} (${symbol})`,
                                sector: row.original.sectorNameAr,
                              });
                            }}
                          >
                            <span className="bg-light fw-bold ms-2">
                              {symbol}
                            </span>
                            <span>{name}</span>
                          </Link>
                        ) : (
                          cell.render("Cell")
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          <caption>
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
          </caption>
        </table>
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

export default StocksMainTable;
