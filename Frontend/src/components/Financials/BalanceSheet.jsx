import { useState } from "react";
import { isEqual } from "lodash";
import CustomButton from "../utils/CustomButton";
import HoverGraph from "./HoverGraph";

import { Table } from "react-bootstrap";
const BalanceSheet = ({ quarterlyData, annualData }) => {
  const [data, setData] = useState(quarterlyData);
  const [title, setTitle] = useState("Show Annual Data");

  console.log(quarterlyData);
  console.log(annualData);

  const toggleData = () => {
    if (isEqual(data, quarterlyData)) {
      setData(annualData);
      setTitle("Show Quarterly Data");
    } else {
      setData(quarterlyData);
      setTitle("Show Annual Datsa");
    }
  };
  const years = data.map((entry) => entry.year);
  const keys = data.length > 0 ? Object.keys(data[0]) : [];
  // Transpose the data
  const transposedData = keys.map((key) => ({
    field: key,
    values: data.map((entry) => entry[key]),
  }));
  // Separate the first row as headers and the rest as data
  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Field</th>
            {data.map((entry, index) => (
              <th key={index}>{entry.year}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transposedData.map((rowData) => (
            <tr key={rowData.field}>
              <td>{rowData.field}</td>
              {rowData.values.map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <CustomButton onClick={toggleData} title={title} />
    </div>
  );
};

export default BalanceSheet;
