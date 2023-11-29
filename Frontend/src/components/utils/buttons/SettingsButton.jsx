import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "./buttons.scss"; // Import the CSS file for styling

const SettingsButton = ({ text, icon: Icon, onClick, className, isActive }) => {
  return (
    <Button
      className={`p-2 bg-transparent settings-button text-grey border-0 fs-6  ${
        isActive ? "fw-bold" : ""
      }`}
      onClick={onClick}
    >
      {/* Render the icon if available */}
      {Icon && <Icon className="me-1 fs-4" />}
      <span>{text}</span>
    </Button>
  );
};

export default SettingsButton;
