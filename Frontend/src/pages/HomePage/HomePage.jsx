import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useStocksData } from "../../contexts/StocksDataContext";
import FinancialMetricsTable from "./FinancialMetricsTable";
import GeneralTable from "components/utils/GeneralTable";
import FinancialMetricsComparisonTable from "./FinancialMetricsComparisonTable";
import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();

  const {
    stocksData,
    selectedStock,
    setSelectedStock,
    getAllBasicEarningsPerShareTTM,
    prepareFinancialMetricsComparisonTableData,
    getFinancialMetric,
  } = useStocksData();

  const [data, setData] = useState();
  const [earningsData, setEarningsData] = useState();
  const [workingCapitalRatioData, setWorkingCapitalRatioData] = useState();

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        setEarningsData(await getAllBasicEarningsPerShareTTM());
        setData(await prepareFinancialMetricsComparisonTableData());
        setWorkingCapitalRatioData(
          await getFinancialMetric("Leverage")
          //GrossProfitMargin - NetProfitMargin - Leverage - DebtToEquityRatio
        );
        const apiKey = "IQQ9D5BH9HYWE4UF";
        const symbol = "8180.SR"; // Aramco's stock symbol

        const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

        axios
          .get(apiUrl)
          .then((response) => {
            // Extract stock data from the response and set it to state
            console.log(response.data);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
        //IQQ9D5BH9HYWE4UF
      } catch (error) {
        // Handle error if necessary
        console.error("Error fetching earnings data:", error);
      }
    };

    fetchEarningsData();
  }, []);
  const handleStockSelect = (selectedOption) => {
    setSelectedStock(selectedOption);
    navigate(
      `/companies/${selectedOption.sector}/${selectedOption.value}/information`
    );
  };
  return (
    <Container className="mt-5">
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h1 className="text-center my-5">
          معلومات السوق السعودي , أدوات مالية ذكية , بيانات الشركات التاريخية ,
          مؤشرات مالية
        </h1>
        <div className="w-75 border border-5 rounded-1 my-5">
          <Select
            className="text-center"
            placeholder="ابحث  باسم الشركة أو الرمز"
            value={selectedStock}
            options={
              stocksData &&
              stocksData.map((stock) => ({
                value: stock.symbol,
                label: `${stock.tradingNameAr} (${stock.symbol})`,
                sector: stock.sectorNameAr,
              }))
            }
            isSearchable={true}
            onChange={handleStockSelect}
          />
        </div>
      </div>
      <Row className="d-flex flex-wrap">
        <Col xs={6}>
          {earningsData && (
            <FinancialMetricsTable
              header={"ربحية السهم الأساسية الأساسية"}
              tableData={earningsData}
              isScrollable
              filterBy={"sectorNameAr"}
              removeFilterFromColumn
            />
          )}
        </Col>
        <Col xs={6}>
          {workingCapitalRatioData && (
            <FinancialMetricsTable
              header={"نسبة رأس المال العامل"}
              tableData={workingCapitalRatioData}
              isScrollable
              filterBy={"sectorNameAr"}
              removeFilterFromColumn
            />
          )}
        </Col>
      </Row>
      <Row>
        {data && (
          <Col>
            {data && (
              <FinancialMetricsComparisonTable
                header={"قارن البيانات المالية"}
                tableData={data}
                isScrollable
                filterBy={"sectorNameAr"}
                removeFilterFromColumn
              />
            )}
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default HomePage;
