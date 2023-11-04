import axios from "axios";
import StockChart from "pages/StockPage/components/StockChart";
import React, { useEffect, useState } from "react";

const ConsolidatingStocks = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `http://localhost:5000/python-api/consolidating-stocks`;
        const response = await axios.get(url);

        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <button onClick={() => console.log(data)}></button>
      <div>
        {Object.keys(data).map((symbol) => (
          <StockChart key={symbol} symbol={symbol} />
        ))}
      </div>
    </div>
  );
};

export default ConsolidatingStocks;
