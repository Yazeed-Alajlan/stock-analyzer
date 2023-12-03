import SelectionTabs from "components/routing/SelectionTabs";
import React, { useEffect, useState } from "react";
import {
  Toolbar,
  ToolSeparator,
  ButtonTool,
  SelectTool,
  ModalTool,
} from "./Toolbar/Toolbar";
import { TbX, TbSearch } from "react-icons/tb";
import { useStocksData } from "contexts/StocksDataContext";
import CandlestickAndIndicatorsChart from "./CandlestickAndIndicatorsChart";
import { CustomCard } from "components/utils/cards/CustomCard";

const AdvancedChart = ({ symbol }) => {
  const tabs = [
    {
      id: 1,
      name: "معلومات السهم",
      to: ``,
    },
    { id: 2, name: "Tab 2", to: "" },
    { id: 3, name: "Tab 3", to: "" },
    { id: 4, name: "Tab 4", to: `` },
  ];
  const [stockPriceData, setStockPriceData] = useState();
  const [selectedIndicators, setSelectedIndicators] = useState();
  const { getStockPriceData, getIndicatorData } = useStocksData();
  // Dummy data for the select options
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        if (symbol) {
          setStockPriceData(await getStockPriceData(symbol));
          setSelectedIndicators(await getIndicatorData(symbol, "vsa"));
        }
      } catch (error) {
        // Handle any errors if the promise rejects
        console.error("Error fetching data:", error);
      }
    };

    fetchStockData();
  }, [symbol]);
  return (
    <div className="adksl;als;kd">
      <Toolbar>
        <ButtonTool
          icon={TbX}
          hoverText="Tool 1"
          onClick={() => console.log("Tool 1 clicked")}
        />
        <ToolSeparator />
        <ModalTool
          icon={TbSearch}
          hoverText="Modal"
          text={symbol}
          title={"Search"}
        >
          <div> aksdkadlsdksdlak</div>
        </ModalTool>
        <ToolSeparator />

        <SelectTool
          options={[
            { value: "ny", label: "New York" },
            { value: "ca", label: "California" },
            { value: "tx", label: "Texas" },
          ]}
        />
      </Toolbar>
      <CandlestickAndIndicatorsChart
        series={stockPriceData}
        indcators={selectedIndicators}
        symbol={symbol}
      />
      {/* <SelectionTabs tabs={tabs} /> */}
    </div>
  );
};

export default AdvancedChart;
