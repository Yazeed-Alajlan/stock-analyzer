import React from "react";

import CompnentLayout from "components/CompnentLayout";
import { Row } from "react-bootstrap";
import { CustomCard } from "./CustomCard";

const FilterCard = ({ children }) => {
  return (
    <CustomCard>
      <Row className="d-flex align-items-center align-content-center border-2 border-bottom pb-4">
        {children}
      </Row>
    </CustomCard>
  );
};

export default FilterCard;
