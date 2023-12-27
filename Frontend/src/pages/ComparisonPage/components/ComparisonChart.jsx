import InputSelect from "components/utils/inputs/InputSelect";
import { useStocksData } from "contexts/StocksDataContext";
import React, { useEffect, useState } from "react";
import Chart2 from "./Chart";

const ComparisonChart = ({ stockFinancialData }) => {
  console.log(stockFinancialData[0]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const balanceSheetKeys =
    stockFinancialData[0]?.balanceSheet.length > 0
      ? Object.keys(stockFinancialData[0].balanceSheet[0]).slice(1)
      : [];
  const incomeSheetKeys =
    stockFinancialData[0]?.incomeSheet.length > 0
      ? Object.keys(stockFinancialData[0].incomeSheet[0]).slice(1)
      : [];
  const cashFlowKeys =
    stockFinancialData[0]?.cashFlow.length > 0
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

      {/* <Chart2 stockFinancialData={stockFinancialData} /> */}
    </div>
  );
};

export default ComparisonChart;
