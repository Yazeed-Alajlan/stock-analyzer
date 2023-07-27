import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import StockChart from "../components/StockChart";
import StockInformation from "../components/StockInformation";
import FinancialesChart from "../components/FinancialesChart";
import FinancialesTable from "../components/FinancialesTable";
const StockPage = () => {
  //   useEffect(() => {}, []);

  return (
    <Container>
      <Row>
        <Col>
          <StockInformation title={""} value={3} />
        </Col>

        <Col>
          <FinancialesChart />
        </Col>
      </Row>
      <Row className="mt-4 ">
        <Col xs={6}>{/* <StockChart /> */}</Col>
        <Col xs={8}>
          <FinancialesTable />
        </Col>
      </Row>
    </Container>
  );
};

export default StockPage;
