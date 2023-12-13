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
                indicator.name,
                14
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
            { value: "RSI", label: "Relative Strength Index" },
            // { value: "MACD", label: "Moving average convergence/divergence " },
          ]}
          onSelectFunction={async (indicatorName) => {
            console.log(indicatorName);
            const newIndicator = {
              name: indicatorName,
              pane: 1, // Assuming pane value increments for each new indicator
              lines: [
                {
                  [indicatorName]: await getIndicatorData(
                    selectedStock,
                    indicatorName
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
    </div>
  );
};

export default AdvancedChart;

//  const indicators = [
//    {
//      name: "SMA-EMA",
//      pane: 0,
//      lines: [
//        {
//          vas: await getIndicatorData(selectedStock, "SMA"),
//          color: "#fff",
//        },
//        {
//          ema_21: await getIndicatorData(selectedStock, "EMA"),
//          color: "#bbb",
//        },
//      ],
//    },

//    {
//      name: "SMA",

//      pane: 0,
//      lines: [
//        {
//          vas: await getIndicatorData(selectedStock, "SMA"),
//          color: "#ccc",
//        },
//      ],
//    },

//    {
//      name: "EMA",
//      pane: 1,
//      lines: [
//        {
//          vas: await getIndicatorData(selectedStock, "EMA"),
//          color: "#009999",
//        },
//      ],
//    },
//    {
//      name: "EMA",
//      pane: 2,
//      lines: [
//        {
//          vas: await getIndicatorData(selectedStock, "EMA"),
//          color: "#ff0000",
//        },
//      ],
//    },
//  ];
