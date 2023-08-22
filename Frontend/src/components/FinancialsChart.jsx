import React, { useState } from "react";
import { BarChart } from "./utils/BarChart";
import { CustomCard } from "./utils/CustomCard";
import CustomButton from "./utils/CustomButton";
import { isEqual } from "lodash";

const FinancialsChart = ({}) => {
  const quarterlyData = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Quarterly Data",
        data: [10, 20, 30, 40],
      },
      {
        label: "Quarterly Data2",
        data: [49, 15, 23, 12],
      },
    ],
  };

  const annualData = {
    labels: ["Q1", "Q2", "Q3"],
    datasets: [
      {
        label: "yearly Data",
        data: [10, 6, 40],
        fill: false,
        borderColor: "red",
      },
    ],
  };
  const [data, setData] = useState(quarterlyData);
  const [title, setTitle] = useState("Show Annual Data");

  const toggleData = () => {
    if (isEqual(data, quarterlyData)) {
      setData(annualData);
      setTitle("Show Quarterly Data");
    } else {
      setData(quarterlyData);
      setTitle("Show Annual Data");
    }
  };

  return (
    <CustomCard>
      <BarChart title={"porfit"} chartData={data} />
      <CustomButton onClick={toggleData} title={title} />
    </CustomCard>
  );
};

export default FinancialsChart;
