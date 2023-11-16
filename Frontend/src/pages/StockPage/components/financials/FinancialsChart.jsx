import InputSelect from "components/utils/InputSelect";
import React, { useState, useEffect } from "react";
import DynamicChart from "components/utils/DynamicChart";

const FinancialsChart = ({ stockFinancialData }) => {
  const balanceSheetKeys =
    stockFinancialData.balanceSheet.length > 0
      ? Object.keys(stockFinancialData.balanceSheet[0]).slice(1)
      : [];
  const incomeSheetKeys =
    stockFinancialData.incomeSheet.length > 0
      ? Object.keys(stockFinancialData.incomeSheet[0]).slice(1)
      : [];
  const cashFlowKeys =
    stockFinancialData.cashFlow.length > 0
      ? Object.keys(stockFinancialData.cashFlow[0]).slice(1)
      : [];

  const groupedOptions = [
    {
      label: "incomeSheet",
      options: incomeSheetKeys.map((key) => ({ value: key, label: key })),
    },
    {
      label: "cashFlow",
      options: cashFlowKeys.map((key) => ({ value: key, label: key })),
    },
    {
      label: "balanceSheet",
      options: balanceSheetKeys.map((key) => ({ value: key, label: key })),
    },
  ];

  // State to hold the selected options and chart data
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    let result = {};

    if (selectedOptions.length > 0) {
      selectedOptions.forEach((option) => {
        result[option.label] = []; // Initialize an array for each option

        stockFinancialData[option.groupLabel].forEach((item) => {
          let obj = {
            year: item["year"],
            value: item[option.value], // Changed to option.value for the correct property access
          };

          result[option.label].push(obj); // Push object into the respective option's array
        });
      });
      setChartData(result);
    }
  }, [selectedOptions, stockFinancialData]);

  const handleSelectChange = (selected) => {
    const optionsWithGroupLabel = selected.map((opt) => ({
      ...opt,
      groupLabel: groupedOptions.find((group) =>
        group.options.some((grpOpt) => grpOpt.value === opt.value)
      ).label,
    }));
    setSelectedOptions(optionsWithGroupLabel);
  };

  return (
    <div>
      <InputSelect
        options={groupedOptions}
        isMulti={true}
        onChange={handleSelectChange}
        value={selectedOptions}
      />
      <DynamicChart data={chartData} />
    </div>
  );
};

export default FinancialsChart;
