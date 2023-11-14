import CompnentLayout from "components/CompnentLayout";
import { CustomCard } from "components/utils/CustomCard";
import FilterCard from "components/utils/FilterCard";
import InputSelect from "components/utils/InputSelect";
import { useStocksData } from "contexts/StocksDataContext";
import React, { useState } from "react";
import ChartPatterns from "./ChartPatterns";

const TechnicalAnalysisAutomation = () => {
  const { stocksData } = useStocksData();
  const [selectedStock, setSelectedStock] = useState();

  const handleStockSelect = (selectedOption) => {
    if (selectedOption.value != null) {
      setSelectedStock(selectedOption);
    } else {
      setSelectedStock("");
    }
  };
  return (
    <CompnentLayout>
      <FilterCard>
        <InputSelect
          label={"السهم:"}
          placeholder="البحث عن شركة"
          value={selectedStock}
          options={
            stocksData &&
            stocksData.map((stock) => ({
              value: stock.symbol,
              label: `${stock.tradingNameAr} (${stock.symbol})`,
              sector: stock.sectorNameAr,
            }))
          }
          onChange={handleStockSelect}
          isSearchable={true}
        />
      </FilterCard>
      <CustomCard>
        {selectedStock && selectedStock != null ? (
          <ChartPatterns symbol={selectedStock.value} />
        ) : (
          <p>select stock</p>
        )}
      </CustomCard>
    </CompnentLayout>
  );
};

export default TechnicalAnalysisAutomation;
