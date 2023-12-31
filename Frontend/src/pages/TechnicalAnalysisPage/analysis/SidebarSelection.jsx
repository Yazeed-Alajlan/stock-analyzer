import React, { useEffect, useState } from "react";
import { useTable, useSortBy } from "react-table";
import { useStocksData } from "contexts/StocksDataContext";
import CustomButton from "components/utils/buttons/CustomButton";
import IconButton from "components/utils/buttons/IconButton";
import { TbFilter, TbFilterOff } from "react-icons/tb";
import { useTechnicalAnalysis } from "contexts/TechnicalAnalysisContext";
import { TbArrowMergeBoth, TbChartCandle } from "react-icons/tb";
import candlestick_patterns from "pages/TechnicalAnalysisPage/candlestickPatterns";
import StockFilterSettingsModal from "components/utils/modals/StockFilterSettingsModal";
import StocksTable from "./StocksTable";

const SidebarSelection = () => {
  const { stocksData } = useStocksData();
  const {
    filteredStocks,
    setFilteredStocks,
    selectedStock,
    setSelectedStock,
    consolidatingStocksFilter,
    japaneseCandlestickFilter,
  } = useTechnicalAnalysis();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);

  const [settings, setSettings] = useState({
    "Consolidating Stocks": {
      // icon: TbArrowMergeBoth, // Add the icon for this category
      onSave: consolidatingStocksFilter,
      options: [
        {
          name: "numberOfCandles",
          label: "عدد الشموع",
          type: "number",
          placeholder: "حدد عدد الشموع",
          defaultValue: "14",
        },
        {
          name: "percentageRange",
          label: "نسبة النطاق",
          type: "number",
          placeholder: "حدد نسبة النطاق",
          defaultValue: 2.5,
        },
      ],
    },
    "Japanese Candlestick": {
      icon: TbChartCandle, // Add the icon for this category (assuming TbX is an icon component)
      onSave: japaneseCandlestickFilter,

      options: [
        {
          isSelect: true,
          name: "pattern",
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
    setSelectedStock(symbol);
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

  return (
    <div className="d-flex flex-column" style={{ height: "100vh" }}>
      <div className="filters d-flex justify-content-between">
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
      <StocksTable
        data={data}
        columns={[
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
        ]}
        handleRowClick={handleRowClick}
      />
    </div>
  );
};

export default SidebarSelection;
