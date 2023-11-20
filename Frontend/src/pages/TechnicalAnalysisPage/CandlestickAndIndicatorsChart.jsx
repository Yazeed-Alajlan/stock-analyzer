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
  const [stockData, setStockData] = useState(series);
  const [chartID, setChartID] = useState(`chart-container-${symbol}`);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const fetchedData = await series; // Assuming series is a Promise
        setStockData(formatCandleStickData(fetchedData));

        const chart = createChart(chartID);
        const candlestickSeries = chart.addCandlestickSeries({
          upColor: "#26a69a",
          downColor: "#ef5350",
          borderVisible: false,
          wickUpColor: "#26a69a",
          wickDownColor: "#ef5350",
        });
        candlestickSeries.setData(formatCandleStickData(fetchedData));
      } catch (error) {
        // Handle any errors if the promise rejects
        console.error("Error fetching data:", error);
      }
    };

    fetchStockData();
  }, []);

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

  return (
    <CompnentLayout>
      <Container className="px-4">
        {stockData ? (
          <>
            <div className="p-4" id={chartID}></div>
          </>
        ) : (
          <p>loading</p>
        )}
      </Container>
    </CompnentLayout>
  );
};

export default CandlestickAndIndicatorsChart;
