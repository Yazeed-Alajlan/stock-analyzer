// Tool.js
import IconButton from "components/utils/buttons/IconButton";
import React from "react";

const Tool = ({ icon, hoverText, onClick }) => {
  return (
    <IconButton
      icon={icon}
      hoverText={hoverText}
      onClick={onClick}
      size="sm" // Define the size here or pass it as a prop when using Tool component
    />
  );
};

export default Tool;
