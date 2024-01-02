import React, { useState } from "react";
import { motion } from "framer-motion";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { TbX } from "react-icons/tb";
import SettingsButton from "components/utils/buttons/SettingsButton";
import InputSelect from "components/utils/inputs/InputSelect";
import { Input } from "react-select/animated";
import CustomButton from "components/utils/buttons/CustomButton";

const IndicatorsSelection = ({ title, settings, setSettings }) => {
  const [selectedType, setSelectedType] = useState("");

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
              <div className="d-flex flex-column">
                {settings[selectedType]?.options?.map((option) => (
                  <div
                    key={option.value}
                    className="p-1 "
                    onClick={() =>
                      settings[selectedType].onSelectFunction(option.value)
                    }
                    style={{
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "lightgray";
                    }} // Change background color on hover
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "white";
                    }}
                  >
                    {option.label}
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

export default IndicatorsSelection;
