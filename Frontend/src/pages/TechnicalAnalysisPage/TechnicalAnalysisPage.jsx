import React from "react";
import { Container } from "react-bootstrap";
import PageLayout from "components/PageLayout";
import { FaChartBar, FaSignal } from "react-icons/fa"; // Import FontAwesome icons
import {
  TbReportAnalytics,
  TbDeviceAnalytics,
  TbChartCandle,
} from "react-icons/tb";
import { useStocksData } from "contexts/StocksDataContext";

import CardWithLink from "components/utils/cards/CardWithLink";
import CandlestickAndIndicatorsChart from "./analysis/CandlestickAndIndicatorsChart";
import { CustomCard } from "components/utils/cards/CustomCard";
import ResizableComponent from "./analysis/ResizableComponent";

const TechnicalAnalysisPage = () => {
  return (
    <PageLayout fullPage={true} title={"main"}>
      <>
        {/* {data && (
          <>
            <CustomChart
              title="My Chart Title"
              x_axis={Object.keys(data.result.daily_avg_volume_norm)}
              y_axis={Object.values(data.result.daily_avg_volume_norm)}
            />
            <CustomChart
              title="My Chart Title"
              x_axis={Object.keys(data.daily_avg_volume_per_day)}
              y_axis={Object.values(data.daily_avg_volume_per_day)}
            />
          </>
        )} */}
        <ResizableComponent />
        <CardWithLink
          to="/monthly-returns"
          label="Monthly Returns"
          icon={<TbReportAnalytics size={50} />}
        />
        {/* <CardWithLink
          to="/consolidating-stocks"
          label="Consolidating Stocks"
          icon={<FaChartBar size={50} />}
        />
        <CardWithLink
          to="/japanese-candlestick"
          label="Japanese Candlestick"
          icon={<TbChartCandle size={50} />}
        />
        <CardWithLink
          to="/hawkes-process"
          label="Hawkes Process"
          icon={<FaSignal size={50} />}
        />

        <CardWithLink
          to="/technical-analysis-automation"
          label="Technical Analysis"
          icon={<TbDeviceAnalytics size={50} />}
        />
        <CardWithLink
          to="/vsa"
          label="VSA"
          icon={<TbDeviceAnalytics size={50} />}
        /> */}
        {/* <CardWithLink
          to="/"
          label="volume Seasonality Daily"
          icon={<TbDeviceAnalytics size={50} />}
        /> */}
      </>
    </PageLayout>
  );
};

export default TechnicalAnalysisPage;
