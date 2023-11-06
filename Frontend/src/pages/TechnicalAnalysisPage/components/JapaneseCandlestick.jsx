import React, { useState } from "react";
import CompnentLayout from "components/CompnentLayout";
import { Col, Row } from "react-bootstrap";
import candlestick_patterns from "../candlestickPatterns";
import StockChart from "pages/StockPage/components/StockChart";
import { CustomCard } from "components/utils/CustomCard";
import CustomButton from "components/utils/CustomButton";
import InputSelect from "components/utils/InputSelect";
import Input from "components/utils/Input";
import FilterCard from "components/utils/FilterCard";

const JapaneseCandlestick = () => {
  const candlestickOptions = Object.entries(candlestick_patterns).map(
    ([key, value]) => ({
      value: key,
      label: value,
    })
  );
  const [selectedPattern, setSelectedPattern] = useState("");
  const [selectedFilter, setSelectedFilter] = useState();
  const [filteredData, setFilteredData] = useState(null);

  const handleChange = (selectedOption) => {
    setSelectedPattern(selectedOption);
  };
  const handleFilterData = (selectedOption) => {
    setSelectedFilter(selectedOption);
  };

  const sendSelectedPattern = async () => {
    if (selectedPattern) {
      try {
        const response = await fetch(
          `http://localhost:5000/python-api/japanese-candlestick-patterns/${selectedPattern.value}`
        );

        if (response.ok) {
          const filteredData = await response.json(); // Assuming the response is JSON data
          setFilteredData(filteredData);
        } else {
          console.error("Failed to send pattern");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const filteredDataByFilter = () => {
    if (!filteredData || !selectedFilter) {
      return filteredData;
    }
    console.log(selectedFilter);
    const filteredByFilter = {};

    // Iterate over the outer dictionary
    Object.keys(filteredData).forEach((outerKey) => {
      // Filter and create a new inner dictionary
      const innerData = Object.entries(filteredData[outerKey])
        .filter(([innerKey, value]) => value === selectedFilter.value)
        .reduce((obj, [innerKey, value]) => {
          obj[innerKey] = value;
          return obj;
        }, {});

      // If there are items in the inner dictionary, add it to the result
      if (Object.keys(innerData).length > 0) {
        filteredByFilter[outerKey] = innerData;
      }
    });

    return filteredByFilter;
  };

  return (
    <CompnentLayout>
      <FilterCard>
        <Col xs={8} xl={5} className="d-flex">
          <InputSelect
            label={"النمط:"}
            options={candlestickOptions}
            value={selectedPattern}
            onChange={handleChange}
            placeholder="حدد النمط"
          />
        </Col>
        <Col xs={8} xl={5} className="d-flex">
          <InputSelect
            label="النوع:"
            options={[
              { value: "bullish", label: "bullish" },
              { value: "bearish", label: "bearish" },
            ]}
            value={selectedFilter}
            onChange={handleFilterData}
            placeholder="إيجابي أو سلبي"
            isDisabled={filteredData === null}
          />
        </Col>
        <Col xs={8} xl={2} className="d-flex justify-content-center">
          <CustomButton title={"ابحث"} onClick={sendSelectedPattern} />
        </Col>
      </FilterCard>
      <CustomCard>
        <Row>
          {filteredDataByFilter() && (
            <>
              {Object.keys(filteredDataByFilter()).map((outerKey) => (
                <div className="d-flex flex-column gap-4" key={outerKey}>
                  {Object.entries(filteredDataByFilter()[outerKey]).map(
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

export default JapaneseCandlestick;
