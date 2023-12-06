import React, { useEffect, useState } from "react";
import { createChart } from "lightweight-charts";
import { Container } from "react-bootstrap";
import CompnentLayout from "components/CompnentLayout";

const CandlestickAndIndicatorsChart = ({
  series,
  symbol,
  indcators,
  drawLines,
}) => {
  const [stockData, setStockData] = useState();
  const [indicators, setIndicators] = useState();
  const chartContainerId = `chart-container-${symbol}`;

  useEffect(() => {
    setStockData(formatCandleStickData(series));
    setIndicators(formatIndicatorkData(indcators));
  }, [series, symbol]);

  useEffect(() => {
    if (!stockData) return;
    const container = document.getElementById("responsive-chart");

    // Get the available width and height of the container
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    console.log(containerHeight);
    console.log(containerWidth);
    const chartOptions = {
      width: containerWidth,
      height: containerHeight / 2, // Divide height equally between two charts
      layout: {
        textColor: "black",
        background: { type: "solid", color: "white" },
      },
    };
    const chart = createChart(chartContainerId, chartOptions);
    const chart2 = createChart(chartContainerId, chartOptions);

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
    candlestickSeries.setData(stockData);
    if (indcators) {
      const indcator_chart = chart2.addLineSeries({
        pane: 1, // Set the pane for the indicator series
      });
      indcator_chart.setData(formatIndicatorkData(indcators));
    }
    addVolumeHistogram(chart, series);
    createTooltip(chartContainerId, chart, candlestickSeries);
    // Sync Cahrts
    chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
      chart2.timeScale().setVisibleLogicalRange(range);
    });
    chart2.timeScale().subscribeVisibleLogicalRangeChange((range) => {
      chart.timeScale().setVisibleLogicalRange(range);
    });

    return () => {
      chart.remove();
      chart2.remove();
    };
  }, [stockData, indcators]);

  const generateChart = async () => {
    const chartOptions = {
      layout: {
        textColor: "black",
        background: { type: "solid", color: "white" },
      },
    };
    const chart = createChart(chartContainerId, {
      timeScale: {
        visible: false, // Hide the X-axis (time scale)
      },
    });
    const chart2 = createChart(chartContainerId, chartOptions);
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
      pane: 1,
    });

    candlestickSeries.setData(stockData);

    if (indcators) {
      const indcator_chart = chart2.addLineSeries({
        pane: 1, // Set the pane for the indicator series
      });
      indcator_chart.setData(formatIndicatorkData(await indcators));
    }
    addVolumeHistogram(chart, await series);
    createTooltip(chartContainerId, chart, candlestickSeries);

    return () => {
      chart.remove();
    };
  };

  function createTooltip(chartContainerId, chart, series) {
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
        const data = param.seriesData.get(series);
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
  }

  async function addVolumeHistogram(chart, series) {
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
      formatCandleStickData(series).map((data) => ({
        time: data.time,
        value: data.volume,
      }))
    );
  }

  const formatCandleStickData = (series) => {
    console.log(series);

    if (!series) return [];
    return series
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
  const formatLineData = (series) => {
    if (!series) return [];
    return series
      .map((quote) => {
        if (!quote) return null; // Check if quote is null or undefined
        return {
          time: quote.date.split("T")[0],
          value: Number(quote.value?.toFixed(2)), // Use optional chaining to avoid errors if open is null or undefined
          volume: Number(quote.volume),
        };
      })
      .filter((data) => data !== null); // Filter out null values
  };

  const formatIndicatorkData = (series) => {
    // console.log(indcators);
    let data = [];
    if (!series) return [];

    return Object.entries(series).map(([time, value]) => ({
      time: time.split("T")[0],
      value: Number(value.toFixed(2)),
    }));
    // .filter((data) => data !== null); // Filter out null values
  };

  return (
    <>
      <div className="" id={chartContainerId} />
    </>
  );
};

export default CandlestickAndIndicatorsChart;
