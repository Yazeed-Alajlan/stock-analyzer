import React, { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { Outlet, useParams } from "react-router-dom";

import { SidebarSelection } from "../components/SidebarSelection";
import axios from "axios";
const StockPage = () => {
  const [data, setData] = useState(null);

  const { symbol } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/stock?symbol=${symbol}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [symbol]);

  return (
    <Container>
      {}
      <Row>
        <Col sm={2}>
          <SidebarSelection />
        </Col>
        <Col sm={10}>
          <Outlet context={[data, symbol]} />
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
