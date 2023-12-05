import React, { useState, useContext } from "react";
import axios from "axios";

const TechnicalAnalysisContext = React.createContext();

export function useTechnicalAnalysis() {
  return useContext(TechnicalAnalysisContext);
}

export function TechnicalAnalysisProvider({ children }) {
  const [filteredStocks, setFilteredStocks] = useState();

  async function consolidatingStocksFilter(numberOfCandles, percentageRange) {
    try {
      const url = `http://localhost:5000/python-api/consolidating-stocks?numberOfCandles=${numberOfCandles}&percentageRange=${percentageRange}`;
      const response = await axios.get(url);
      console.log(numberOfCandles);
      setFilteredStocks(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function japaneseCandlestickFilter(pattern) {
    try {
      const response = await fetch(
        `http://localhost:5000/python-api/japanese-candlestick-patterns/${pattern}`
      );

      if (response.ok) {
        setFilteredStocks(await response.json());
      } else {
        console.error("Failed to send pattern");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const value = {
    filteredStocks,
    setFilteredStocks,
    consolidatingStocksFilter,
    japaneseCandlestickFilter,
  };

  return (
    <TechnicalAnalysisContext.Provider value={value}>
      {children}
    </TechnicalAnalysisContext.Provider>
  );
}
