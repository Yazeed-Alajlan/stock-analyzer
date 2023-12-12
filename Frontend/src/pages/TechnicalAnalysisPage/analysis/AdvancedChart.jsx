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
import { useNavigate } from "react-router-dom";
import { useTechnicalAnalysis } from "contexts/TechnicalAnalysisContext";

const AdvancedChart = () => {
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
  const { getStockPriceData, getIndicatorData } = useStocksData();
  const { selectedStock, selectedIndicators, setSelectedIndicators } =
    useTechnicalAnalysis();
  // Dummy data for the select options
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        // if (selectedStock) {
        //   setStockPriceData(await getStockPriceData(selectedStock));
        //   setSelectedIndicators([]);
        // }
        if (selectedStock) {
          setStockPriceData(await getStockPriceData(selectedStock));

          // Update indicators for the new selectedStock
          const updatedIndicators = await Promise.all(
            selectedIndicators.map(async (indicator) => {
              const newData = await getIndicatorData(
                selectedStock,
                indicator.name
              );
              return {
                ...indicator,
                lines: [
                  {
                    [indicator.name]: newData,
                  },
                ],
              };
            })
          );
          setSelectedIndicators(updatedIndicators);
        }
      } catch (error) {
        // Handle any errors if the promise rejects
        console.error("Error fetching data:", error);
      }
    };

    fetchStockData();
  }, [selectedStock]);
  return (
    <div className="d-flex flex-column" style={{ height: "100vh" }}>
      <Toolbar>
        <ButtonTool
          icon={TbHome}
          hoverText="Home"
          onClick={() => {
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
          text={selectedStock}
          title={"Search"}
        >
          <div> aksdkadlsdksdlak</div>
        </ModalTool>
        <ToolSeparator />

        <SelectTool
          options={[
            { value: "EMA", label: "Exponential Moving Average" },
            { value: "SMA", label: "Simple Moving Average" },
          ]}
          onSelectFunction={async (value) => {
            console.log("hi");
            console.log(value);
            const newIndicator = {
              name: value.value,
              pane: 0, // Assuming pane value increments for each new indicator
              lines: [
                {
                  [value.value]: await getIndicatorData(
                    selectedStock,
                    value.value
                  ),
                },
              ],
            };
            console.log(newIndicator);
            setSelectedIndicators((prevIndicators) => [
              ...prevIndicators,
              newIndicator,
            ]);
          }}
        />
      </Toolbar>
      <div id="responsive-chart" className="h-100 ">
        <CandlestickAndIndicatorsChart
          series={stockPriceData}
          indicators={selectedIndicators}
          selectedStock={selectedStock}
          symbol={selectedStock}
        />
      </div>

      {/* <SelectionTabs tabs={tabs} /> */}
    </div>
  );
};

export default AdvancedChart;
