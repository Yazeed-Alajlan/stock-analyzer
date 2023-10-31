import React, { useState } from "react";
import Select from "react-select";
import candlestick_patterns from "../Data/candlestickPatterns";
import StockChart from "../StockPage/StockChart";
const TechnicalAnalysisPage = () => {
  const options = Object.entries(candlestick_patterns).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  const [selectedPattern, setSelectedPattern] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  const handleChange = (selectedOption) => {
    setSelectedPattern(selectedOption);
  };

  const sendSelectedPattern = async () => {
    if (selectedPattern) {
      console.log(selectedPattern);
      try {
        const response = await fetch(
          `http://localhost:5000/api/japanese_candlestick_patterns/${selectedPattern.value}`
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
    <div>
      <h1>Technical Analysis Page</h1>
      <Select
        options={options}
        value={selectedPattern}
        onChange={handleChange}
        placeholder="Select a Candlestick Pattern"
      />
      <button onClick={sendSelectedPattern}>Filter</button>
      {filteredData && (
        <div>
          {/* Iterate over the outer dictionary */}
          {Object.keys(filteredData).map((outerKey) => (
            <div key={outerKey}>
              {/* <p>Key: {outerKey}</p> */}
              {/* Iterate over the inner dictionary */}
              {Object.entries(filteredData[outerKey]).map(
                ([innerKey, value]) => (
                  <div key={innerKey}>
                    <StockChart symbol={innerKey} />
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechnicalAnalysisPage;
