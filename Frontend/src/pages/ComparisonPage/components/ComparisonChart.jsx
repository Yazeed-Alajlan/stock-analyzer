import React, { useState, useEffect } from "react";
import DynamicChart from "components/utils/charts/DynamicChart";
import InputSelect from "components/utils/inputs/InputSelect";

const ComparisonChart = ({ stockFinancialData }) => {
  console.log(stockFinancialData);
  const balanceSheetKeys =
    stockFinancialData[0].balanceSheet.length > 0
      ? Object.keys(stockFinancialData[0].balanceSheet[0]).slice(1)
      : [];
  const incomeSheetKeys =
    stockFinancialData[0].incomeSheet.length > 0
      ? Object.keys(stockFinancialData[0].incomeSheet[0]).slice(1)
      : [];
  const cashFlowKeys =
    stockFinancialData[0].cashFlow.length > 0
      ? Object.keys(stockFinancialData[0].cashFlow[0]).slice(1)
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
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    let result = {};

    if (selectedOptions.length > 0) {
      selectedOptions.forEach((option) => {
        result[option.label] = []; // Initialize an array for each option

        stockFinancialData.forEach((dataItem) => {
          dataItem[option.groupLabel].forEach((item) => {
            let obj = {
              year: item["year"],
              value: item[option.value], // Changed to option.value for the correct property access
            };

            result[option.label].push(obj); // Push object into the respective option's array
          });
        });
      });
      console.log(result);
      setChartData(result);
    } else {
      setChartData([]);
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
        defaultValue={selectedOptions}
      />
      {chartData && <DynamicChart data={chartData} />}
    </div>
  );
};

export default ComparisonChart;
