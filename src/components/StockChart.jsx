import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "react-bootstrap";
import Chart from "react-apexcharts";

const StockChart = () => {
  const chart = {
    options: {
      chart: {
        type: "candlestick",
        height: 350,
      },
      title: {
        text: "CandleStick Chart",
        align: "left",
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
    },
  };
  const round = (number) => {
    return number ? +number.toFixed(2) : null;
  };
  const [series, setSeries] = useState([{ data: [] }]);
  const [lastPrice, setLastPrice] = useState(-1);
  const [lastPriceTime, setLastPriceTime] = useState(null);
  var SYMBOL = "AAPL";

  async function getPriceData(symbol) {
    const proxyUrl = "http://cors-anywhere.herokuapp.com/";
    // https://query1.finance.yahoo.com/v10/finance/quoteSummary/AAPL?modules=incomeStatementHistory
    const stockUrl = `${proxyUrl}https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
    const response = await fetch(stockUrl);
    return response.json();
  }
  useEffect(() => {
    let timeoutId;
    async function getLastPrice() {
      try {
        const data = await getPriceData(SYMBOL);
        const res = data.chart.result[0];
        const value = res.meta.regularMarketPrice.toFixed(2);
        const time = new Date(res.meta.regularMarketTime * 1000);

        const quote = res.indicators.quote[0];
        const prices = res.timestamp.map((timestamp, index) => ({
          x: new Date(timestamp * 1000),
          y: [
            quote.open[index],
            quote.high[index],
            quote.low[index],
            quote.close[index],
          ].map(round),
        }));
        setSeries([{ data: prices }]);
        setLastPrice(value);
        setLastPriceTime(time);

        // timeoutId = setTimeout(getLastPrice, 5000);

        console.log(value);
        console.log(time.toLocaleTimeString());
      } catch (error) {
        console.log(error);
      }
    }
    getLastPrice();
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <motion.div whileHover={{ scale: 1.03 }}>
      <Card
        className="bg-white border-0 shadow-sm rounded-4 w-100 h-100"
        style={{ minHeight: "550px" }}
      >
        <Card.Body className="d-flex flex-column gap-2">
          <Chart
            options={chart.options}
            series={series}
            type="candlestick"
            width="100%"
            height={320}
          />
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default StockChart;
