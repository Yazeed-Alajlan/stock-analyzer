import React, { useEffect, useState } from "react";
import { Line, Bar, Radar } from "react-chartjs-2";
import { motion } from "framer-motion";

import ButtonsGroup from "./ButtonsGroup";
import { TbChartBar, TbChartLine } from "react-icons/tb";
import CusotmModal from "./CusotmModal";

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
        backgroundColor: "rgba(117,125,232)",
      },
    ],
  };

  return formatData; // Returning with correct
};

const DynamicChart = ({ type, data }) => {
  const [chartType, setChartType] = useState(type);
  const [chartData, setChartData] = useState();
  const [modal, setModal] = useState(false);

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
  } else {
    ChartComponent = Bar;
  }

  const chartTypeButtons = [
    { name: "bar", icon: TbChartBar },
    { name: "line", icon: TbChartLine },
  ];
  return (
    <>
      <motion.div
        animate={{
          scale: modal ? 0.8 : 1,
          opacity: modal ? 0.4 : 1,
        }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      >
        <ButtonsGroup
          buttons={chartTypeButtons}
          parentSetState={setChartType}
        />
        <button
          onClick={() => {
            setModal(!modal);
          }}
        >
          adsasd
        </button>
        {chartData && data && (
          <ChartComponent data={chartData} options={options} />
        )}
      </motion.div>
      <CusotmModal {...{ modal, setModal }}>
        <div>HII</div>
      </CusotmModal>
      {/* <CusotmModal /> */}
    </>
  );
};

export default DynamicChart;
