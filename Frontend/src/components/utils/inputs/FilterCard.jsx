import React from "react";

import CompnentLayout from "components/CompnentLayout";
import { Row } from "react-bootstrap";
import { CustomCard } from "../cards/CustomCard";

const FilterCard = ({ className, children }) => {
  return (
    <CustomCard>
      <Row
        className={`d-flex justify-content-evenly align-items-center align-content-center px-1 py-3 ${className}`}
      >
        {children}
      </Row>
    </CustomCard>
  );
};

export default FilterCard;
