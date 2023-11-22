import React, { useState } from "react";
import CustomButton from "./CustomButton";

const ButtonsGroup = ({
  buttons,
  label,
  icon,
  parentState,
  parentSetState,
}) => {
  const [selectedButton, setSelectedButton] = useState(1);

  const handleButtonClick = (buttonId) => {
    setSelectedButton(buttonId);
    parentSetState(buttonId);
  };

  return (
    <div className="d-flex  align-items-center gap-4">
      {label || icon != null ? (
        <p className="fs-5 my-auto me-2">
          <span> {label}</span>
          <span> {icon}</span>
        </p>
      ) : (
        <></>
      )}
      {buttons.map((button) => (
        <div className="d-flex">
          <CustomButton
            title={button.title}
            icon={button.icon}
            onClick={() => handleButtonClick(button.id)}
            variant={
              selectedButton === button.id ? "primary" : "outline-primary"
            }
          />
        </div>
      ))}
    </div>
  );
};

export default ButtonsGroup;
