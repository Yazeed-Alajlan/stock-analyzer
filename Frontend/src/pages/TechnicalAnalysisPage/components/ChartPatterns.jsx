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
    changePercent: "",
  }));
  const [drawData, setDrawData] = useState();

  const symbol = "4321";

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

    const fetchData2 = async () => {
      try {
        const symbol = "2222";
        const url = `http://localhost:5000/python-api/flags-pennants`;
        const response = await axios.get(url);
        console.log(response.data);

        setDrawData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData2();
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

    if (drawData != null) {
      var tldata = [];
      console.log(drawData);
      Object.keys(drawData).map((pattern) => {
        if (pattern == []) return;
        Object.entries(drawData[pattern]).map((item) => {
          // console.log(item[1][0]);
          console.log(item);
          item[1].map((draw) => {
            tldata.push({
              time: new Date(draw[0]).toISOString().split("T")[0],
              value: draw[1],
            });
            console.log(draw[1]);
          });
        });
        // Create a line series for each pair of points
        tldata.forEach((point, index) => {
          // Skip if it's the last point (no next point to connect)
          if (index % 2 !== 0 || index === tldata.length - 1) return;
          const lineSeries = chart.addLineSeries({
            lastValueVisible: false,
          });
          lineSeries.setData([
            { time: point.time, value: point.value },
            { time: tldata[index + 1].time, value: tldata[index + 1].value },
          ]);
        });
      });

      // Object.entries(drawData).map((item) => {
      //   // console.log(item[1][0]);
      //   item[1].map((draw) => {
      //     tldata.push({
      //       time: new Date(draw[0]).toISOString().split("T")[0],
      //       value: draw[1],
      //     });

      //     console.log(draw[1]);
      //   });

      // });

      // // Create a line series for each pair of points
      // tldata.forEach((point, index) => {
      //   // Skip if it's the last point (no next point to connect)
      //   if (index % 2 !== 0 || index === tldata.length - 1) return;

      //   const lineSeries = chart.addLineSeries({
      //     lastValueVisible: false,
      //   });
      //   lineSeries.setData([
      //     { time: point.time, value: point.value },
      //     { time: tldata[index + 1].time, value: tldata[index + 1].value },
      //   ]);
      // });
    }

    // Lgened
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
        </div>
        <div className="p-4" id={chartContainerId}></div>
      </Container>
    </CompnentLayout>
  );
};

export default ChartPatterns;
