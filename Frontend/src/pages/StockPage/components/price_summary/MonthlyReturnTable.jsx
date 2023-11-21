import axios from "axios";
import CompnentLayout from "components/CompnentLayout";
import DynamicChart from "components/utils/DynamicChart";
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

const MonthlyReturnTable = ({ symbols }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `http://localhost:5000/python-api/${symbols}/price-summary`;
        const response = await axios.get(url);

        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [symbols]);

  let uniqueYears = [];
  if (data["monthly_returns"]) {
    const sortedDates = Object.keys(data["monthly_returns"]).sort();
    uniqueYears = [...new Set(sortedDates.map((date) => date.substring(0, 4)))];
  }
  function sortObjectByMonth(data) {
    if (data == null) return;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const sortedData = Object.entries(data)
      .sort((a, b) => months.indexOf(a[0]) - months.indexOf(b[0]))
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    return sortedData;
  }
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
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                  const key = `${year}-${String(m).padStart(2, "0")}`;
                  const value = data["monthly_returns"].hasOwnProperty(key)
                    ? data["monthly_returns"][key]
                    : null;
                  let cellClass = ""; // Default to a neutral (grey) background

                  if (value !== null) {
                    cellClass =
                      value < 0
                        ? "border border-1  bg-dark-red text-light-red"
                        : "border border-1  bg-dark-green text-light-green";
                  }
                  return value !== null ? (
                    <td
                      // style={{ border: "1px solid #fff" }}
                      key={key}
                      className={cellClass}
                    >
                      {value.toFixed(2)}
                    </td>
                  ) : (
                    <></> // or you can return null, an empty string, or any other placeholder
                  );
                })}
              </tr>
            ))}
        </tbody>
      </Table>
      <DynamicChart type={"bar"} data={data["monthly_returns"]} />
      <DynamicChart
        type={"bar"}
        data={sortObjectByMonth(data["monthly_returns_average"])}
      />
      <DynamicChart type={"bar"} data={data["price_change"]} />
    </CompnentLayout>
  );
};

export default MonthlyReturnTable;
