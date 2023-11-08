import axios from "axios";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const ChartPatterns = ({ candleData, pattern, pad }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const symbol = "2222";
        const url = `http://localhost:5000/python-api/flags-pennants`;
        const response = await axios.get(url);

        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const start_i = pattern.base_x - pad;
  const end_i = pattern.conf_x + 1 + pad;

  const chartData = {
    labels: candleData.labels.slice(start_i, end_i),
    datasets: candleData.datasets,
  };

  const poleLine = {
    type: "line",
    x0: pattern.base_x,
    x1: pattern.tip_x,
    y0: pattern.base_y,
    y1: pattern.tip_y,
    borderColor: "white",
    borderDash: [5, 5],
  };

  const upperLine = {
    type: "line",
    x0: pattern.tip_x,
    x1: pattern.conf_x,
    y0: pattern.resist_intercept,
    y1: pattern.resist_intercept + pattern.resist_slope * pattern.flag_width,
    borderColor: "blue",
    borderDash: [5, 5],
  };

  const lowerLine = {
    type: "line",
    x0: pattern.tip_x,
    x1: pattern.conf_x,
    y0: pattern.support_intercept,
    y1: pattern.support_intercept + pattern.support_slope * pattern.flag_width,
    borderColor: "blue",
    borderDash: [5, 5],
  };

  const alines = [poleLine, upperLine, lowerLine];

  const options = {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Price",
        },
      },
    },
  };

  return <Line data={chartData} options={options} alines={alines} />;
};

export default ChartPatterns;
