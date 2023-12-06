import React, { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import SidebarSelection from "./SidebarSelection";

import AdvancedChart from "./AdvancedChart";

const ResizableComponent = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("2222");

  const handleRowClick = (symbol) => {
    setSelectedSymbol(symbol);
    // Do whatever you need with the selected symbol in the parent component
  };

  return (
    <div>
      <PanelGroup direction="horizontal" className="d-flex flex-row-reverse">
        <Panel minSizePercentage={80}>
          {selectedSymbol ? (
            <>
              <AdvancedChart symbol={selectedSymbol} />
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
          <SidebarSelection onRowClick={handleRowClick} />
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default ResizableComponent;
