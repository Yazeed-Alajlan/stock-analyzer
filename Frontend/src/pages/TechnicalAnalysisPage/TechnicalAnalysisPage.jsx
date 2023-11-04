import React from "react";
import FilterCard from "./components/FilterCard";
import PageLayout from "components/PageLayout";
import Card from "components/utils/Card";
import HawkesProcess from "./components/HawkesProcess";
import ConsolidatingStocks from "./components/ConsolidatingStocks";
const TechnicalAnalysisPage = () => {
  return (
    <PageLayout>
      <FilterCard />
      <Card />
      <HawkesProcess />
      <ConsolidatingStocks />
    </PageLayout>
  );
};

export default TechnicalAnalysisPage;
