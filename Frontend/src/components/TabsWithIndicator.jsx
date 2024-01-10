// TabsWithIndicator.js
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CustomCard } from "./utils/cards/CustomCard";

const tabContentVariants = {
  initial: {
    y: 10,
    opacity: 0,
  },
  enter: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: -10,
    opacity: 0,
  },
};

const TabsWithIndicator = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const handleClick = (e, tab) => {
    e.preventDefault();
    setActiveTab(tab);
  };

  const isSelected = (tab) => activeTab.name === tab.name;

  return (
    <CustomCard className="tabs-container">
      <div className="d-flex gap-2 my-2">
        {tabs.map((tab) => (
          <div
            key={tab.name}
            className={`position-relative cursor-pointer ${
              isSelected(tab) ? "selected" : ""
            }`}
          >
            <div
              onClick={(e) => handleClick(e, tab)}
              className="pb-1 d-block"
              style={{
                color: isSelected(tab) ? "#535bf2" : "#ccc",
              }}
            >
              {tab.label}
            </div>
            {isSelected(tab) && (
              <AnimatePresence>
                <motion.div
                  layoutId="indicator"
                  className="indicator"
                  style={{
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    right: "0",
                    height: "1px",
                    backgroundColor: "#535bf2",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </AnimatePresence>
            )}
          </div>
        ))}
      </div>

      <div className="tab-content bg-light">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab.name || "empty"}
            variants={tabContentVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            transition={{
              duration: 0.3,
            }}
          >
            {activeTab && activeTab.render()}
          </motion.div>
        </AnimatePresence>
      </div>
    </CustomCard>
  );
};

export default TabsWithIndicator;
