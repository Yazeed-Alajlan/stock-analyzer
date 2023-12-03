import React from "react";
import { Container } from "react-bootstrap";

const CompnentLayout = ({ children }) => {
  return (
    <Container className="CompnentLayout p-2" fluid>
      {children}
    </Container>
  );
};

export default CompnentLayout;
