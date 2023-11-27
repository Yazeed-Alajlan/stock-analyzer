import React, { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import SidebarSelection from "./SidebarSelection";
import ChartPatterns from "../components/ChartPatterns";
import CandlestickAndIndicatorsChart from "./CandlestickAndIndicatorsChart";
import { useStocksData } from "contexts/StocksDataContext";

const ResizableComponent = () => {
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const { getStockPriceData, getIndicatorData } = useStocksData();

  const handleRowClick = (symbol) => {
    setSelectedSymbol(symbol);
    // Do whatever you need with the selected symbol in the parent component
  };
  return (
    <div dir="ltr">
      <PanelGroup direction="horizontal">
        <Panel minSizePercentage={80}>
          <CandlestickAndIndicatorsChart
            series={getStockPriceData(selectedSymbol)}
            indcators={getIndicatorData(selectedSymbol, "vsa")}
            symbol={selectedSymbol}
          />
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
