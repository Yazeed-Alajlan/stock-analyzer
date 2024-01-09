import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const MultiChartComponent = ({ data }) => {
  const chartsContainerRef = useRef(null);
  const charts = useRef([]);

  const createChartWithSync = (chartOptions) => {
    const chart = createChart(chartsContainerRef.current, chartOptions);
    charts.current.push(chart);
    return chart;
  };

  useEffect(() => {
    // Clear previous charts when new data arrives
    charts.current.forEach((chart) => {
      chart.remove();
    });
    charts.current = [];

    if (data && data.length > 0) {
      const stockPriceData = data[0]; // Extracting stock price data
      const indicators = data.slice(1); // Extracting indicator data

      const stockPriceChart = createChartWithSync(
        stockPriceData.chartOptions || {
          color: stockPriceData.color || "blue",
          priceLineVisible: false,
        }
      );
      console.log(stockPriceData.chartOptions);
      const stockPriceSeries = stockPriceChart.addCandlestickSeries();

      stockPriceSeries.setData(stockPriceData.data);

      // Creating charts for indicators
      indicators.forEach((indicator) => {
        const indicatorChart = createChartWithSync(
          indicator.chartOptions || {
            width: 600,
            height: 250,
            layout: {
              textColor: "black",
              background: { type: "solid", color: "white" },
            },
            // Add other chart options for indicators here
          }
        );

        const indicatorSeries = indicatorChart.addLineSeries({
          color: indicator.color || "red",
          priceLineVisible: false,
        });

        indicatorSeries.setData(indicator.data);
      });

      // Syncing time scales for all charts
      charts.current.forEach((chart) => {
        if (!chart) {
          return;
        }
        chart.timeScale().subscribeVisibleTimeRangeChange((e) => {
          charts.current
            .filter((c) => c !== chart)
            .forEach((c) => {
              c.timeScale().applyOptions({
                rightOffset: chart.timeScale().scrollPosition(),
              });
            });
        });
        chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
          if (range) {
            charts.current
              .filter((c) => c !== chart)
              .forEach((c) => {
                c.timeScale().setVisibleLogicalRange({
                  from: range.from,
                  to: range.to,
                });
              });
          }
        });
      });
    }
  }, [data]);

  return <div ref={chartsContainerRef} />;
};

export default MultiChartComponent;
