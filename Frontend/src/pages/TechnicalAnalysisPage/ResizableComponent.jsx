import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import SidebarSelection from "./SidebarSelection";

const ResizableComponent = () => {
  return (
    <PanelGroup direction="horizontal">
      <Panel defaultSizePercentage={30} minSizePercentage={20}>
        left
      </Panel>
      <PanelResizeHandle style={{ width: "4px" }} />
      <Panel minSizePercentage={30}>middle</Panel>
      <PanelResizeHandle />
      <Panel defaultSizePercentage={30} minSizePercentage={20}>
        right
      </Panel>
    </PanelGroup>
  );
};

export default ResizableComponent;
