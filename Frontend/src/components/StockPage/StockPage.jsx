import React, { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { Link, Outlet, useParams } from "react-router-dom";

import { SidebarSelection } from "../SidebarSelection";
import axios from "axios";
import SmCardInformaiton from "../utils/SmCardInformaiton";
import StockPriceCard from "./utils/StockPriceCard";
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [symbol]);

  return (
    <Container>
      {data ? (
        <Row className="pb-4 border-bottom border-2">
          <Col xs={"8"}>
            <Row>
              <Container className="d-flex gap-2">
                <Link to={"/companies/all"}>الشركات</Link>/
                <Link to={`/companies/${sector}`}>{sector}</Link>/
                <p>{data.tradingNameAr}</p>
              </Container>
            </Row>
            <Row>
              <Container className="d-flex flex-column">
                <h1>{data.companyNameAR}</h1>

                <Container className="d-flex gap-2">
                  <SmCardInformaiton
                    title={"اسم التداول"}
                    text={data.tradingNameAr}
                  />
                  <SmCardInformaiton title={"رمز التداول"} text={data.symbol} />
                  <SmCardInformaiton title={"القطاع"} text={sector} />
                </Container>
              </Container>
            </Row>
          </Col>
          <Col className="d-flex  align-items-center" xs={"4"}>
            <StockPriceCard open={32} change={0.05} changePercentage={0.16} />
          </Col>
        </Row>
      ) : (
        <p>loading</p>
      )}
      <Row className="pt-4">
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
