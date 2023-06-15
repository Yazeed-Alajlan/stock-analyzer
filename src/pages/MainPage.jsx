import React, { useEffect, useState } from "react";
import InformationCard from "../components/InformationCard";
import StockChart from "../components/StockChart";
import { Row, Col, Container } from "react-bootstrap";
import axios from "axios";
const MainPage = () => {
  const [price, setLastPrice] = useState(-1);
  const [priceTime, setLastPriceTime] = useState(null);
  var SYMBOL = "AAPL";

  async function getPriceData(symbol) {
    const proxyUrl = "http://cors-anywhere.herokuapp.com/";
    //https://query1.finance.yahoo.com/v10/finance/quoteSummary/AAPL?modules=earnings
    const stockUrl = `${proxyUrl}https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=incomeStatementHistory`;
    const stockUrl2 = `https://query1.finance.yahoo.com/v10/finance/earnings/${symbol}`;
    const startDate = "2023-01-01";
    const endDate = "2023-12-31";
    console.log(`https://finance.yahoo.com/calendar/earnings?day=${startDate}`);
    const response = await fetch(stockUrl2);
    return response.json();
  }
  useEffect(() => {
    let timeoutId;
    async function getLastPrice() {
      try {
        const data = await getPriceData(SYMBOL);
        console.log(data);
        // const res = data.chart.result[0].meta;
        // const value = res.regularMarketPrice.toFixed(2);
        // const time = new Date(res.regularMarketTime * 1000);
        // setLastPrice(value);
        // setLastPriceTime(time);
        // // timeoutId = setTimeout(getLastPrice, 5000);

        // console.log(value);
        // console.log(time.toLocaleTimeString());
      } catch (error) {
        console.log(error);
      }
    }
    getLastPrice();
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <InformationCard />
        </Col>
        <Col>
          <InformationCard />
        </Col>
        <Col>
          <InformationCard />
        </Col>
      </Row>
      <Row className="mt-4 ">
        {/* <Col xs={8}>
          <StockChart />
        </Col> */}
        <Col xs={4}>
          <InformationCard />
        </Col>
      </Row>
    </Container>
  );
};

export default MainPage;
