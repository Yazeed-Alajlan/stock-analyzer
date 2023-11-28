import React, { useState } from "react";
import { Modal as BootstrapModal } from "react-bootstrap";
import { motion } from "framer-motion";
import { TbX } from "react-icons/tb";
import IconButton from "../buttons/IconButton";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Input from "../inputs/Input";
import InputSelect from "../inputs/InputSelect";
import candlestick_patterns from "pages/TechnicalAnalysisPage/candlestickPatterns";
import { useTechnicalAnalysis } from "contexts/TechnicalAnalysisContext";

const FilterStocksModal = ({
  title,
  isModalOpen,
  setIsModalOpen,
  setFilteredStocksData,
}) => {
  const { getConsolidatingStocks } = useTechnicalAnalysis();

  const [selectedType, setSelectedType] = useState("");
  const [inputValues, setInputValues] = useState({}); // State to store input values
  const filtrationData = {
    "Consolidating Stocks": [
      {
        name: "option1",
        label: "عدد الشموع",
        type: "number",
        placeholder: "حدد عدد الشموع",
        defaultValue: "14",
      },
      {
        name: "option2",
        label: "نسبة النطاق",
        type: "number",
        placeholder: "حدد نسبة النطاق",
        defaultValue: 2.5,
      },
    ],
    "Japanese Candlestick": [
      {
        isSelect: true,
        name: "option3",
        label: "Option 3",
        type: "text",
        options: Object.entries(candlestick_patterns).map(([key, value]) => ({
          value: key,
          label: value,
        })),
      },
    ],
  };

  const handleTypeSelection = (type) => {
    setSelectedType(type);
    const defaultValues = {}; // Store default values for the selected type
    // Set default values based on the selected filtration type
    filtrationData[type].forEach((option) => {
      defaultValues[option.name] = option.defaultValue || ""; // Use defaultValue or an empty string if not provided
    });

    setInputValues(defaultValues); // Set default values for the selected type
  };

  const handleInputChange = (name, value) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Do something with selectedType and inputValues
    console.log("Selected Type:", selectedType);
    console.log("Input Values:", inputValues);
    await getConsolidatingStocks(inputValues.option1, inputValues.option2);
    setIsModalOpen((isModalOpen) => !isModalOpen);
  };

  return (
    <BootstrapModal
      show={isModalOpen}
      onHide={() => setIsModalOpen((isModalOpen) => !isModalOpen)}
      centered
      className="modal-xl"
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
              <div className="d-flex flex-column gap-4 text-center">
                {Object.keys(filtrationData).map((type) => (
                  <span
                    key={type}
                    onClick={() => handleTypeSelection(type)}
                    className={`p-2 rounded cursor-pointer ${
                      selectedType === type
                        ? "bg-secondary text-light"
                        : "bg-light"
                    }`}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </Panel>
            <PanelResizeHandle
              className="bg-dark mx-3"
              style={{ width: "4px" }}
            />
            <Panel minSizePercentage={70}>
              {/* Right panel for displaying filtration options */}
              <div>
                {/* Display options based on the selected filtration type */}
                {selectedType && (
                  <div>
                    {filtrationData[selectedType].map((option) => (
                      <div key={option.name}>
                        {option.isSelect ? (
                          <>
                            <InputSelect
                              label={option.label}
                              onChange={(e) => {
                                console.log(e);
                                handleInputChange(option.name, e.value);
                              }}
                              options={option.options}
                              value={inputValues[option.name] || ""}
                              placeholder={option.placeholder}
                            />
                          </>
                        ) : (
                          <>
                            <Input
                              type={option.type}
                              label={option.label}
                              onChange={(e) =>
                                handleInputChange(option.name, e.target.value)
                              }
                              value={
                                inputValues[option.name] || option.defaultValue
                              }
                              placeholder={option.placeholder}
                              max={option.max}
                              min={option.min}
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
