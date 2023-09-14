import React, { useEffect, useState } from "react";
import axios from "axios";
import { createChart } from "lightweight-charts";

const StockChart = ({ symbol }) => {
  const [stockData, setStockData] = useState(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("max"); // Default to 1 month

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stock data using yfinance
        const response = await axios.get(
          `http://localhost:5000/api/stock-price/${symbol}`
        );
        const data = response.data;

        if (!data) {
          throw new Error("Invalid stock symbol or no data available.");
        }
        console.log(data);
        setStockData(data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchData();
  }, [symbol]);

  const formatData = () => {
    if (!stockData) return [];

    const filteredData = stockData.quotes.filter((quote) => {
      const currentDate = new Date();
      const quoteDate = new Date(quote.date);
      console.log(quoteDate.getTime());
      switch (selectedTimeFrame) {
        case "1m":
          return (
            currentDate.getTime() - quoteDate.getTime() <=
            30 * 24 * 60 * 60 * 1000
          ); // 30 days
        case "1w":
          return (
            currentDate.getTime() - quoteDate.getTime() <=
            7 * 24 * 60 * 60 * 1000
          ); // 7 days (1 week)
        case "3m":
          return (
            currentDate.getTime() - quoteDate.getTime() <=
            90 * 24 * 60 * 60 * 1000
          ); // 90 days
        case "6m":
          return (
            currentDate.getTime() - quoteDate.getTime() <=
            180 * 24 * 60 * 60 * 1000
          ); // 180 days
        case "1y":
          return (
            currentDate.getTime() - quoteDate.getTime() <=
            365 * 24 * 60 * 60 * 1000
          ); // 365 days
        case "3y":
          return (
            currentDate.getTime() - quoteDate.getTime() <=
            3 * 365 * 24 * 60 * 60 * 1000
          ); // 3 years
        case "5y":
          return (
            currentDate.getTime() - quoteDate.getTime() <=
            5 * 365 * 24 * 60 * 60 * 1000
          ); // 5 years
        case "max":
          return true;
        default:
          return true; // By default, return all data
      }
    });

    return filteredData.map((quote) => ({
      time: quote.date.split("T")[0], // Extract yyyy-mm-dd from the date string
      open: Number(quote.open.toFixed(2)),
      high: Number(quote.high.toFixed(2)),
      low: Number(quote.low.toFixed(2)),
      close: Number(quote.close.toFixed(2)),
    }));
  };

  const handleTimeFrameChange = (event) => {
    const newTimeFrame = event.target.value;
    setSelectedTimeFrame(newTimeFrame);
  };

  useEffect(() => {
    const chart = createChart("chart-container", { width: 1000, height: 400 });
    chart.applyOptions({
      rightPriceScale: {
        scaleMargins: {
          top: 0.3, // leave some space for the legend
          bottom: 0.25,
        },
      },
      crosshair: {
        // hide the horizontal crosshair line
        horzLine: {
          visible: false,
          labelVisible: false,
        },
      },
      // hide the grid lines
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: false,
        },
      },
    });
    const candlestickSeries = chart.addCandlestickSeries();

    candlestickSeries.setData(formatData());

    // Configure x-axis to display dates in a custom format
    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [stockData, selectedTimeFrame]);

  return (
    <div>
      <div>
        <select value={selectedTimeFrame} onChange={handleTimeFrameChange}>
          <option value="1w">1 Week</option>
          <option value="1m">1 Month</option>
          <option value="3m">3 Months</option>
          <option value="6m">6 Months</option>
          <option value="1y">1 Year</option>
          <option value="3y">3 Years</option>
          <option value="5y">5 Years</option>
          <option value="max">Max</option>
        </select>
      </div>
      <div id="chart-container"></div>
    </div>
  );
};

export default StockChart;
