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
  let sortedMonths = [];

  if (data["monthly_returns"]) {
    const dates = Object.keys(data["monthly_returns"]);
    sortedMonths = dates.sort((a, b) => new Date(a) - new Date(b));
    uniqueYears = [
      ...new Set(sortedMonths.map((date) => date.substring(0, 4))),
    ];
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
      .sort((a, b) => {
        const [aYear, aMonth] = a[0].split("-");
        const [bYear, bMonth] = b[0].split("-");
        if (aYear !== bYear) {
          return parseInt(aYear, 10) - parseInt(bYear, 10);
        }
        return months.indexOf(aMonth) - months.indexOf(bMonth);
      })
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
