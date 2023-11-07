import axios from "axios";
import CompnentLayout from "components/CompnentLayout";
import CustomButton from "components/utils/CustomButton";
import { CustomCard } from "components/utils/CustomCard";
import FilterCard from "components/utils/FilterCard";
import Input from "components/utils/Input";
import StockChart from "pages/StockPage/components/StockChart";
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
    <CompnentLayout>
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
          <CustomButton title={"ابحث"} onClick={fetchData} />
        </Col>
      </FilterCard>
      <div className="d-flex flex-column gap-4">
        <CustomCard>
          {Object.keys(data).map((symbol) => (
            <CustomCard className="d-flex flex-column border-3 border-bottom">
              <p>الرمز:{symbol}</p>
              <StockChart key={symbol} symbol={symbol} />
            </CustomCard>
          ))}
        </CustomCard>
      </div>
    </CompnentLayout>
  );
};

export default ConsolidatingStocks;
