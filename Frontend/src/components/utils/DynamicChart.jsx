import React, { useState, useEffect } from "react";
import { Line, Bar, Radar } from "react-chartjs-2";

const DynamicChart = ({ type, data }) => {
  if (!data || Object.keys(data).length === 0) {
    const emptyData = {
      labels: [],
      datasets: [],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    return (
      <div>
        <Bar data={emptyData} options={options} />
      </div>
    );
  }

  const datasets = Object.keys(data).map((key, index) => {
    const values = data[key].map((item) => ({
      x: item.year,
      y: parseInt(item.value.replace(/,/g, "")),
    }));

    return {
      label: key.replace("_", " ").toUpperCase(),
      data: values,
      borderColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)}, 1)`,
      backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)}, 0.2)`,
    };
  });

  const chartData = {
    labels: data[Object.keys(data)[0]].map((item) => item.year),
    datasets: datasets,
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  let ChartComponent;
  if (type === "line") {
    ChartComponent = Line;
  } else if (type === "bar") {
    ChartComponent = Bar;
  } else if (type === "radar") {
    ChartComponent = Radar;
  } else {
    // Default to Bar chart for invalid type or when type is not provided
    ChartComponent = Bar;
  }
  return (
    <div>
      <ChartComponent data={chartData} options={options} />
    </div>
  );
};

export default DynamicChart;
