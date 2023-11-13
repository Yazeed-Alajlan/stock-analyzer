import React, { useEffect, useState } from "react";
import axios from "axios";
import { createChart } from "lightweight-charts";
import { Container } from "react-bootstrap";
import CompnentLayout from "components/CompnentLayout";

const ChartPatterns = () => {
  const [stockData, setStockData] = useState(null);
  const [legend, setLegend] = useState(() => ({
    close: "",
    open: "",
    high: "",
    low: "",
    volume: "",
    changePercent: "",
  }));
  const [drawData, setDrawData] = useState();

  const symbol = "2030";

  const chartContainerId = `chart-container-${symbol}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/stock-price/${symbol}`
        );
        const data = response.data;
        console.log(data);
        if (!data) {
          throw new Error("Invalid stock symbol or no data available.");
        }
        setStockData(data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchData();

    const fetchData2 = async () => {
      try {
        const url = `http://localhost:5000/python-api/flags-pennants?symbol=${symbol}`;
        const response = await axios.get(url);

        setDrawData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData2();
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

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries();
    candlestickSeries.setData(formatData());

    // Add volume series with overlay
    const volumeSeries = chart.addHistogramSeries({
      color: "#26a69a", // Set the color for volume bars
      priceFormat: {
        type: "volume",
      },
      overlay: true,
      priceScaleId: "", // Set the priceScaleId to an empty string for overlay
    });
    volumeSeries.priceScale().applyOptions({
      // set the positioning of the volume series
      scaleMargins: {
        top: 0.7, // highest point of the series will be 70% away from the top
        bottom: 0,
      },
    });
    volumeSeries.setData(
      formatData().map((data) => ({ time: data.time, value: data.volume }))
    );

    if (drawData != null) {
      console.log(drawData);
      var tldata = [];
      Object.keys(drawData).map((pattern) => {
        if (pattern == []) return;
        Object.entries(drawData[pattern]).map((item) => {
          item[1].map((draw) => {
            tldata.push({
              time: new Date(draw[0]).toISOString().split("T")[0],
              value: draw[1],
              color: pattern.includes("bull") ? "green" : "green",
            });
          });
        });

        tldata.forEach((point, index) => {
          if (index % 2 !== 0 || index === tldata.length - 1) return;

          const lineSeries = chart.addLineSeries({
            lastValueVisible: false,
            priceLineVisible: false,
            color: point.color,
          });
          lineSeries.setData([
            { time: point.time, value: point.value },
            { time: tldata[index + 1].time, value: tldata[index + 1].value },
          ]);
        });
      });
    }

    // Legend
    chart.subscribeCrosshairMove((param) => {
      let closePrice = "";
      let openPrice = "";
      let highPrice = "";
      let lowPrice = "";
      let volume = "";

      if (param.time) {
        const candlestickData = param.seriesData.get(candlestickSeries);
        const volumeData = param.seriesData.get(volumeSeries);

        if (candlestickData) {
          closePrice = candlestickData.close.toFixed(2);
          openPrice = candlestickData.open.toFixed(2);
          highPrice = candlestickData.high.toFixed(2);
          lowPrice = candlestickData.low.toFixed(2);
        }

        if (volumeData) {
          volume = volumeData.value.toFixed(2);
        }
      }

      setLegend({
        close: closePrice,
        open: openPrice,
        high: highPrice,
        low: lowPrice,
        volume: volume,
        changePercent: (((closePrice - openPrice) / openPrice) * 100).toFixed(
          2
        ),
      });
    });

    return () => {
      chart.remove();
    };
  }, [stockData, drawData]);

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
          <p>الحجم : {legend.volume}</p>
        </div>
        <div className="p-4" id={chartContainerId}></div>
      </Container>
    </CompnentLayout>
  );
};

export default ChartPatterns;
