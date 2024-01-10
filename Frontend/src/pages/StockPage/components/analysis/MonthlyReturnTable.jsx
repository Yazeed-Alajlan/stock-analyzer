import axios from "axios";
import CompnentLayout from "components/CompnentLayout";
import DynamicChart from "components/utils/charts/DynamicChart";
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

const MonthlyReturnTable = ({ symbol }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `http://localhost:5000/python-api/${symbol}/price-summary`;
        const response = await axios.get(url);

        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [symbol]);

  let uniqueYears = [];
  let sortedMonths = [];

  if (data["monthly_returns"]) {
    const dates = Object.keys(data["monthly_returns"]);
    sortedMonths = dates.sort((a, b) => new Date(a) - new Date(b));
    uniqueYears = [
      ...new Set(sortedMonths.map((date) => date.substring(0, 4))),
    ];
  }
  console.log(data);

  return (
    <CompnentLayout>
      <Table className="text-center" responsive>
        <thead>
          <tr>
            <th>Year</th>
            <th>Jan</th>
            <th>Feb</th>
            <th>Mar</th>
            <th>Apr</th>
            <th>May</th>
            <th>Jun</th>
            <th>Jul</th>
            <th>Aug</th>
            <th>Sep</th>
            <th>Oct</th>
            <th>Nov</th>
            <th>Dec</th>
          </tr>
        </thead>
        <tbody>
          {data["monthly_returns"] &&
            uniqueYears.map((year) => (
              <tr key={year}>
                <td>{year}</td>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m, index) => {
                  const monthIndex = sortedMonths.findIndex((date) =>
                    date.startsWith(`${year}-${String(m).padStart(2, "0")}`)
                  );
                  const value =
                    monthIndex !== -1
                      ? data["monthly_returns"][sortedMonths[monthIndex]]
                      : null;
                  let cellClass = "";

                  if (value !== null) {
                    cellClass =
                      value < 0
                        ? "border border-1 bg-dark-red text-light-red"
                        : "border border-1 bg-dark-green text-light-green";
                  }
                  return value !== null ? (
                    <td key={index} className={cellClass}>
                      {value.toFixed(2)}
                    </td>
                  ) : (
                    <td key={index}></td>
                  );
                })}
              </tr>
            ))}
        </tbody>
      </Table>
      {/* <DynamicChart type={"bar"} data={data["monthly_returns"]} /> */}
      <DynamicChart type={"bar"} data={data["monthly_returns_average"]} />
      <DynamicChart type={"bar"} data={data["price_change"]} />
    </CompnentLayout>
  );
};

export default MonthlyReturnTable;
