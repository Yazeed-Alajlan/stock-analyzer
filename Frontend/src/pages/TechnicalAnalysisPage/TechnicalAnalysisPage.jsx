import React from "react";
import { Container } from "react-bootstrap";
import PageLayout from "components/PageLayout";
import { FaChartBar, FaMoneyBillWave, FaSignal } from "react-icons/fa"; // Import FontAwesome icons
import CardWithLink from "components/utils/CardWithLink";
import ChartPatterns from "./components/ChartPatterns";

const TechnicalAnalysisPage = () => {
  // const generateCandleData = () => {
  //   // Generate random data for demonstration
  //   const numDataPoints = 40; // Adjust this as needed
  //   const labels = [];
  //   const openData = [];
  //   const closeData = [];
  //   const highData = [];
  //   const lowData = [];

  //   for (let i = 1; i <= numDataPoints; i++) {
  //     labels.push(`2023-01-${i}`);
  //     openData.push(Math.random() * 10 + 100);
  //     closeData.push(Math.random() * 10 + 100);
  //     highData.push(Math.random() * 5 + 105);
  //     lowData.push(Math.random() * 5 + 95);
  //   }

  //   return {
  //     labels,
  //     datasets: [
  //       {
  //         label: "Open",
  //         data: openData,
  //         borderColor: "green",
  //         fill: false,
  //       },
  //       {
  //         label: "Close",
  //         data: closeData,
  //         borderColor: "red",
  //         fill: false,
  //       },
  //       {
  //         label: "High",
  //         data: highData,
  //         borderColor: "blue",
  //         fill: false,
  //       },
  //       {
  //         label: "Low",
  //         data: lowData,
  //         borderColor: "yellow",
  //         fill: false,
  //       },
  //     ],
  //   };
  // };

  // const candleData = generateCandleData();

  // const pattern = {
  //   base_x: 28,
  //   tip_x: 54,
  //   conf_x: 64,
  //   base_y: 9.482419472170507,
  //   tip_y: 9.631779064502577,
  //   resist_intercept: 9.631770549831993,
  //   resist_slope: -0.0015260238359069951,
  //   support_intercept: 9.581012436685473,
  //   support_slope: -0.0005602729477214595,
  //   flag_width: 10,
  // };

  // const pad = 2;

  return (
    <PageLayout>
      <Container className="d-flex justify-content-center flex-wrap gap-5">
        {/* <ChartPatterns candleData={candleData} pattern={pattern} pad={pad} /> */}

        <CardWithLink
          to="consolidating-stocks"
          label="Consolidating Stocks"
          icon={<FaChartBar size={50} />} // Pass the icon as a prop
        />
        <CardWithLink
          to="japanese-candlestick"
          label="Japanese Candlestick"
          icon={<FaMoneyBillWave size={50} />} // Pass the icon as a prop
        />
        <CardWithLink
          to="hawkes-process"
          label="Hawkes Process"
          icon={<FaSignal size={50} />} // Pass the icon as a prop
        />
        <CardWithLink
          to="monthly-returns"
          label="Monthly Returns"
          icon={<FaSignal size={50} />} // Pass the icon as a prop
        />
      </Container>
    </PageLayout>
  );
};

export default TechnicalAnalysisPage;
