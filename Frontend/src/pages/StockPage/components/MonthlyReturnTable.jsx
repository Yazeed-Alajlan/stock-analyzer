import axios from "axios";
import CardFlip from "components/utils/CardFlip";
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
  }, []);

  const sortedDates = Object.keys(data).sort();
  const uniqueYears = [
    ...new Set(sortedDates.map((date) => date.substring(0, 4))),
  ];

  return (
    <Table hover>
      <CardFlip />
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
                    ? "bg-dark-red text-light-red"
                    : "bg-dark-green text-light-green";
              }
              console.log(value);
              return (
                <td key={key} className={cellClass}>
                  {value !== null ? value.toFixed(2) : "-"}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default MonthlyReturnTable;
