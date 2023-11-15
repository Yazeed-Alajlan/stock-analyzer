import InputSelect from "components/utils/InputSelect";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

const FinancialsChart = () => {
  const { stockFinancialData } = useOutletContext();
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

  // State to hold the selected options
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectChange = (selected) => {
    const optionsWithGroupLabel = selected.map((opt) => ({
      ...opt,
      groupLabel: groupedOptions.find((group) =>
        group.options.some((grpOpt) => grpOpt.value === opt.value)
      ).label,
    }));
    console.log(optionsWithGroupLabel[0].groupLabel);
    setSelectedOptions(optionsWithGroupLabel);
    console.log(stockFinancialData[optionsWithGroupLabel[0].groupLabel]);
  };

  return (
    <div>
      <InputSelect
        options={groupedOptions}
        isMulti={true}
        onChange={handleSelectChange}
        value={selectedOptions}
      />
    </div>
  );
};

export default FinancialsChart;
