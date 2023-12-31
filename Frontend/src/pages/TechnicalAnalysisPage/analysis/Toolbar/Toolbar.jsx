import IconButton from "components/utils/buttons/IconButton";
import InputSelect from "components/utils/inputs/InputSelect";
import GlobalModal from "components/utils/modals/GlobalModal";
import React, { useState } from "react";
import SelectToolbar from "./SelectToolbar";

const Tool = ({ icon, text, hoverText, onClick, children }) => {
  return (
    <>
      <IconButton
        icon={icon}
        hoverText={hoverText}
        onClick={onClick}
        text={text}
      />
      {children}
    </>
  );
};
const ToolSeparator = () => {
  return (
    <span>
      <div className="mx-2 fs-1 vr"></div>
    </span>
  );
};

const ButtonTool = ({ icon, text, hoverText, onClick, children }) => {
  return (
    <span>
      <Tool icon={icon} hoverText={hoverText} onClick={onClick} text={text} />
      {children}
    </span>
  );
};
const CehckBoxTool = ({ text, onClick, isChecked, onCheckboxChange }) => {
  return (
    <span>
      <label>
        {text}
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onCheckboxChange}
        />
      </label>
    </span>
  );
};

const SelectTool = ({
  icon,
  text,
  hoverText,
  onClick,
  options,
  defaultValue,
  children,
  onSelectFunction,
  showValueAsText,
}) => {
  return (
    <span>
      {/* <Tool icon={icon} hoverText={hoverText} onClick={onClick} text={text} /> */}
      <SelectToolbar
        options={options}
        defaultValue={defaultValue}
        onSelectFunction={onSelectFunction}
        text={text}
        hoverText={hoverText}
        icon={icon}
        showValueAsText={showValueAsText}
      />

      {children}
    </span>
  );
};

const ModalTool = ({
  icon,
  text,
  hoverText,
  title,
  onClick,
  size,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <span>
      <Tool
        icon={icon}
        hoverText={hoverText}
        onClick={() => setIsOpen((isModalOpen) => !isModalOpen)}
        text={text}
      />
      <GlobalModal
        isModalOpen={isOpen}
        setIsModalOpen={setIsOpen}
        title={title}
        size={size}
      >
        {children}
      </GlobalModal>
    </span>
  );
};

const Toolbar = ({ children }) => {
  const handleToolClick = (toolId) => {
    console.log(`Tool ${toolId} clicked`);
    // Add your logic here for the clicked tool
  };

  return (
    <div className="toolbar d-flex justify-content-center align-content-center align-items-center flex-wrap border-bottom p-0 border-3">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child)
      )}
    </div>
  );
};

export {
  Toolbar,
  ToolSeparator,
  ButtonTool,
  CehckBoxTool,
  SelectTool,
  ModalTool,
};
