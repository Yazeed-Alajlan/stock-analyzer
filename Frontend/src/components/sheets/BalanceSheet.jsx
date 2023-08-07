import { useState } from "react";
import { head, isEqual } from "lodash";
import CustomButton from "../utils/CustomButton";
import { Table } from "react-bootstrap";
const BalanceSheet = () => {
  const quarterlyData = {
    data: [1, 2, 3, 4],
  };

  const annualData = {
    data: [11, 22, 33],
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
  const data2 = [
    [
      "Breakdown",
      "TTM",
      "12/30/2022",
      "12/30/2021",
      "12/30/2020",
      "12/30/2019",
    ],
    [
      "Total Revenue",
      "81,462,000",
      "81,462,000",
      "53,823,000",
      "31,536,000",
      "24,578,000",
    ],
    [
      "Operating Revenue",
      "81,462,000",
      "81,462,000",
      "53,823,000",
      "31,536,000",
      "24,578,000",
    ],
  ];
  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            {data2[0].map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data2.slice(1).map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, index) => (
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
