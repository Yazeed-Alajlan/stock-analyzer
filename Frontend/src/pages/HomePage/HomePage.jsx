import axios from "axios";
import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useStocksData } from "../../contexts/StocksDataContext";

const HomePage = () => {
  const navigate = useNavigate();

  const { stocksData, selectedStock, setSelectedStock } = useStocksData();

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
                sector: stock.sectorNameEn,
              }))
            }
            isSearchable={true}
            onChange={handleStockSelect}
          />
        </div>
      </div>
    </Container>
  );
};

export default HomePage;
