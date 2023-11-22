import React, { useEffect, useState } from "react";
import { Line, Bar, Radar } from "react-chartjs-2";
import Tab from "./Tab";
import Tabs from "./Tabs";
import { TbChartBar, TbChartLine } from "react-icons/tb";
import { ButtonGroup } from "react-bootstrap";
import ButtonsGroup from "./ButtonsGroup";

const convertDataFormat = (data) => {
  if (!data || Object.keys(data).length === 0) {
    return {
      labels: [],
      datasets: [],
    };
  }

  // Object with multiple values
  if (Array.isArray(Object.values(data)[0])) {
    const labels = data[Object.keys(data)[0]].map((item) => item.year);
    const datasets = Object.keys(data).map((key) => ({
      label: key.replace("_", " ").toUpperCase(),
      data: data[key].map((item) => ({
        x: item.year,
        y: parseInt(item.value.replace(/,/g, "")),
      })),
      borderColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)}, 1)`,
      backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)}, 0.2)`,
    }));

    return { labels, datasets };
  }
  // Single Value
  const formatData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Data",
        data: Object.values(data),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return formatData; // Returning with correct
};

const DynamicChart = ({ type, data }) => {
  const [chartType, setChartType] = useState(type);
  const [chartData, setChartData] = useState();
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    const convertedData = convertDataFormat(data);
    setChartData(convertedData);
  }, [data]);

  let ChartComponent;
  if (chartType === "line") {
    ChartComponent = Line;
  } else if (chartType === "bar") {
    ChartComponent = Bar;
  } else if (chartType === "radar") {
    ChartComponent = Radar;
  } else {
    ChartComponent = Bar;
  }

  const changeChartType = (newType) => {
    setChartType(newType);
  };

  const chartTypeButtons = [
    { id: 1, title: "سنوي" },
    { id: 2, title: "ربع سنوي" },
  ];
  return (
    <div>
      <div>
        <ButtonsGroup
          buttons={chartTypeButtons}
          parentSetState={setChartType}
        />
        <button onClick={() => changeChartType("line")}>Line Chart</button>
        <button onClick={() => changeChartType("bar")}>Bar Chart</button>
        <button onClick={() => changeChartType("radar")}>Radar Chart</button>
      </div>
      {chartData && data && (
        <ChartComponent data={chartData} options={options} />
      )}
    </div>
  );
};

export default DynamicChart;
