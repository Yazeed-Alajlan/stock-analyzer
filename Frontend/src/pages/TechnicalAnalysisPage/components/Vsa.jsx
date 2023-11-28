import { CustomCard } from "components/utils/cards/CustomCard";
import React from "react";
import CandlestickAndIndicatorsChart from "../analysis/CandlestickAndIndicatorsChart";
import { useStocksData } from "contexts/StocksDataContext";

const Vsa = () => {
  const { getStockPriceData, getIndicatorData } = useStocksData();

  return (
    <CustomCard>
      <CandlestickAndIndicatorsChart
        series={getStockPriceData("4321")}
        indcators={getIndicatorData("4321", "vsa")}
        symbol={"4321"}
      />
    </CustomCard>
  );
};

export default Vsa;
