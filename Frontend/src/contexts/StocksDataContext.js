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

  function getStockFinancialData(symbol) {
    return axios
      .get(`http://localhost:5000/api/StockFinancialData/${symbol}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching data:", error);
        throw error;
      });
  }
  async function getStockInformationData(symbol) {
    let response;
    try {
      response = await axios.get(
        `http://localhost:5000/api/StockInformation/${symbol}`
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    return response.data;
  }

  const value = {
    stocksData,
    selectedStockData,
    setSelectedStockData,
    getStockFinancialData,
    getStockInformationData,
  };

  return (
    <StocksDataContext.Provider value={value}>
      {children}
    </StocksDataContext.Provider>
  );
}
