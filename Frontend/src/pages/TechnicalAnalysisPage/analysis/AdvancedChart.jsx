import SelectionTabs from "components/routing/SelectionTabs";
import React, { useState } from "react";
import {
  Toolbar,
  ToolSeparator,
  ButtonTool,
  SelectTool,
  ModalTool,
} from "./Toolbar/Toolbar";
import { TbX, TbSearch } from "react-icons/tb";

const AdvancedChart = ({ symbol }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); // State to hold the selected option

  const handleModalClick = () => {
    setModalOpen(!modalOpen);
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption); // Update the selected option state
  };

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
  // Dummy data for the select options

  return (
    <div className="">
      <Toolbar>
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

            // Add more dummy data as needed
          ]}
          // defaultValue={"tx"}
        />
      </Toolbar>
      {/* <CustomDropdown
        hoverText={"HII"}

      /> */}

      {/* <SelectionTabs tabs={tabs} /> */}
    </div>
  );
};

export default AdvancedChart;
