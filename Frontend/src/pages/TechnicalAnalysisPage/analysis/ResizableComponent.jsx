import React, { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import SidebarSelection from "./SidebarSelection";

import AdvancedChart from "./AdvancedChart";
import { useTechnicalAnalysis } from "contexts/TechnicalAnalysisContext";

const ResizableComponent = () => {
  const { selectedStock } = useTechnicalAnalysis();

  return (
    <div dir="ltr">
      <PanelGroup direction="horizontal" className="d-flex ">
        <Panel minSizePercentage={80}>
          {selectedStock ? (
            <>
              <AdvancedChart />
            </>
          ) : (
            <>SELECT STOCK</>
          )}
        </Panel>
        <PanelResizeHandle className="bg-dark-light" style={{ width: "4px" }} />

        <Panel
          collapsible={true}
          collapsedSizePixels={20}
          minSizePercentage={15}
        >
          <SidebarSelection />
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default ResizableComponent;
