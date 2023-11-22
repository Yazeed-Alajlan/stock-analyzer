// Tab.js
import React from "react";

const Tab = ({ children, isActive }) => {
  return (
    <div style={{ display: isActive ? "block" : "none" }}>
      <span>{children}</span>
    </div>
  );
};

export default Tab;
