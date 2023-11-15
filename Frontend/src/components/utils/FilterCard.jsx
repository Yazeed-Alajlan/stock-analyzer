import React from "react";

import CompnentLayout from "components/CompnentLayout";
import { Row } from "react-bootstrap";
import { CustomCard } from "./CustomCard";

const FilterCard = ({ className, children }) => {
  return (
    <CustomCard>
      <Row
        className={`d-flex align-items-center align-content-center py-3 ${className}`}
      >
        {children}
      </Row>
    </CustomCard>
  );
};

export default FilterCard;
