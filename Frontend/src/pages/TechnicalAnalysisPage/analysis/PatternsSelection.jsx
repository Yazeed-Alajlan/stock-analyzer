import React, { useState } from "react";
import { motion } from "framer-motion";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import SettingsButton from "components/utils/buttons/SettingsButton";

const PatternsSelection = ({ title, settings, setSettings }) => {
  const [selectedType, setSelectedType] = useState("");

  const handleClick = async (selectedType) => {
    // Do something with selectedType and inputValues
    console.log(selectedType);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ type: "spring", duration: 0.5 }}
    >
      <PanelGroup direction="horizontal">
        <Panel defaultSizePercentage={25} minSizePercentage={20}>
          <div className="d-flex flex-column">
            {Object.keys(settings).map((type) => (
              <SettingsButton
                text={type}
                key={type}
                onClick={() => setSelectedType(type)}
                isActive={type === selectedType}
                icon={settings[type].icon}
              >
                {type}
              </SettingsButton>
            ))}
          </div>
        </Panel>
        <PanelResizeHandle
          className="bg-dark-light mx-2"
          style={{ width: "3px" }}
        />
        <Panel minSizePercentage={70}>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {selectedType && (
              <div>
                {settings[selectedType].options.map((option) => (
                  <div
                    key={option.value}
                    className="d-flex align-items-center border-0 border-bottom  gap-2"
                  >
                    <input
                      type="checkbox"
                      id={`checkbox_${option.value}`} // Assign a unique id for each checkbox
                      onChange={() =>
                        settings[selectedType].onSelectFunction(option.value)
                      }
                    />
                    <label htmlFor={`checkbox_${option.value}`}>
                      {/* Use label tag for text associated with the checkbox */}
                      <div className="flex-grow-1">{option.label}</div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>
      </PanelGroup>
    </motion.div>
  );
};

export default PatternsSelection;
