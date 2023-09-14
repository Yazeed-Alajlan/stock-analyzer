import { useState } from "react";
import { isEqual } from "lodash";
import CustomButton from "../utils/CustomButton";
import HoverGraph from "./HoverGraph";
import { Container, Table } from "react-bootstrap";
import { BsCalendar3, BsGraphUp } from "react-icons/bs";

const FinancialsTab = ({ title, quarterlyData, annualData }) => {
  const [data, setData] = useState(quarterlyData);
  const [text, setText] = useState("سنوي");

  const toggleData = () => {
    if (isEqual(data, quarterlyData)) {
      setData(annualData);
      setText("ربع سنوي");
    } else {
      setData(quarterlyData);
      setText("سنوي");
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
    <Container>
      <div className="d-flex align-items-center py-4 gap-4 ">
        <div className="fs-2">
          <span className="mx-2">
            <BsCalendar3 />
          </span>
          المدة:
        </div>
        <CustomButton onClick={toggleData} title={text} />
      </div>

      <Table className="fs-5 " responsive hover>
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
                <>
                  <td>
                    <HoverGraph
                      text={rowData.field}
                      data={rowData.values}
                      years={firstRowValues}
                    />
                  </td>
                  {rowData.values.map((value, index) => (
                    <td
                      key={index}
                      className={
                        // Change to black if it includes "-" and has a length of 1
                        value.includes("-") && value.length === 1
                          ? ""
                          : // Change to red if it includes "-" but doesn't meet the first condition
                          value.includes("-")
                          ? "text-danger"
                          : // Make it green for all other cases
                            "text-success"
                      }
                    >
                      {value}
                    </td>
                  ))}
                </>
              ) : (
                <>
                  <td>{rowData.field}</td>
                  {rowData.values.map((value, index) => (
                    <td key={index}>{value}</td>
                  ))}
                </>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default FinancialsTab;
