import SelectionTabs from "components/routing/SelectionTabs";
import React, { useState } from "react";
import { Toolbar, Tool } from "./Toolbar";
import { TbX } from "react-icons/tb";
import InputSelect from "components/utils/inputs/InputSelect";
import CustomDropdown from "./Dropdown";

const AdvancedChart = () => {
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
    <div className="d-flex">
      <CustomDropdown
        hoverText={"HII"}
        options={[
          { value: "ny", label: "New York" },
          { value: "ca", label: "California" },
          { value: "tx", label: "Texas" },
          // Add more dummy data as needed
        ]}
        // defaultValues={"ca"}
      />

      <Toolbar>
        <Tool
          icon={TbX}
          hoverText="Tool 1"
          onClick={() => console.log("Tool 1 clicked")}
        />
      </Toolbar>
      <SelectionTabs tabs={tabs} />
    </div>
  );
};

export default AdvancedChart;
