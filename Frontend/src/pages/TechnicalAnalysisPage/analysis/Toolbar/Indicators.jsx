import IconButton from "components/utils/buttons/IconButton";
import IndicatorSettingsModal from "components/utils/modals/IndicatorSettingsModal";
import React, { useState } from "react";
import { ListGroup } from "react-bootstrap";
import { TbX, TbSettings } from "react-icons/tb";
import IndicatorsList from "../../utils/IndicatorsList";

const Indicators = ({ indicators, onDelete }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [showModalIndex, setShowModalIndex] = useState(null);

  // Check if indicators exist and are not empty
  if (!indicators || indicators.length === 0) {
    return <></>; // Display a message or a default component
  }

  const handleToggleModal = (index) => {
    setShowModalIndex(showModalIndex === index ? null : index);
  };

  return (
    <div className=" d-flex flex-column  align-items-start ">
      {indicators.map((indicator, index) => (
        <div
          key={index}
          className={`d-inline-flex  gap-4 align-items-center rounded p-1  border ${
            hoverIndex === index ? "border-primary" : "border-transparent "
          } `}
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <span>{indicator.name}</span>
          <span
            style={{
              opacity: hoverIndex === index ? 1 : 0,
              transition: "opacity 0.3s",
            }}
          >
            <IconButton
              icon={TbX}
              size={"sm"}
              onClick={() => onDelete(indicator.name, indicator.pane, index)}
            />
            <IconButton
              icon={TbSettings}
              size={"sm"}
              onClick={() => handleToggleModal(index)}
            />

            <IndicatorSettingsModal
              key={index} // Ensure each modal has a unique key
              indicatorName={indicator.name}
              indicator={indicator}
              showModal={showModalIndex === index}
              handleClose={() => setShowModalIndex(null)}
            />
          </span>
        </div>
      ))}
    </div>
  );
};

export default Indicators;
