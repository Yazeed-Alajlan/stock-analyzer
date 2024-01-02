import SelectionTabs from "components/routing/SelectionTabs";
import React, { useEffect, useState } from "react";
import {
  Toolbar,
  ToolSeparator,
  ButtonTool,
  SelectTool,
  ModalTool,
  CehckBoxTool,
} from "./Toolbar/Toolbar";
import {
  TbChartHistogram,
  TbSearch,
  TbHome,
  TbPencil,
  TbChartCandle,
  TbFlag,
} from "react-icons/tb";
import { useStocksData } from "contexts/StocksDataContext";
import CandlestickAndIndicatorsChart from "./CandlestickAndIndicatorsChart";
import { useNavigate } from "react-router-dom";
import { useTechnicalAnalysis } from "contexts/TechnicalAnalysisContext";
import IndicatorsList from "../IndicatorsList";
import IndicatorsSelection from "./IndicatorsSelection";
import PatternsSelection from "./PatternsSelection";
import candlestick_patterns from "../candlestickPatterns";
const AdvancedChart = () => {
  const navigate = useNavigate();

  const [stockPriceData, setStockPriceData] = useState();
  const [markers, setMarkers] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const { getStockPriceData, getIndicatorData } = useStocksData();
  const {
    selectedStock,
    selectedIndicators,
    setSelectedIndicators,
    japaneseCandlestickMarkers,
  } = useTechnicalAnalysis();
  const [indicatorsSettings, setIndicatorsSettings] = useState({
    Indicators: {
      icon: TbChartHistogram,
      onSelectFunction: async (indicatorName) => {
        const newIndicator = {
          name: indicatorName,
          pane: indicatorName === "SMA" || indicatorName === "EMA" ? 0 : 1,
          params: IndicatorsList[indicatorName],
          lines: [
            await getIndicatorData(selectedStock, indicatorName, {
              [indicatorName]: IndicatorsList[indicatorName],
            }),
          ],
        };
        console.log(newIndicator);
        setSelectedIndicators((prevIndicators) => [
          ...prevIndicators,
          newIndicator,
        ]);
      },
      options: transformIndicatorsToList(IndicatorsList),
    },
  });
  const [patternsSettings, setPatternsSettings] = useState({
    "Japanese Candlestick": {
      icon: TbChartCandle,
      onSelectFunction: async (pattern) => {
        console.log(pattern);
      },
      options: transformIndicatorsToList(candlestick_patterns),
    },
    "Flags and Pennants": {
      icon: TbFlag,
      onSelectFunction: async (pattern) => {
        console.log(pattern);
      },
      // options: transformIndicatorsToList(candlestick_patterns),
    },
  });

  useEffect(() => {
    const fetchDataAndIndicators = async () => {
      try {
        if (selectedStock) {
          setStockPriceData(await getStockPriceData(selectedStock));
          const updatedIndicators = await Promise.all(
            selectedIndicators.map(async (indicator) => {
              const { name, stock } = indicator;
              console.log(name, selectedStock);
              const updatedValue = await getIndicatorData(selectedStock, name, {
                [name]: IndicatorsList[name],
              });
              return {
                ...indicator,
                lines: [updatedValue],
              };
            })
          );
          setSelectedIndicators(updatedIndicators);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataAndIndicators();
  }, [selectedStock]);

  function transformIndicatorsToList(indicators) {
    return Object.keys(indicators).map((key) => ({
      value: key,
      label: indicators[key].name || key,
    }));
  }
  const handleCheckboxChange = async (event) => {
    setIsChecked(event.target.checked);
    if (event.target.checked) {
      setMarkers(await japaneseCandlestickMarkers(selectedStock));
    } else {
      setMarkers([]);
    }
  };
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

        <ModalTool
          icon={TbChartHistogram}
          hoverText="Indicators"
          text={"Indicators"}
          title={"Indicators"}
          size={"lg"}
        >
          <IndicatorsSelection
            title={"Filter Data"}
            settings={indicatorsSettings}
            setSettings={setIndicatorsSettings}
          />
        </ModalTool>
        <ToolSeparator />
        <ModalTool
          icon={TbPencil}
          hoverText="Patterns"
          text={"Patterns"}
          title={"Patterns"}
          size={"lg"}
        >
          <CehckBoxTool
            isChecked={isChecked}
            text={"candle"}
            onCheckboxChange={handleCheckboxChange}
          />
          <PatternsSelection
            title={"Filter Data"}
            settings={patternsSettings}
            setSettings={setPatternsSettings}
          />
        </ModalTool>

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
          markers={markers}
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
