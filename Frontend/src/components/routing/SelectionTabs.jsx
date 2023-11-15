// TabSelectorWithAnimation.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./SelectionTabs.scss";
import { ButtonGroup, Row } from "react-bootstrap";

const SelectionTabs = ({ tabs }) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const navigate = useNavigate();

  const handleTabChange = (tabId, route) => {
    setSelectedTab(tabId);
    navigate(route);
  };

  const isRTL = true;
  const indicatorStyles = {
    width: `${100 / tabs.length}%`, // Set the width based on the number of tabs
    transform: `translateX(${isRTL ? -(selectedTab - 1) : selectedTab - 1}00%)`,
  };

  // const tabs = [
  //   {
  //     id: 1,
  //     name: "معلومات السهم",
  //     icon: FaMoneyBillAlt,
  //     to: `/companies/${sector}/${symbol}/information`,
  //   },
  //   { id: 2, name: "Tab 2", to: "" },
  //   { id: 3, name: "Tab 3", to: "" },
  //   { id: 4, name: "Tab 4", to: `/companies/${sector}/${symbol}/dividend` },
  // ];

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
            onClick={() => handleTabChange(tab.id, tab.to)}
            whileHover={{ scale: 1.1 }}
          >
            {tab.name}
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
