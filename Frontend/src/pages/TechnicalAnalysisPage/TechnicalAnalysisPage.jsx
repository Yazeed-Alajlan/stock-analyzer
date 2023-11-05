import React from "react";
import FilterCard from "./components/FilterCard";
import PageLayout from "components/PageLayout";
import CardWithLink from "components/utils/CardWithLink";
import HawkesProcess from "./components/HawkesProcess";
import ConsolidatingStocks from "./components/ConsolidatingStocks";
import { Container } from "react-bootstrap";

const TechnicalAnalysisPage = () => {
  return (
    <PageLayout>
      <Container className="d-flex justify-contnet-center gap-4">
        <CardWithLink
          to={"/technical-analysis/hawkes-process"}
          label={"Hawkes Process"}
        />
        <CardWithLink
          to={"/technical-analysis/consolidating-stocks"}
          label={"Consolidating Stocks"}
        />
      </Container>

      {/* <FilterCard />
      <HawkesProcess />
      <ConsolidatingStocks /> */}
    </PageLayout>
  );
};

export default TechnicalAnalysisPage;
