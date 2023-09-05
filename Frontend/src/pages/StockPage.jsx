import React, { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { Link, Outlet, useParams } from "react-router-dom";

import { SidebarSelection } from "../components/SidebarSelection";
import axios from "axios";
import SmCardInformaiton from "../components/utils/SmCardInformaiton";
const StockPage = () => {
  const [data, setData] = useState(null);

  const { symbol, sector } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/stock?symbol=${symbol}`
        );
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [symbol]);

  return (
    <Container>
      {data ? (
        <>
          <Row>
            <Container className="d-flex gap-2">
              <Link to={"/companies/all"}>Companies</Link>/
              <Link to={`/companies/${sector}`}>{sector}</Link>/
              <p>{data.tradingNameEn}</p>
            </Container>
          </Row>
          <Row>
            <Container className="d-flex flex-column">
              <h1>{data.companyNameEN}</h1>

              <Container className="d-flex gap-2">
                <SmCardInformaiton text={data.symbol} />
                <SmCardInformaiton text={data.tradingNameEn} />
                <SmCardInformaiton text={sector} />
              </Container>
            </Container>
          </Row>
        </>
      ) : (
        <p>loading</p>
      )}
      <Row className="my-5">
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
