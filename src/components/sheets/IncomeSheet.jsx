import { useState } from "react";
import { isEqual } from "lodash";
import CustomButton from "../utils/CustomButton";
const IncomeSheet = () => {
  const quarterlyData = {
    data: [88, 99, 88, 99],
  };

  const annualData = {
    data: [55, 55, 55],
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
    <div>
      {data.data}
      <CustomButton onClick={toggleData} title={title} />
    </div>
  );
};

export default IncomeSheet;
