import React, { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { Link, Outlet, useParams } from "react-router-dom";
import { SidebarSelection } from "./components/SidebarSelection";
import axios from "axios";
import SmCardInformaiton from "components/utils/SmCardInformaiton";
import StockPriceCard from "./components/StockPriceCard";
import { useStocksData } from "contexts/StocksDataContext";
import { CustomChart } from "components/utils/CustomChart";
import MonthlyReturnTable from "./components/MonthlyReturnTable";
import SelectionTabs from "./components/SelectionTabs";
import PageLayout from "components/PageLayout";
const StockPage = () => {
  const { symbol, sector } = useParams();

  const [stockInformationData, setStockInformationData] = useState();
  const [stockFinancialData, setStockFinancialData] = useState();
  const { getStockFinancialData, getStockInformationData } = useStocksData();
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(await getStockInformationData(symbol));
        setStockInformationData(await getStockInformationData(symbol));
        setStockFinancialData(await getStockFinancialData(symbol));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [symbol]);

  return (
    <PageLayout>
      {stockInformationData ? (
        <Row className="pb-4 border-bottom border-2">
          <Col xs={"12"} lg={"8"}>
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
          <Col className="my-auto" xs={"12"} lg={"4"}>
            <StockPriceCard open={32} change={0.05} changePercentage={0.16} />
          </Col>
        </Row>
      ) : (
        <p>loading</p>
      )}
      <SelectionTabs symbol={symbol} sector={sector} />

      <Row className="pt-4">
        <Col sm={2}>
          <SidebarSelection />
        </Col>
        <Col sm={10}>
          <Outlet
            context={{ stockInformationData, stockFinancialData, symbol }}
          />
        </Col>
      </Row>
    </PageLayout>
  );
};

export default StockPage;
