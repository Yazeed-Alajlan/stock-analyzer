import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import Indicators from "./Indicators";
import { useTechnicalAnalysis } from "contexts/TechnicalAnalysisContext";

const CandlestickAndIndicatorsChart = ({
  series,
  symbol,
  indicators,
  drawLines,
  markers,
}) => {
  const {
    selectedIndicators,
    setSelectedIndicators,
    japaneseCandlestickMarkers,
  } = useTechnicalAnalysis();

  const chartContainerId = `chart-container-${symbol}`;

  useEffect(() => {
    if (!series || series == []) return;

    const container = document.getElementById("responsive-chart");
    // Get the available width and height of the container
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const chartOptions = {
      width: containerWidth,
      // height: containerHeight / indicators?.length, // Divide height equally between two charts
      height: containerHeight, // Divide height equally between two charts
      layout: {
        textColor: "black",
        background: { type: "solid", color: "white" },
      },
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
    };

    const chart = createChart(chartContainerId, chartOptions);
    const candlestickSeries = chart.addCandlestickSeries();
    candlestickSeries.setData(formatCandleStickData(series));
    console.log(markers);
    if (markers) {
      const markers_list = [];
      Object.keys(markers).forEach((pattern) => {
        markers[pattern].forEach((timestampPattern) => {
          const [timestamp, patternName] = timestampPattern;
          const formattedDate = new Date(timestamp).toISOString().split("T")[0];

          markers_list.push({
            time: formattedDate,
            position: "aboveBar",
            color: "#f68410", // Change the color as needed
            shape: "circle", // Change the shape if required
            text: patternName || pattern, // Use the pattern name or default to the key
          });
        });
      });
      console.log(markers_list);
      const sortedList = markers_list.sort((a, b) => {
        const dateA = new Date(a.time);
        const dateB = new Date(b.time);
        return dateA - dateB;
      });

      console.log(sortedList);
      candlestickSeries.setMarkers(markers_list);
    }

    if (indicators) {
      console.log(indicators);
      indicators.forEach((indicator, index) => {
        console.log(indicator);
        indicator.lines.map((data) => {
          Object.entries(data).map((line) => {
            if (line[0] == "signalperiod") {
              chart
                .addHistogramSeries({
                  title: line[0],
                  pane: indicator.pane,
                  color: data.color,
                })
                .setData(formatIndicatorkData(Object.values(line)[1]));
            } else {
              chart
                .addLineSeries({
                  title: line[0],
                  pane: indicator.pane,
                  color: data.color,
                })
                .setData(formatIndicatorkData(Object.values(line)[1]));
            }
          });
          console.log(data);
        });
      });
    }

    addVolumeHistogram(chart, series);
    // createTooltip(chartContainerId, chart, candlestickSeries);
    return () => {
      chart.remove();
    };
  }, [symbol, selectedIndicators, markers]);

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
    let data = [];
    if (!series) return [];

    return Object.entries(series).map(([time, value]) => ({
      time: time.split("T")[0],
      value: Number(value.toFixed(2)),
    }));
    // .filter((data) => data !== null); // Filter out null values
  };
  const handleDelete = (name, pane, index) => {
    const updatedIndicators = indicators.filter(
      (indicator) => indicator.name !== name
    );
    setSelectedIndicators(updatedIndicators);
  };
  return (
    <>
      {series ? (
        <>
          <div className="position-relative" id={chartContainerId}>
            <span className=" d-inline-flex flex-column position-absolute z-3 top-0 start-0 mx-3">
              <Indicators indicators={indicators} onDelete={handleDelete} />
            </span>
          </div>
        </>
      ) : (
        <>loading</>
      )}
    </>
  );
};

export default CandlestickAndIndicatorsChart;
