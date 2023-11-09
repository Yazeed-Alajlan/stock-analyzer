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

  const symbol = "2222";

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

        setDrawData(response.data.bear_flags);
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

    // const formattedDate = new Date(drawData[0][0][0])
    //   .toISOString()
    //   .split("T")[0];
    // const formattedDate2 = new Date(drawData[0][1][0])
    //   .toISOString()
    //   .split("T")[0];

    // console.log(formattedDate);
    // console.log(formattedDate2);

    if (drawData != null) {
      console.log(
        Object.keys(drawData).map((key) => {
          // Perform some operation on each key
          console.log(key);
        })
      );
      // var lineSeries = chart.addLineSeries({
      //   lastValueVisible: false,
      // });
      // var tldata = [];
      // tldata.push({
      //   time: formattedDate,
      //   value: drawData[0][0][1],
      // });
      // tldata.push({
      //   time: formattedDate2,
      //   value: drawData[0][1][1],
      // });
      // lineSeries.setData(tldata);
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
