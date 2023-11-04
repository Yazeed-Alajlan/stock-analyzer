import React, { useState } from "react";
import CompnentLayout from "components/CompnentLayout";
import { Card, Col, Container, Row } from "react-bootstrap";
import candlestick_patterns from "../candlestickPatterns";
import Select from "react-select";
import StockChart from "pages/StockPage/components/StockChart";
import { CustomCard } from "components/utils/CustomCard";
import CustomButton from "components/utils/CustomButton";

const FilterCard = () => {
  const candlestickOptions = Object.entries(candlestick_patterns).map(
    ([key, value]) => ({
      value: key,
      label: value,
    })
  );
  const [selectedPattern, setSelectedPattern] = useState();
  const [filteredData, setFilteredData] = useState(null);
  const handleChange = (selectedOption) => {
    setSelectedPattern(selectedOption);
  };
  const sendSelectedPattern = async () => {
    if (selectedPattern) {
      console.log(selectedPattern);
      try {
        const response = await fetch(
          `http://localhost:5000/python-api/japanese-candlestick-patterns/${selectedPattern.value}`
        );

        if (response.ok) {
          const filteredData = await response.json(); // Assuming the response is JSON data
          setFilteredData(filteredData);
          console.log(filteredData);
        } else {
          console.error("Failed to send pattern");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  return (
    <CompnentLayout>
      <CustomCard>
        <Row className="d-flex border-1 border-bottom pb-4">
          <Col xs={8} xl={5} className="d-flex">
            <p className="my-auto ms-3">النمط:</p>
            <Select
              options={candlestickOptions}
              value={selectedPattern}
              onChange={handleChange}
              placeholder="حدد النمط"
              className="w-75 z-2"
            />
          </Col>
          <Col xs={8} xl={5} className="d-flex">
            <p className="my-auto ms-3">النوع:</p>
            <Select
              placeholder="إيجابي أو سلبي"
              className="w-75 z-2"
              isDisabled={filteredData === null}
            />
          </Col>
          <Col xs={8} xl={2} className="d-flex justify-content-center">
            <CustomButton title={"ابحث"} onClick={sendSelectedPattern} />
          </Col>
        </Row>
        <Row>
          {filteredData && (
            <>
              {/* Iterate over the outer dictionary */}
              {Object.keys(filteredData).map((outerKey) => (
                <div className="d-flex flex-column gap-4" key={outerKey}>
                  {/* <p>Key: {outerKey}</p> */}
                  {/* Iterate over the inner dictionary */}
                  {Object.entries(filteredData[outerKey]).map(
                    ([innerKey, value]) => (
                      <div
                        className="d-flex flex-column border-3 border-bottom"
                        key={innerKey}
                      >
                        <div className="d-flex">
                          <p>رمز الشركة: {innerKey}</p>
                          <p>النوع: {value}</p>
                        </div>
                        <StockChart symbol={innerKey} />
                      </div>
                    )
                  )}
                </div>
              ))}
            </>
          )}
        </Row>
      </CustomCard>
    </CompnentLayout>
  );
};

export default FilterCard;
