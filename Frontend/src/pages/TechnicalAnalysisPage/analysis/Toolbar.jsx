import IconButton from "components/utils/buttons/IconButton";
import InputSelect from "components/utils/inputs/InputSelect";
import React from "react";

const Tool = ({ icon, hoverText, onClick, children }) => {
  return (
    <span>
      <IconButton
        icon={icon}
        hoverText={hoverText}
        onClick={onClick}
        size="sm" // Define the size here or pass it as a prop when using Tool component
      />
      {children}
    </span>
  );
};

const Toolbar = ({ children }) => {
  const handleToolClick = (toolId) => {
    console.log(`Tool ${toolId} clicked`);
    // Add your logic here for the clicked tool
  };

  return (
    <div className="toolbar">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          onClick: () => handleToolClick(index + 1),
        })
      )}
    </div>
  );
};

export { Toolbar, Tool };
