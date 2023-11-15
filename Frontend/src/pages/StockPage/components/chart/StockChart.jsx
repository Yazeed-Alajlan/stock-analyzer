import React from "react";
import TradingViewWidget from "components/utils/TradingViewWidget";
import { CustomCard } from "components/utils/CustomCard";

const StockChart = () => {
  return (
    <CustomCard>
      <TradingViewWidget
        style={{
          width: "500px", // Change the width as needed
          height: "800px", // Change the height as needed
          /* You can add more styles if required */
        }}
      />
    </CustomCard>
  );
};

export default StockChart;
