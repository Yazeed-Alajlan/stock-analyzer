// TabSelectorWithAnimation.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./SelectionTabs.scss";
import { Button, ButtonGroup, Row } from "react-bootstrap";

const SelectionTabs = ({ symbol, sector }) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const navigate = useNavigate();

  const tabs = [
    {
      id: 1,
      label: "معلومات السهم",
      route: `/companies/${sector}/${symbol}/information`,
    },
    { id: 2, label: "Tab 2", route: "" },
    { id: 3, label: "Tab 3", route: "" },
    { id: 4, label: "Tab 4", route: "" },
  ];

  const handleTabChange = (tabId, route) => {
    setSelectedTab(tabId);
    navigate(route);
  };

  const isRTL = true;
  const indicatorStyles = {
    width: `${100 / tabs.length}%`, // Set the width based on the number of tabs
    transform: `translateX(${isRTL ? -(selectedTab - 1) : selectedTab - 1}00%)`,
  };

  return (
    <Row className="d-flex justify-content-evenly ">
      <ButtonGroup className="d-flex p-0">
        {tabs.map((tab) => (
          <motion.div
            key={tab.id}
            style={{ flexBasis: "100%" }}
            className={`tab tab-button text-center w-100   ${
              selectedTab === tab.id ? "active" : ""
            }`}
            onClick={() => handleTabChange(tab.id, tab.route)}
            whileHover={{ scale: 1.1 }}
          >
            {tab.label}
          </motion.div>
        ))}
        <motion.div
          className="indicator"
          initial={false}
          animate={indicatorStyles}
        />
      </ButtonGroup>
    </Row>
  );
};

export default SelectionTabs;
