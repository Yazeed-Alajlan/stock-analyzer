import React, { useEffect, useState } from "react";
import { useTable, useSortBy } from "react-table";
import { useStocksData } from "contexts/StocksDataContext";
import CustomButton from "components/utils/buttons/CustomButton";
import IconButton from "components/utils/buttons/IconButton";
import { TbFilter, TbFilterOff } from "react-icons/tb";
import SettingsModal from "components/utils/modals/SettingsModal";
import { useTechnicalAnalysis } from "contexts/TechnicalAnalysisContext";
import { TbX } from "react-icons/tb";
import candlestick_patterns from "pages/TechnicalAnalysisPage/candlestickPatterns";
import StockFilterSettingsModal from "components/utils/modals/StockFilterSettingsModal";

const SidebarSelection = ({ onRowClick }) => {
  const { stocksData } = useStocksData();
  const { filteredStocks, setFilteredStocks } = useTechnicalAnalysis();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [data, setData] = useState([]);

  const [settings, setSettings] = useState({
    "Consolidating Stocks": {
      icon: TbX, // Add the icon for this category
      onSave: () => {
        console.log("Save clicked for Japanese Candlestick");
      },
      options: [
        {
          name: "option1",
          label: "عدد الشموع",
          type: "number",
          placeholder: "حدد عدد الشموع",
          defaultValue: "14",
        },
        {
          name: "option2",
          label: "نسبة النطاق",
          type: "number",
          placeholder: "حدد نسبة النطاق",
          defaultValue: 2.5,
        },
      ],
    },
    "Japanese Candlestick": {
      icon: TbX, // Add the icon for this category (assuming TbX is an icon component)
      options: [
        {
          isSelect: true,
          name: "option3",
          label: "Option 3",
          // defaultValue: "CDL2CROWS",
          type: "text",
          options: Object.entries(candlestick_patterns).map(([key, value]) => ({
            value: key,
            label: value,
          })),
        },
      ],
    },
  });

  const handleRowClick = (symbol) => {
    onRowClick(symbol);
  };
  useEffect(() => {
    if (filteredStocks) {
      const filteredSymbols = Object.keys(filteredStocks);
      const filteredData = stocksData.filter((item) =>
        filteredSymbols.includes(item.symbol)
      );

      setData(filteredData);
    } else {
      setData(stocksData || []);
    }
  }, [filteredStocks, stocksData]);
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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);
  return (
    <div className="d-flex flex-column align-items-center">
      <div className="d-flex  justify-contnet-between">
        <IconButton
          icon={TbFilter}
          hoverText={"Filter Stocks"}
          onClick={() => setIsModalOpen(true)}
        />

        <IconButton
          icon={TbFilterOff}
          hoverText={"Delete Filters"}
          onClick={() => setFilteredStocks("")}
        />
      </div>

      <StockFilterSettingsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title={"Filter Data"}
        settings={settings}
        setSettings={setSettings}
      />

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
