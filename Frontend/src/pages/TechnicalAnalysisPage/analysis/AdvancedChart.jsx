import SelectionTabs from "components/routing/SelectionTabs";
import React, { useEffect, useState } from "react";
import {
  Toolbar,
  ToolSeparator,
  ButtonTool,
  SelectTool,
  ModalTool,
} from "./Toolbar/Toolbar";
import { TbX, TbSearch, TbHome } from "react-icons/tb";
import { useStocksData } from "contexts/StocksDataContext";
import CandlestickAndIndicatorsChart from "./CandlestickAndIndicatorsChart";
import { CustomCard } from "components/utils/cards/CustomCard";
import { useNavigate } from "react-router-dom";

const AdvancedChart = ({ symbol }) => {
  const navigate = useNavigate();

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
          const indicators = [
            {
              name: "macd",
              pane: 1,
              values: [
                {
                  vas: await getIndicatorData(symbol, "vsa"),
                },
                {
                  ema_21: await getIndicatorData(symbol, "vsa"),
                },
              ],
            },
            {
              name: "vsa",
              pane: 2,
              values: [
                {
                  vas: await getIndicatorData(symbol, "vsa"),
                },
              ],
            },
          ];
          console.log(indicators);
          setStockPriceData(await getStockPriceData(symbol));
          setSelectedIndicators(indicators);
          console.log(await getIndicatorData(symbol, "vsa"));
        }
      } catch (error) {
        // Handle any errors if the promise rejects
        console.error("Error fetching data:", error);
      }
    };

    fetchStockData();
  }, [symbol]);
  return (
    <div className="d-flex flex-column" style={{ height: "100vh" }}>
      <Toolbar>
        <ButtonTool
          icon={TbHome}
          hoverText="Home"
          onClick={() => {
            console.log("hi");
            navigate("/");
          }}
        />
        <ToolSeparator />

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
      <div id="responsive-chart" className="h-100 jdakd">
        <CandlestickAndIndicatorsChart
          series={stockPriceData}
          indcators={selectedIndicators}
          symbol={symbol}
        />
      </div>

      {/* <SelectionTabs tabs={tabs} /> */}
    </div>
  );
};

export default AdvancedChart;
