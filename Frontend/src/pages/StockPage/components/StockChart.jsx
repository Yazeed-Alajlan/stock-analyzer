import React, { useEffect, useState } from "react";
import axios from "axios";
import { createChart } from "lightweight-charts";
import { Container } from "react-bootstrap";
import CompnentLayout from "components/CompnentLayout";

const StockChart = ({ symbol }) => {
  const [stockData, setStockData] = useState(null);
  const [legend, setLegend] = useState(() => ({
    close: "",
    open: "",
    high: "",
    low: "",
    changePercent: "",
  }));

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
        setStockData(data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchData();
  }, [symbol]);

  const formatData = () => {
    console.log(stockData);
    if (!stockData) return [];
    return stockData
      .map((quote) => {
        if (!quote) return null; // Check if quote is null or undefined

        return {
          time: quote.date.split("T")[0],
          open: Number(quote.open?.toFixed(2)), // Use optional chaining to avoid errors if open is null or undefined
          high: Number(quote.high?.toFixed(2)),
          low: Number(quote.low?.toFixed(2)),
          close: Number(quote.close?.toFixed(2)),
          volume: Number(quote.volume),
        };
      })
      .filter((data) => data !== null); // Filter out null values
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
          top: 0.4,
          bottom: 0.15,
        },
      },
      crosshair: {
        horzLine: {
          visible: false,
          labelVisible: false,
        },
      },
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
      let closePrice = "";
      let openPrice = "";
      let highPrice = "";
      let lowPrice = "";

      if (param.time) {
        const data = param.seriesData.get(candlestickSeries);
        closePrice = data.close.toFixed(2);
        openPrice = data.open.toFixed(2);
        highPrice = data.high.toFixed(2);
        lowPrice = data.low.toFixed(2);
      }

      setLegend({
        close: closePrice,
        open: openPrice,
        high: highPrice,
        low: lowPrice,
        changePercent: (((closePrice - openPrice) / openPrice) * 100).toFixed(
          2
        ),
      });
    });

    return () => {
      chart.remove();
    };
  }, [stockData]);

  return (
    <CompnentLayout>
      <Container className="px-4">
        <div
          className={`d-flex justify-content-end  gap-4 text-${
            legend.open > legend.close ? "danger" : "success"
          }`}
        >
          <p>
            التغيير (%):{" "}
            <span>
              {legend.changePercent === "NaN" ? "" : legend.changePercent}
            </span>
          </p>
          <p>الأدنى : {legend.low}</p>
          <p>الأعلى : {legend.high}</p>
          <p>الإفتتاح : {legend.open}</p>
          <p>الإغلاق : {legend.close}</p>
        </div>
        <div className="p-4" id={chartContainerId}></div>
      </Container>
    </CompnentLayout>
  );
};

export default StockChart;
