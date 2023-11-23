import React from "react";
import TradingViewWidget from "components/utils/TradingViewWidget";
import { CustomCard } from "components/utils/CustomCard";

const StockChart = () => {
  return (
    <CustomCard>
      <div
        style={{
          width: "1000px", // Change the width as needed
          height: "1000px", // Change the height as needed
          /* You can add more styles if required */
        }}
      >
        <TradingViewWidget />
      </div>
    </CustomCard>
  );
};

export default StockChart;
