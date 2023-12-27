import React, { useEffect, useState } from "react";
import PageLayout from "components/PageLayout";
import ComparisonTable from "./components/ComparisonTable";
import ComparisonChart from "./components/ComparisonChart";
import { useStocksData } from "contexts/StocksDataContext";
import InputSelect from "components/utils/inputs/InputSelect";
const ComparisonPage = () => {
  const { getStockFinancialData, stocksData } = useStocksData();
  const [selectedStocks, setSelectedStocks] = useState([]);
  const maxSelectedOptions = 4;
  const [stockFinancialData, setStockFinancialData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedDataPromises = selectedStocks.map(async (option) => {
          const symbol = option.value;
          const financialData = await getStockFinancialData(symbol);
          return financialData;
        });
        const fetchedData = await Promise.all(fetchedDataPromises);
        console.log(fetchedData);
        setStockFinancialData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (selectedStocks.length > 0) {
      fetchData();
    }
  }, [selectedStocks]);
  return (
    <PageLayout>
      <InputSelect
        isMulti
        options={
          stocksData &&
          stocksData
            .filter((stock) => {
              if (
                selectedStocks.length === 0 ||
                selectedStocks.every(
                  (selectedOption) =>
                    selectedOption.sector === stock.sectorNameEn
                )
              ) {
                return true;
              }
              return false;
            })
            .map((stock) => ({
              value: stock.symbol,
              label: `${stock.tradingNameAr} (${stock.symbol})`,
              sector: stock.sectorNameEn,
            }))
        }
        maxMenuHeight={200}
        value={selectedStocks}
        onChange={(selected) => {
          if (selected.length <= maxSelectedOptions) {
            setSelectedStocks(selected);
          }
        }}
      />
      {stockFinancialData && (
        <ComparisonChart stockFinancialData={stockFinancialData} />
      )}
      <ComparisonTable />
    </PageLayout>
  );
};

export default ComparisonPage;
