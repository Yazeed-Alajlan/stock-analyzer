import React from "react";
import FilterCard from "./components/FilterCard";
import PageLayout from "components/PageLayout";
import Card from "components/utils/Card";
const TechnicalAnalysisPage = () => {
  return (
    <PageLayout>
      <FilterCard />
      <Card />
    </PageLayout>
  );
};

export default TechnicalAnalysisPage;
