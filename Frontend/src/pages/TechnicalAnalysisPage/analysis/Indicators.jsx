import IconButton from "components/utils/buttons/IconButton";
import React, { useState } from "react";
import { ListGroup } from "react-bootstrap";
import { TbX, TbSettings } from "react-icons/tb";

const Indicators = ({ indicators, onDelete }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  console.log(indicators);
  // Check if indicators exist and are not empty
  if (!indicators || indicators.length === 0) {
    return <></>; // Display a message or a default component
  }

  return (
    <div className=" d-flex flex-column align-items-start ">
      {indicators.map((indicator, index) => (
        <div
          key={index}
          className={`d-inline-flex flex-row-reverse gap-2 align-items-center  border ${
            hoverIndex === index ? "border-primary" : "border-transparent "
          } rounded p-2`}
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <div>{indicator.name}</div>
          <div
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
              onClick={() => onDelete(indicator.name, indicator.pane, index)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Indicators;
