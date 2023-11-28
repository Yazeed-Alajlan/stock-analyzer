import axios from "axios";
import CompnentLayout from "components/CompnentLayout";
import PageLayout from "components/PageLayout";
import CustomButton from "components/utils/buttons/CustomButton";
import { CustomCard } from "components/utils/cards/CustomCard";
import FilterCard from "components/utils/inputs/FilterCard";
import Input from "components/utils/inputs/Input";
import CandlestickChart from "pages/StockPage/components/chart/CandlestickChart";
import React, { useEffect, useState, useRef } from "react";
import { Col } from "react-bootstrap";

const ConsolidatingStocks = () => {
  const [data, setData] = useState({});
  const [numberOfCandles, setNumberOfCandles] = useState(14);
  const [percentageRange, setPercentageRange] = useState(2.5);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const url = `http://localhost:5000/python-api/consolidating-stocks`;
  //       const response = await axios.get(url);

  //       setData(response.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const fetchData = async () => {
    if (numberOfCandles && percentageRange) {
      console.log(numberOfCandles);
      console.log(percentageRange);
      try {
        const url = `http://localhost:5000/python-api/consolidating-stocks?numberOfCandles=${numberOfCandles}&percentageRange=${percentageRange}`;
        const response = await axios.get(url);

        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      console.log("no data available");
    }
  };

  return (
    <PageLayout>
      <FilterCard>
        <Col xs={8} xl={5} className="d-flex">
          <Input
            label={"عدد الشموع:"}
            type={"number"}
            value={numberOfCandles}
            onChange={(event) => {
              setNumberOfCandles(event.target.value);
            }}
            placeholder="حدد عدد الشموع"
          />
        </Col>
        <Col xs={8} xl={5} className="d-flex">
          <Input
            label={" نسبة النطاق:"}
            type={"number"}
            value={percentageRange}
            onChange={(event) => {
              setPercentageRange(event.target.value);
            }}
            placeholder="حدد نسبة النطاق "
          />
        </Col>
        <Col xs={8} xl={2} className="d-flex justify-content-center">
          <CustomButton text={"ابحث"} onClick={fetchData} />
        </Col>
      </FilterCard>
      <CustomCard className="d-flex flex-column">
        {Object.keys(data).map((symbol) => (
          <CustomCard className="d-flex flex-column border-3 border-bottom">
            <p>الرمز:{symbol}</p>
            <CandlestickChart key={symbol} symbol={symbol} />
          </CustomCard>
        ))}
      </CustomCard>
    </PageLayout>
  );
};

export default ConsolidatingStocks;
