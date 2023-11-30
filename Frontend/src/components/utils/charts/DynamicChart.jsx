import React, { useEffect, useState } from "react";
import { Line, Bar, Radar } from "react-chartjs-2";
import { motion } from "framer-motion";
import { TbChartBar, TbChartLine, TbTable } from "react-icons/tb";
import Table from "../Table";
import ButtonsGroup from "../buttons/ButtonsGroup";
import CustomButton from "../buttons/CustomButton";
import CustomModal from "../modals/CustomModal";

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
  console.log(data);
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    const convertedData = convertDataFormat(data);
    console.log(data);
    console.log([
      { name: "John Doe", age: 30, location: "New York" },
      { name: "Jane Smith", age: 25, location: "San Francisco" },
    ]);
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
        <div className="d-flex justify-content-between">
          <ButtonsGroup
            buttons={chartTypeButtons}
            parentSetState={setChartType}
          />
          <CustomButton
            icon={TbTable}
            onClick={() => {
              setModal(!modal);
            }}
          />
        </div>

        {chartData && data && (
          <ChartComponent data={chartData} options={options} />
        )}
      </motion.div>

      {chartData && data && (
        <CustomModal {...{ modal, setModal }}>
          <Table
            columns={[
              {
                Header: "Year",
                accessor: "year",
              },
              {
                Header: "Change in %",
                accessor: "changePercentage",
              },

              // Add more columns as needed
            ]}
            data={transformData(data, "year", "changePercentage")}
          />
        </CustomModal>
      )}
    </>
  );
};
function transformData(data, yearKeyName, changeKeyName) {
  return Object.keys(data).map((key) => {
    const obj = {};
    obj[yearKeyName] = key;
    obj[changeKeyName] = data[key];
    return obj;
  });
}
export default DynamicChart;
