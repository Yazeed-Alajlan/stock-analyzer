import React, { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { Link, Outlet, useParams } from "react-router-dom";
import { SidebarSelection } from "../../components/routing/SidebarSelection";
import {
  TbInfoCircle,
  TbBook,
  TbChartHistogram,
  TbReportMoney,
  TbDeviceAnalytics,
} from "react-icons/tb";

import SmCardInformaiton from "components/utils/cards/SmCardInformaiton";
import StockPriceCard from "./components/utils/StockPriceCard";
import { useStocksData } from "contexts/StocksDataContext";
import PageLayout from "components/PageLayout";
const StockPage = () => {
  const { symbol, sector } = useParams();

  const [stockInformationData, setStockInformationData] = useState();
  const [stockFinancialData, setStockFinancialData] = useState();
  const { getStockFinancialData, getStockInformationData } = useStocksData();

  const myRoutes = [
    {
      path: "information",
      icon: TbInfoCircle,
      name: "معلومات السهم",
      to: `/companies/${sector}/${symbol}/information`,
    },
    {
      path: "financials",
      icon: TbBook,
      name: "القوائم المالية",
      to: `/companies/${sector}/${symbol}/financials`,
    },
    {
      path: "chart",
      icon: TbChartHistogram,
      name: "تحركات السهم",
      to: `/companies/${sector}/${symbol}/chart`,
    },
    {
      path: "dividend",
      icon: TbReportMoney,
      name: "التوزيعات",
      to: `/companies/${sector}/${symbol}/dividend`,
    },
    {
      path: "analysis",
      icon: TbDeviceAnalytics,
      name: "تحليل",
      to: `/companies/${sector}/${symbol}/analysis`,
    },
  ];

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
    <PageLayout>
      {stockInformationData ? (
        <Row className="pb-4 border-bottom border-2">
          <Col xs={"12"} lg={"8"}>
            <Row>
              <Container className="d-flex gap-2">
                <Link className="text-decoration-none" to={"/companies/all"}>
                  الشركات
                </Link>
                /
                <Link
                  className="text-decoration-none"
                  to={`/companies/${sector}`}
                >
                  {sector}
                </Link>
                /<p>{stockInformationData.tradingNameAr}</p>
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
            <StockPriceCard
              open={
                stockInformationData.summary[
                  stockInformationData.summary.length - 1
                ].open
              }
              close={
                stockInformationData.summary[
                  stockInformationData.summary.length - 1
                ].close
              }
              low={
                stockInformationData.summary[
                  stockInformationData.summary.length - 1
                ].low
              }
              high={
                stockInformationData.summary[
                  stockInformationData.summary.length - 1
                ].high
              }
            />
          </Col>
        </Row>
      ) : (
        <p>loading</p>
      )}

      <Row className="pt-4">
        <Col sm={2}>
          <SidebarSelection routes={myRoutes} />
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
