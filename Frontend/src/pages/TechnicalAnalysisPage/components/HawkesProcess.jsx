import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

const HawkesProcess = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const symbol = "2222";
        const url = `http://localhost:5000/python-api/${symbol}/hawkes-process`;
        const response = await axios.get(url);

        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const chartData = {
    labels: data.date,
    datasets: [
      {
        label: "Close",
        data: data.log_close,
        yAxisID: "y-axis-1", // Assign to the first y-axis
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        pointRadius: 0, // Set pointRadius to 0 to remove data points
      },
      {
        label: "V Hawk",
        data: data.v_hawk,
        yAxisID: "y-axis-2", // Assign to the second y-axis
        fill: false,
        borderColor: "gold",
        pointRadius: 0, // Set pointRadius to 0 to remove data points
      },
      {
        label: "Q05",
        data: data.q05,
        yAxisID: "y-axis-2", // Assign to the second y-axis
        fill: false,
        borderColor: "red",
        pointRadius: 0, // Set pointRadius to 0 to remove data points
      },
      {
        label: "Q95",
        data: data.q95,
        yAxisID: "y-axis-2", // Assign to the second y-axis
        fill: false,
        borderColor: "blue",
        pointRadius: 0, // Set pointRadius to 0 to remove data points
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: [
        {
          id: "y-axis-1",
          type: "linear",
          position: "left",
          title: {
            display: true,
            text: "Close",
          },
        },
        {
          id: "y-axis-2",
          type: "linear",
          position: "right",
          title: {
            display: true,
            text: "V Hawk, Q05, Q95",
          },
        },
      ],
    },
  };

  return (
    <div>
      <div>ssssssssssssssssssssssssssssssssss</div>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default HawkesProcess;
