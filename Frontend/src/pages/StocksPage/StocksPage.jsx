import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useStocksData } from "contexts/StocksDataContext";
import PageLayout from "components/PageLayout";
import { CustomCard } from "components/utils/cards/CustomCard";

import StocksMainTable from "./StocksMainTable";

const StocksPage = () => {
  let { sector } = useParams();
  if (sector == "all") sector = "جميع القطاعات";
  const { stocksData } = useStocksData();
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    if (stocksData) {
      console.log(stocksData);
      const formattedData = stocksData.map((data) => ({
        company: data.symbol + " - " + data.tradingNameAr,
        sectorNameAr: data.sectorNameAr,

        ...data.summary[data.summary.length - 1],
      }));
      setFilteredData(formattedData);
    }
    console.log(filteredData);
  }, [stocksData]);

  return (
    <PageLayout title={"الشركات"} className="d-flex flex-column gap-4">
      <CustomCard>
        {filteredData && (
          <StocksMainTable
            tableData={filteredData}
            tableColumns={[
              {
                Header: "الشركة",
                accessor: "company",
              },
              {
                Header: "الإفتتاح",
                accessor: "open",
              },
              {
                Header: "الأعلى",
                accessor: "high",
              },
              {
                Header: "الأدنى",
                accessor: "low",
              },
              {
                Header: "الإغلاق",
                accessor: "close",
              },
              {
                Header: "التغيير",
                accessor: "change_value",
              },
              {
                Header: "نسبة التغيير",
                accessor: "change_ratio",
              },
              {
                Header: "الكمية المتداولة",
                accessor: "trade_count",
              },
              {
                Header: "القيمة المتداولة",
                accessor: "trade_value",
              },
              {
                Header: "الأعلى آخر 52 أسبوع",
                accessor: "fifty_two_week_high",
              },
              {
                Header: "الأدنى آخر 52 أسبوع",
                accessor: "fifty_two_week_low",
              },

              // Add more columns as needed
            ]}
          />
        )}
      </CustomCard>
    </PageLayout>
  );
};

export default StocksPage;
