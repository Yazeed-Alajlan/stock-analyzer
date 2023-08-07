import { useState } from "react";
import { isEqual } from "lodash";
import CustomButton from "../utils/CustomButton";
const CashSheet = () => {
  const quarterlyData = {
    data: [10000000000000000, 20, 30, 40],
  };

  const annualData = {
    data: [100, 200, 300],
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

export default CashSheet;
