import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useStocksData } from "../../contexts/StocksDataContext";
import FinancialMetricsTable from "./FinancialMetricsTable";
import GeneralTable from "components/utils/GeneralTable";
import FinancialMetricsComparisonTable from "./FinancialMetricsComparisonTable";

const HomePage = () => {
  const navigate = useNavigate();

  const {
    stocksData,
    selectedStock,
    setSelectedStock,
    getAllBasicEarningsPerShareTTM,
    prepareFinancialMetricsComparisonTableData,
    getStocksWorkingCapitalRatio,
  } = useStocksData();

  const [earningsData, setEarningsData] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    getStocksWorkingCapitalRatio();
    const fetchEarningsData = async () => {
      try {
        setEarningsData(await getAllBasicEarningsPerShareTTM());
        setData(await prepareFinancialMetricsComparisonTableData());
      } catch (error) {
        // Handle error if necessary
        console.error("Error fetching earnings data:", error);
      }
    };

    fetchEarningsData();
  }, []);
  console.log(data);
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
