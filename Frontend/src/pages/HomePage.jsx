import axios from "axios";
import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost:5000/companies";
        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleStockSelect = (selectedOption) => {
    navigate(
      `/companies/${selectedOption.sector}/${selectedOption.value}/information`
    );
    setSelectedOption(null); // Replace setSelectedOption with your state setter
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
            value={selectedOption}
            options={
              data &&
              data.map((stock) => ({
                value: stock.symbol,
                label: `${stock.tradingNameEn} (${stock.symbol})`,
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
