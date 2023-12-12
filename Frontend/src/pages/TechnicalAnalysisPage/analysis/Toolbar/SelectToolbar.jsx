import React, { useState, useEffect } from "react";
import {
  Dropdown,
  FormControl,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

export default function SelectToolbar({
  options,
  defaultValue,
  value,
  text,
  icon: Icon,
  hoverText,
  showSearch,
  showValueAsText,
  onSelectFunction,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [hoveredOption, setHoveredOption] = useState(null);

  useEffect(() => {
    let selected = defaultValue || value || "";
    if (selected) {
      const defaultValue = options.find((option) => option.value === selected);
      if (defaultValue) {
        setSelectedValue(defaultValue);
      }
    }
  }, [options, defaultValue, value]);

  const handleSelectChange = (newValue) => {
    setSelectedValue(newValue);
    onSelectFunction(newValue);
    setIsOpen(false);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Dropdown show={isOpen} onToggle={(isOpen) => setIsOpen(isOpen)}>
      <OverlayTrigger
        trigger={["hover", "hover"]}
        placement="bottom"
        overlay={
          hoverText ? <Tooltip id="tooltip">{hoverText}</Tooltip> : <></>
        }
      >
        <Dropdown.Toggle
          className="text-center text-grey fw-bolder m-2 p-2 border-0"
          variant="outline-dark-light"
        >
          {text}
          {Icon && <Icon />}
          {"Indicators"}
          {/* {selectedValue ? selectedValue.label : "Select a State"} */}
        </Dropdown.Toggle>
      </OverlayTrigger>
      <Dropdown.Menu>
        {showSearch && (
          <FormControl
            autoFocus
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        )}
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          {filteredOptions.map((option) => (
            <Dropdown.Item
              key={option.value}
              onClick={() => handleSelectChange(option)}
              onMouseEnter={() => setHoveredOption(option.value)}
              onMouseLeave={() => setHoveredOption(null)}
              style={{
                backgroundColor:
                  selectedValue && selectedValue.value === option.value
                    ? "lightgray"
                    : hoveredOption === option.value
                    ? "lightgray"
                    : "transparent",
              }}
            >
              {option.label}
            </Dropdown.Item>
          ))}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}
