import React, { useState, useEffect } from "react";
import {
  Dropdown,
  FormControl,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

export default function CustomDropdown({
  options,
  defaultValues,
  value,
  showSearch,
  icon: Icon,
  hoverText,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let selected = defaultValues || value || "";
    if (selected) {
      const defaultValue = options.find((option) => option.value === selected);
      if (defaultValue) {
        setSelectedValue(defaultValue);
      }
    }
  }, [options, defaultValues, value]);

  const handleSelectChange = (newValue) => {
    setSelectedValue(newValue);
    setIsOpen(false);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderTooltip = (props) => (
    <Tooltip id="dropdown-tooltip" {...props}>
      {hoverText}
    </Tooltip>
  );

  return (
    <Dropdown show={isOpen} onToggle={(isOpen) => setIsOpen(isOpen)}>
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="dropdown-info-tooltip">{hoverText}</Tooltip>}
      >
        <Dropdown.Toggle variant="primary">
          {Icon && <Icon />}{" "}
          {selectedValue ? selectedValue.label : "Select a State"}
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
              style={{
                backgroundColor:
                  selectedValue && selectedValue.value === option.value
                    ? "lightblue"
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
