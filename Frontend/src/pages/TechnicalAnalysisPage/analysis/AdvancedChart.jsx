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
import IndicatorsList from "../IndicatorsList";
const AdvancedChart = () => {
  const navigate = useNavigate();

  const [stockPriceData, setStockPriceData] = useState();
  const { getStockPriceData, getIndicatorData } = useStocksData();
  const { selectedStock, selectedIndicators, setSelectedIndicators } =
    useTechnicalAnalysis();
  console.log(selectedIndicators);
  // Dummy data for the select options
  useEffect(() => {
    const fetchDataAndIndicators = async () => {
      try {
        if (selectedStock) {
          // Fetch stock data
          setStockPriceData(await getStockPriceData(selectedStock));

          // Update indicators based on selected stock
          const updatedIndicators = await Promise.all(
            selectedIndicators.map(async (indicator) => {
              const { name, stock } = indicator;
              console.log(name, selectedStock);
              const updatedValue = await getIndicatorData(selectedStock, name, {
                [name]: IndicatorsList[name],
              });

              return {
                ...indicator,
                lines: [
                  {
                    [name]: updatedValue,
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

    fetchDataAndIndicators();
  }, [selectedStock]);

  function transformIndicatorsToList(indicators) {
    return Object.keys(indicators).map((key) => ({
      value: key,
      label: indicators[key].name || key, // Use the full name if available, otherwise use the key
    }));
  }
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
        <ModalTool
          icon={TbSearch}
          hoverText="Modal"
          text={selectedStock}
          title={"Search"}
        >
          <div> Search for symbol</div>
        </ModalTool>
        <ToolSeparator />
        <SelectTool
          text="Indicators"
          options={transformIndicatorsToList(IndicatorsList)}
          onSelectFunction={async (indicatorName) => {
            const newIndicator = {
              name: indicatorName,
              pane: 1, // Assuming pane value increments for each new indicator
              params: IndicatorsList[indicatorName],
              lines: [
                {
                  [indicatorName]: await getIndicatorData(
                    selectedStock,
                    indicatorName,
                    { [indicatorName]: IndicatorsList[indicatorName] }
                  ),
                },
              ],
            };
            setSelectedIndicators((prevIndicators) => [
              ...prevIndicators,
              newIndicator,
            ]);
          }}
          hoverText={"Indicators"}
        />
        <ToolSeparator />
        <SelectTool
          options={[
            { value: "D", label: "1 Day" },
            { value: "W", label: "1 Week" },
            { value: "M", label: "1 Month" },
          ]}
          defaultValue={"D"}
          showValueAsText
          onSelectFunction={(value) => {
            console.log(value);
          }}
          hoverText={"Frame"}
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
