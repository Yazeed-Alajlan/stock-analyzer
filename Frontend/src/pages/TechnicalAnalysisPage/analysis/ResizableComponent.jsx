import React, { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import SidebarSelection from "./SidebarSelection";
import ChartPatterns from "../components/ChartPatterns";
import CandlestickAndIndicatorsChart from "./CandlestickAndIndicatorsChart";
import { useStocksData } from "contexts/StocksDataContext";
import { CustomCard } from "components/utils/cards/CustomCard";

const ResizableComponent = () => {
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [stockPriceData, setStockPriceData] = useState();
  const [selectedIndicators, setSelectedIndicators] = useState();
  const { getStockPriceData, getIndicatorData } = useStocksData();
  const handleRowClick = (symbol) => {
    setSelectedSymbol(symbol);
    // Do whatever you need with the selected symbol in the parent component
  };
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        if (selectedSymbol) {
          setStockPriceData(await getStockPriceData(selectedSymbol));
          setSelectedIndicators(await getIndicatorData(selectedSymbol, "vsa"));
        }
      } catch (error) {
        // Handle any errors if the promise rejects
        console.error("Error fetching data:", error);
      }
    };

    fetchStockData();
  }, [selectedSymbol]);
  return (
    <div dir="ltr">
      <PanelGroup direction="horizontal">
        <Panel minSizePercentage={80}>
          {stockPriceData ? (
            <CustomCard>
              <CandlestickAndIndicatorsChart
                series={stockPriceData}
                indcators={selectedIndicators}
                symbol={selectedSymbol}
              />
            </CustomCard>
          ) : (
            <>SELECT STOCK</>
          )}

          {/* {<ChartPatterns symbol={selectedSymbol} />} */}
        </Panel>
        <PanelResizeHandle className="bg-dark" style={{ width: "4px" }} />

        <Panel defaultSizePercentage={20} minSizePercentage={10}>
          <SidebarSelection onRowClick={handleRowClick} />
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default ResizableComponent;
