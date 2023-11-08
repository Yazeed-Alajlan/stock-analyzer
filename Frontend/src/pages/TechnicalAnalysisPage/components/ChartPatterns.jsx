import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const ChartPatterns = () => {
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

  if (data && data.data && data.bear_flags) {
    const candleData = data.data;
    const pattern = data.bear_flags[0];
    const datesArray = Object.keys(candleData.close);

    // Prepare the data for the candlestick chart
    const chartData = Object.keys(candleData).map((item, index) => ({
      x: datesArray[index],
      y: [
        candleData.open[index],
        candleData.high[index],
        candleData.low[index],
        candleData.close[index],
      ],
    }));

    // Prepare data for the pattern lines
    // const patternLines = [
    //   {
    //     x: new Date(candleData[pattern.base_x].date).getTime(),
    //     label: "Pole Line",
    //     borderColor: "white",
    //     offsetY: -30,
    //   },
    //   {
    //     x: new Date(candleData[pattern.tip_x].date).getTime(),
    //     label: "Tip Line",
    //     borderColor: "blue",
    //     offsetY: -30,
    //   },
    //   // Add other pattern lines as needed
    // ];

    const series = [
      {
        data: chartData,
        type: "candlestick",
      },
      // {
      //   data: patternLines,
      //   type: "line",
      //   name: "Pattern Lines",
      //   color: "blue",
      //   fill: {
      //     type: "solid",
      //     color: "blue",
      //     opacity: 0.2,
      //   },
      // },
    ];

    const options = {
      chart: {
        height: 400,
        type: "candlestick",
      },
      title: {
        text: "Candlestick Chart with Pattern Lines",
      },
      xaxis: {
        type: "datetime",
      },
    };

    return (
      <ReactApexChart
        options={options}
        series={series}
        type="candlestick"
        height={400}
      />
    );
  }

  return <div>Loading...</div>;
};

export default ChartPatterns;
