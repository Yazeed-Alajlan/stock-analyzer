import React, { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { Link, Outlet, useParams } from "react-router-dom";
import { SidebarSelection } from "./utils/SidebarSelection";
import axios from "axios";
import SmCardInformaiton from "../utils/SmCardInformaiton";
import StockPriceCard from "./utils/StockPriceCard";
import { useStocksData } from "../../contexts/StocksDataContext";

const StockPage = () => {
  const { symbol, sector } = useParams();

  const [stockInformationData, setStockInformationData] = useState();
  const [stockFinancialData, setStockFinancialData] = useState();
  const { getStockFinancialData, getStockInformationData } = useStocksData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStockInformationData(await getStockInformationData(symbol));
        setStockFinancialData(await getStockFinancialData(symbol));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [symbol]);

  return (
    <Container>
      {stockInformationData ? (
        <Row className="pb-4 border-bottom border-2">
          <Col xs={"8"}>
            <Row>
              <Container className="d-flex gap-2">
                <Link to={"/companies/all"}>الشركات</Link>/
                <Link to={`/companies/${sector}`}>{sector}</Link>/
                <p>{stockInformationData.tradingNameAr}</p>
              </Container>
            </Row>
            <Row>
              <Container className="d-flex flex-column gap-4">
                <h1>{stockInformationData.companyNameAR}</h1>

                <Container className="d-flex gap-4">
                  <SmCardInformaiton
                    title={"اسم التداول"}
                    text={stockInformationData.tradingNameAr}
                  />
                  <SmCardInformaiton
                    title={"رمز التداول"}
                    text={stockInformationData.symbol}
                  />
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
          <Outlet
            context={[stockInformationData, stockFinancialData, symbol]}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default StockPage;
