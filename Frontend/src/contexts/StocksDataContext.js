import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

const StocksDataContext = React.createContext();

export function useStocksData() {
  return useContext(StocksDataContext);
}

export function StocksDataProvider({ children }) {
  const [stocksData, setStocksData] = useState();
  const [selectedStock, setSelectedStock] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost:5000/api/companies";
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
      .get(`http://localhost:5000/api/stock-financials/${symbol}`)
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
        `http://localhost:5000/api/stock-inforamtion/${symbol}`
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    return response.data;
  }
  async function getStockPriceData(symbol) {
    let response;
    try {
      response = await axios.get(
        `http://localhost:5000/api/stock-price/${symbol}`
      );
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }

    return response.data;
  }
  async function getIndicatorData(symbol, indicator, period) {
    let response;
    console.log(period);
    try {
      response = await axios.get(
        `http://localhost:5000/python-api/${symbol}/indicators/${indicator}?period=${period}`
      );
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }

    return response.data;
  }

  async function getAllBasicEarningsPerShareTTM() {
    if (stocksData) {
      console.log(stocksData);
      const formattedData = stocksData.map((data) => ({
        company: data.symbol + " - " + data.tradingNameAr,
        sectorNameAr: data.sectorNameAr,
        basic_earnings_per_share_ttm:
          data.summary[data.summary.length - 1].basic_earnings_per_share_ttm,
      }));
      console.log(formattedData);

      return formattedData;
    }
    return [];
  }

  const value = {
    stocksData,
    setStocksData,
    selectedStock,
    setSelectedStock,
    getStockFinancialData,
    getStockInformationData,
    getStockPriceData,
    getIndicatorData,
    getAllBasicEarningsPerShareTTM,
  };

  return (
    <StocksDataContext.Provider value={value}>
      {children}
    </StocksDataContext.Provider>
  );
}
