import React, { useState, useContext } from "react";
import axios from "axios";

const TechnicalAnalysisContext = React.createContext();

export function useTechnicalAnalysis() {
  return useContext(TechnicalAnalysisContext);
}

export function TechnicalAnalysisProvider({ children }) {
  const [filteredStocks, setFilteredStocks] = useState();
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [selectedStock, setSelectedStock] = useState();

  async function consolidatingStocksFilter({
    numberOfCandles,
    percentageRange,
  }) {
    try {
      const url = `http://localhost:5000/python-api/consolidating-stocks?numberOfCandles=${numberOfCandles}&percentageRange=${percentageRange}`;
      const response = await axios.get(url);
      console.log(response.data);
      setFilteredStocks(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function japaneseCandlestickFilter({ pattern }) {
    try {
      const response = await fetch(
        `http://localhost:5000/python-api/japanese-candlestick-patterns/${pattern}`
      );

      if (response.ok) {
        const data = await response.json();
        setFilteredStocks(data[pattern]);
      } else {
        console.error("Failed to send pattern");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  async function japaneseCandlestickMarkers(symbol) {
    try {
      const response = await fetch(
        `http://localhost:5000/python-api/japanese-candlestick-patterns-markers?symbol=${symbol}`
      );

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Failed to send pattern ");
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
    selectedIndicators,
    setSelectedIndicators,
    selectedStock,
    setSelectedStock,
    japaneseCandlestickMarkers,
  };

  return (
    <TechnicalAnalysisContext.Provider value={value}>
      {children}
    </TechnicalAnalysisContext.Provider>
  );
}
