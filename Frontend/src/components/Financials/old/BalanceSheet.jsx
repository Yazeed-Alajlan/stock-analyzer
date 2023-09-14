import { useState } from "react";
import { isEqual } from "lodash";
import CustomButton from "../../utils/CustomButton";
import HoverGraph from "../HoverGraph";

import { Table } from "react-bootstrap";
const BalanceSheet = ({ title, quarterlyData, annualData }) => {
  const [data, setData] = useState(quarterlyData);
  const [text, setText] = useState("Show Annual Data");

  console.log(quarterlyData);
  console.log(annualData);

  const toggleData = () => {
    if (isEqual(data, quarterlyData)) {
      setData(annualData);
      setText("Show Quarterly Data");
    } else {
      setData(quarterlyData);
      setText("Show Annual Datsa");
    }
  };
  const keys = data.length > 0 ? Object.keys(data[0]) : [];
  // Transpose the data
  const transposedData = keys.map((key) => ({
    field: key,
    values: data.map((entry) => entry[key]),
  }));
  const firstRowValues = transposedData[0].values;

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{title}</th>
            {firstRowValues.map((value, index) => (
              <th key={index}>{value}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transposedData.slice(1).map((rowData) => (
            <tr key={rowData.field}>
              {rowData.field !== "all_figures_in" &&
              rowData.field !== "all_currency_in" &&
              rowData.field !== "last_update_date" ? (
                <td>
                  <HoverGraph
                    text={rowData.field}
                    data={rowData.values}
                    years={firstRowValues}
                  />
                </td>
              ) : (
                <td>{rowData.field}</td>
              )}

              {/* <td>
                <HoverGraph
                  text={rowData.field}
                  data={rowData.values}
                  years={firstRowValues}
                />
              </td> */}
              {rowData.values.map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <CustomButton onClick={toggleData} title={text} />
    </div>
  );
};

export default BalanceSheet;
