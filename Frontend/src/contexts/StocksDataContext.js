import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

const StocksDataContext = React.createContext();

export function useStocksData() {
  return useContext(StocksDataContext);
}

export function StocksDataProvider({ children }) {
  const [stocksData, setStocksData] = useState();
  const [selectedStockData, setSelectedStockData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost:5000/companies";
        const response = await axios.get(url);
        console.log("fetch data");
        setStocksData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  function hi() {
    console.log("hi");
    return "hii";
  }

  const value = {
    stocksData,
    selectedStockData,
    setSelectedStockData,
    hi,
  };

  return (
    <StocksDataContext.Provider value={value}>
      {children}
    </StocksDataContext.Provider>
  );
}
