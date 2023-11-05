import React from "react";
import { Container } from "react-bootstrap";
import PageLayout from "components/PageLayout";
import { FaChartBar, FaMoneyBillWave, FaSignal } from "react-icons/fa"; // Import FontAwesome icons
import CardWithLink from "components/utils/CardWithLink";

const TechnicalAnalysisPage = () => {
  return (
    <PageLayout>
      <Container className="d-flex justify-content-center flex-wrap gap-5">
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
      </Container>
    </PageLayout>
  );
};

export default TechnicalAnalysisPage;
