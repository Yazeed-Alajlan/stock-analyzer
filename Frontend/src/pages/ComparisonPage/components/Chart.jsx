import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

const Chart2 = ({ stockFinancialData }) => {
  console.log("HIIIIIIIIII");
  const [view, setView] = useState("annual");
  const [balanceSheetData, setBalanceSheetData] = useState([]);
  const [incomeSheetData, setIncomeSheetData] = useState([]);
  const [cashFlowData, setCashFlowData] = useState([]);

  useEffect(() => {
    // Set initial data on component mount or when stockFinancialData changes
    if (stockFinancialData) {
      setBalanceSheetData(stockFinancialData.balanceSheet);
      setIncomeSheetData(stockFinancialData.incomeSheet);
      setCashFlowData(stockFinancialData.cashFlow);
    }
  }, [stockFinancialData]);

  const getDataForView = (data, view) => {
    return view === "annual" ? data : data.slice(0, 4); // Toggle between annual and quarterly
  };

  const chartData = {
    labels: getDataForView(balanceSheetData, view).map((item) => item.year),
    datasets: [
      {
        label: "Total Assets",
        data: getDataForView(balanceSheetData, view).map((item) =>
          parseFloat(item.total_assets.replace(/,/g, ""))
        ),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },
      // Add more datasets for other financial metrics from income sheet and cash flow
    ],
  };

  const toggleView = () => {
    setView(view === "annual" ? "quarterly" : "annual");
  };

  return (
    <div>
      <button onClick={toggleView}>
        Toggle View ({view === "annual" ? "Quarterly" : "Annual"})
      </button>
      <Line data={chartData} />
    </div>
  );
};

export default Chart2;
