import CompnentLayout from "components/CompnentLayout";
import PageLayout from "components/PageLayout";
import { CustomCard } from "components/utils/cards/CustomCard";
import FilterCard from "components/utils/inputs/FilterCard";
import InputSelect from "components/utils/inputs/InputSelect";
import { useStocksData } from "contexts/StocksDataContext";
import MonthlyReturnTable from "pages/StockPage/components/price_summary/MonthlyReturnTable";
import React, { useState } from "react";

const MonthlyReturns = () => {
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
    <PageLayout>
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
          <MonthlyReturnTable symbols={selectedStock.value} />
        ) : (
          <p>select stock</p>
        )}
      </CustomCard>
    </PageLayout>
  );
};

export default MonthlyReturns;
