import React, { useState } from "react";
import CustomButton from "./CustomButton";

const ButtonsGroup = ({
  buttons,
  label,
  icon,
  parentState,
  parentSetState,
}) => {
  const [selectedButton, setSelectedButton] = useState(0);

  const handleButtonClick = (buttonId, buttonName) => {
    setSelectedButton(buttonId);
    parentSetState(buttonName ? buttonName : buttonId);
  };

  console.log(selectedButton);
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
      {buttons.map((button, index) => (
        <div className="d-flex">
          <CustomButton
            text={button.text}
            icon={button.icon}
            onClick={() => handleButtonClick(index, button.name)}
            variant={selectedButton === index ? "primary" : "outline-primary"}
          />
        </div>
      ))}
    </div>
  );
};

export default ButtonsGroup;
