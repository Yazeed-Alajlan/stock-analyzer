import TabsWithIndicator from "components/TabsWithIndicator";
import { CustomCard } from "components/utils/cards/CustomCard";
import React, { useEffect, useState } from "react";
import MonthlyReturnTable from "./MonthlyReturnTable";
import { useParams } from "react-router-dom";
import axios from "axios";
import DynamicChart from "components/utils/charts/DynamicChart";

const StockAnalysis = () => {
  const { symbol, sector } = useParams();

  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `http://localhost:5000/python-api/${symbol}/price-summary`;
        const response = await axios.get(url);

        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [symbol]);

  {
    /* <DynamicChart type={"bar"} data={data["monthly_returns"]} />
      <DynamicChart type={"bar"} data={data["monthly_returns_average"]} />
      <DynamicChart type={"bar"} data={data["price_change"]} /> */
  }

  const renderTabs = () => {
    if (Object.keys(data).length === 0) {
      return <p>Loading...</p>; // Display a loading indicator or message while data is being fetched
    } else {
      const tabs = [
        {
          name: "tab1",
          label: "العوائد الشهرية",
          render: () => {
            return <MonthlyReturnTable data={data["monthly_returns"]} />;
          },
        },
        {
          name: "tab2",
          label: "متوسط العوائد الشهرية",
          render: () => {
            return (
              <DynamicChart
                type={"bar"}
                data={data["monthly_returns_average"]}
              />
            );
          },
        },
        {
          name: "tab3",
          label: "توزيع تغير الشموع",
          render: () => {
            return <DynamicChart type={"bar"} data={data["price_change"]} />;
          },
        },
        // {
        //   name: "tab4",
        //   label: "Tab 4",
        //   render: () => {
        //     return (
        //       <p>
        //         Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        //         Incidunt222222222222222 eveniet...
        //       </p>
        //     );
        //   },
        // },
        // {
        //   name: "tab5",
        //   label: "Tab 5",
        //   render: () => {
        //     return (
        //       <p>
        //         Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        //         Incidunt222222222222222 eveniet...
        //       </p>
        //     );
        //   },
        // },
      ];
      return <TabsWithIndicator tabs={tabs} />;
    }
  };

  return <CustomCard header={"تحليل"}>{renderTabs()}</CustomCard>;
};

export default StockAnalysis;
