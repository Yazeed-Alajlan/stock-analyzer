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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [symbols]);

  const sortedDates = Object.keys(data).sort();
  const uniqueYears = [
    ...new Set(sortedDates.map((date) => date.substring(0, 4))),
  ];
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
          {uniqueYears.map((year) => (
            <tr key={year}>
              <td>{year}</td>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                const key = `${year}-${String(m).padStart(2, "0")}`;
                const value = data.hasOwnProperty(key) ? data[key] : null;
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
      <DynamicChart type={"bar"} data={data} />
    </CompnentLayout>
  );
};

export default MonthlyReturnTable;
