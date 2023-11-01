import React, { useEffect, useState } from "react";
import axios from "axios";
import { createChart } from "lightweight-charts";
import { CustomCard } from "../../components/utils/CustomCard";
import SelectionTitle from "../../components/utils/SelectionTitle";
import { ButtonGroup, Container } from "react-bootstrap";
import CustomButton from "../../components/utils/CustomButton";

const StockChart = ({ symbol }) => {
  const [stockData, setStockData] = useState(null);
  const [legend, setLegend] = useState("");
  // Generate a unique ID for the chart container based on the symbol
  const chartContainerId = `chart-container-${symbol}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/stock-price/${symbol}`
        );
        const data = response.data;
        if (!data) {
          throw new Error("Invalid stock symbol or no data available.");
        }
        setStockData(data[0]);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchData();
  }, [symbol]);

  const formatData = () => {
    if (!stockData) return [];
    return stockData.quotes.map((quote) => ({
      time: quote.date.split("T")[0],
      open: Number(quote.open.toFixed(2)),
      high: Number(quote.high.toFixed(2)),
      low: Number(quote.low.toFixed(2)),
      close: Number(quote.close.toFixed(2)),
    }));
  };

  useEffect(() => {
    const chartOptions = {
      layout: {
        textColor: "black",
        background: { type: "solid", color: "white" },
      },
    };
    const chart = createChart(chartContainerId, {
      height: "400",
    });
    chart.applyOptions({
      rightPriceScale: {
        scaleMargins: {
          top: 0.4, // leave some space for the legend
          bottom: 0.15,
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
    chart.subscribeCrosshairMove((param) => {
      let priceFormatted = "";
      if (param.time) {
        const data = param.seriesData.get(candlestickSeries);
        const price = data.value !== undefined ? data.value : data.close;
        priceFormatted = price.toFixed(2);
        setLegend(priceFormatted);
        console.log(priceFormatted);
      }
    });
    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [stockData]);

  return (
    <CustomCard>
      <Container className="px-4">
        {legend}
        <div className="p-4" id={chartContainerId}></div>
      </Container>
    </CustomCard>
  );
};

export default StockChart;
