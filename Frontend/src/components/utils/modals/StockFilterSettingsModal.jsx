import React, { useState } from "react";
import { Modal as BootstrapModal } from "react-bootstrap";
import { motion } from "framer-motion";
import IconButton from "../buttons/IconButton";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Input from "../inputs/Input";
import InputSelect from "../inputs/InputSelect";
import SettingsButton from "../buttons/SettingsButton";
import { TbX } from "react-icons/tb";
import CustomButton from "../buttons/CustomButton";

const StockFilterSettingsModal = ({
  title,
  isModalOpen,
  setIsModalOpen,
  settings,
}) => {
  const [selectedType, setSelectedType] = useState("");
  const [inputValues, setInputValues] = useState({}); // State to store input values

  const handleTypeSelection = (type) => {
    setSelectedType(type);
    const defaultValues = {}; // Store default values for the selected type
    // Set default values based on the selected filtration type
    settings[type].options.forEach((option) => {
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
    // Invoke the onSave method for the selected setting
    if (
      selectedType &&
      settings[selectedType] &&
      settings[selectedType].onSave
    ) {
      settings[selectedType].onSave();
    }
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
        <BootstrapModal.Header>
          <BootstrapModal.Title>{title}</BootstrapModal.Title>
          <IconButton
            onClick={() => setIsModalOpen((isModalOpen) => !isModalOpen)}
            icon={TbX}
          />
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          <PanelGroup direction="horizontal">
            <Panel defaultSizePercentage={25} minSizePercentage={20}>
              {/* Left panel for filtration type selection */}
              <div className="d-flex flex-column">
                {Object.keys(settings).map((type) => (
                  <SettingsButton
                    text={type}
                    key={type}
                    onClick={() => handleTypeSelection(type)}
                    isActive={type === selectedType}
                    icon={settings[type].icon}
                  >
                    {type}
                  </SettingsButton>
                ))}
              </div>
            </Panel>
            <PanelResizeHandle
              className="bg-dark-light mx-3"
              style={{ width: "3px" }}
            />
            <Panel minSizePercentage={70}>
              {/* Right panel for displaying filtration options */}
              <div>
                {/* Display options based on the selected filtration type */}
                {selectedType && (
                  <div>
                    {settings[selectedType].options.map((option) => (
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
          <CustomButton
            text={"Cancel"}
            variant={"danger"}
            onClick={() => setIsModalOpen((isModalOpen) => !isModalOpen)}
          />
          <CustomButton text={"Save"} onClick={handleSubmit} />
        </BootstrapModal.Footer>
      </motion.div>
    </BootstrapModal>
  );
};

export default StockFilterSettingsModal;
