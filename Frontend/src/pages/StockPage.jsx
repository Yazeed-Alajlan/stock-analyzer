import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import { Routes, Route, Link, Outlet, useParams } from "react-router-dom";

import { SidebarSelection } from "../components/SidebarSelection";
const StockPage = () => {
  const { symbol } = useParams();

  return (
    <Container>
      {symbol}
      <Row>
        <Col xs={6}>
          <Outlet />
        </Col>{" "}
        <Col xs={6}>
          <SidebarSelection />
          {/* <FinancialesChart /> */}
        </Col>
      </Row>
    </Container>
  );
};

export default StockPage;

// <Row className="mt-4 ">
//   <Col xs={6}>{/* <StockChart /> */}</Col>
//   <Col xs={8}>
//     <FinancialesTable />
//   </Col>
// </Row>;
