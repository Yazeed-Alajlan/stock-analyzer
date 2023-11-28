import React, { useState } from "react";
import { Modal as BootstrapModal } from "react-bootstrap";
import { motion } from "framer-motion";
import { TbX } from "react-icons/tb";
import IconButton from "../buttons/IconButton";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import InputSelect from "../inputs/InputSelect";
import Input from "../inputs/Input";

const FilterStocksModal = ({
  title,
  isModalOpen,
  setIsModalOpen,
  setFilteredStocksData,
}) => {
  const [selectedType, setSelectedType] = useState("");
  const [inputValues, setInputValues] = useState({});

  const filtrationData = {
    "Consolidating Stocks": (
      <>
        <Input
          label="Option 1"
          type="text"
          value={inputValues["option1"] || ""}
          onChange={(value) => handleInputChange("option1", value)}
        />
        <Input
          label="Option 2"
          type="number"
          value={inputValues["option2"] || ""}
          onChange={(value) => handleInputChange("option2", value)}
        />
        {/* Add more Input components as needed */}
      </>
    ),
    "Japanese Candlestick": (
      <>
        <Input
          label="Option 3"
          type="text"
          value={inputValues["option3"] || ""}
          onChange={(value) => handleInputChange("option3", value)}
        />
        <InputSelect
          label="Option 4"
          options={[
            { value: "A", label: "Option A" },
            { value: "B", label: "Option B" },
            // Add more options as needed
          ]}
          selectedOption={inputValues["option4"]}
          onChange={(value) => handleInputChange("option4", value)}
        />
        {/* Add more components as needed */}
      </>
    ),
    // Add other types similarly
  };

  const handleTypeSelection = (type) => {
    setSelectedType(type);
    setInputValues({});
  };

  const handleInputChange = (name, value) => {
    console.log(value.target.value);
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Selected Type:", selectedType);
    console.log("Input Values:", inputValues);
  };

  return (
    <BootstrapModal
      show={isModalOpen}
      onHide={() => setIsModalOpen((isModalOpen) => !isModalOpen)}
      centered
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <BootstrapModal.Header className="border-bottom-4">
          <BootstrapModal.Title>{title}</BootstrapModal.Title>
          <IconButton
            onClick={() => setIsModalOpen((isModalOpen) => !isModalOpen)}
            icon={TbX}
          />
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          <PanelGroup direction="horizontal">
            <Panel defaultSizePercentage={20} minSizePercentage={10}>
              {/* Left panel for filtration type selection */}
              <div className="d-flex flex-column">
                {Object.keys(filtrationData).map((type) => (
                  <span key={type} onClick={() => handleTypeSelection(type)}>
                    {type}
                  </span>
                ))}
              </div>
            </Panel>
            <PanelResizeHandle className="bg-dark" style={{ width: "4px" }} />
            <Panel minSizePercentage={70}>
              {/* Right panel for displaying filtration options */}
              <div>
                {/* Display options based on the selected filtration type */}
                {selectedType && filtrationData[selectedType]}
              </div>
            </Panel>
          </PanelGroup>
        </BootstrapModal.Body>
        <BootstrapModal.Footer>
          {/* Submit button */}
          <button onClick={handleSubmit}>Submit</button>
        </BootstrapModal.Footer>
      </motion.div>
    </BootstrapModal>
  );
};

export default FilterStocksModal;
