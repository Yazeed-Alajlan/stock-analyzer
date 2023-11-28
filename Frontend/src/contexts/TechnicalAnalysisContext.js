import React, { useState, useContext } from "react";
import axios from "axios";

const TechnicalAnalysisContext = React.createContext();

export function useTechnicalAnalysis() {
  return useContext(TechnicalAnalysisContext);
}

export function TechnicalAnalysisProvider({ children }) {
  const [filteredStocks, setFilteredStocks] = useState();

  async function getConsolidatingStocks(numberOfCandles, percentageRange) {
    try {
      const url = `http://localhost:5000/python-api/consolidating-stocks?numberOfCandles=${numberOfCandles}&percentageRange=${percentageRange}`;
      const response = await axios.get(url);
      setFilteredStocks(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const value = {
    filteredStocks,
    setFilteredStocks,
    getConsolidatingStocks,
  };

  return (
    <TechnicalAnalysisContext.Provider value={value}>
      {children}
    </TechnicalAnalysisContext.Provider>
  );
}
