import React, { useState } from "react";
import CustomButton from "./CustomButton";

const Tabs = ({ children, activeTab }) => {
  const [active, setActive] = useState(activeTab || 1);

  const changeTab = (tab) => {
    setActive(tab);
  };

  const tabElements = [];
  const filterElements = [];

  React.Children.forEach(children, (child, index) => {
    if (React.isValidElement(child) && child.type.name === "Tab") {
      const { text, icon } = child.props;
      tabElements.push(
        <CustomButton
          key={index}
          text={text}
          icon={icon}
          onClick={() => changeTab(index + 1)}
          variant={active === index + 1 ? "primary" : "outline-primary"}
        >
          {child}
        </CustomButton>
      );
    } else {
      filterElements.push(child);
    }
  });

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between">
        <div className="d-flex flex-wrap align-items-center align-content-center gap-4">
          {tabElements}
        </div>
        {filterElements}
      </div>
      {/* Load Tab Content */}
      <div className="tab-content mt-4">
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            if (
              React.isValidElement(child) &&
              child.type.name === "ButtonsGroup"
            )
              return null;
            return React.cloneElement(child, {
              isActive: index + 1 === active,
            });
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Tabs;
