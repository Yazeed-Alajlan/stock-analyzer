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
    volume: "",
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
      height: "400",
    };
    const chart = createChart(chartContainerId, chartOptions);
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
          visible: true,
          labelVisible: true,
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
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

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

    const container = document.getElementById(chartContainerId);

    const toolTipWidth = 80;
    const toolTipHeight = 80;
    const toolTipMargin = 15;

    // Create and style the tooltip html element
    const toolTip = document.createElement("div");
    toolTip.style = `width: 96px; height: 100px; position: absolute; display: none; padding: 8px; box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none; border: 1px solid; border-radius: 2px;font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`;
    toolTip.style.background = "white";
    toolTip.style.color = "black";
    toolTip.style.borderColor = "rgba( 38, 166, 154, 1)";
    container.appendChild(toolTip);

    // update tooltip
    chart.subscribeCrosshairMove((param) => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > container.clientWidth ||
        param.point.y < 0 ||
        param.point.y > container.clientHeight
      ) {
        toolTip.style.display = "none";
      } else {
        // time will be in the same format that we supplied to setData.
        // thus it will be YYYY-MM-DD
        const dateStr = param.time;
        toolTip.style.display = "block";
        const data = param.seriesData.get(candlestickSeries);
        const price = data.value !== undefined ? data.value : data.close;
        toolTip.innerHTML = `
      <div style="font-size: 24px; margin: 4px 0px; color: ${"black"}">
			${Math.round(100 * price) / 100}
			</div>
      <div style="color: ${"black"}">
			${dateStr}
			</div>`;

        const y = param.point.y;
        let left = param.point.x + toolTipMargin;
        if (left > container.clientWidth - toolTipWidth) {
          left = param.point.x - toolTipMargin - toolTipWidth;
        }

        let top = y + toolTipMargin;
        if (top > container.clientHeight - toolTipHeight) {
          top = y - toolTipHeight - toolTipMargin;
        }
        toolTip.style.left = left + "px";
        toolTip.style.top = top + "px";
      }
    });

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
    // chart.timeScale().fitContent();

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
          <p>الحجم : {legend.volume}</p>
        </div>
        <div className="p-4" id={chartContainerId}></div>
      </Container>
    </CompnentLayout>
  );
};

export default StockChart;
