import TabsWithIndicator from "components/TabsWithIndicator";
import { CustomCard } from "components/utils/cards/CustomCard";
import React from "react";
import MonthlyReturnTable from "./MonthlyReturnTable";
import { useParams } from "react-router-dom";

const StockAnalysis = () => {
  const { symbol, sector } = useParams();

  const tabs = [
    {
      name: "tab1",
      label: "العوائد الشهرية",
      render: () => {
        return <MonthlyReturnTable symbol={symbol} />;
      },
    },
    {
      name: "tab2",
      label: "Tab 2",
      render: () => {
        return (
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Incidunt222222222222222 eveniet...
          </p>
        );
      },
    },
    {
      name: "tab3",
      label: "Tab 3",
      render: () => {
        return (
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Incidunt222222222222222 eveniet...
          </p>
        );
      },
    },
    {
      name: "tab4",
      label: "Tab 4",
      render: () => {
        return (
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Incidunt222222222222222 eveniet...
          </p>
        );
      },
    },
    {
      name: "tab5",
      label: "Tab 5",
      render: () => {
        return (
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Incidunt222222222222222 eveniet...
          </p>
        );
      },
    },
  ];
  return (
    <CustomCard header={"تحليل"}>
      <TabsWithIndicator tabs={tabs} />
    </CustomCard>
  );
};

export default StockAnalysis;
