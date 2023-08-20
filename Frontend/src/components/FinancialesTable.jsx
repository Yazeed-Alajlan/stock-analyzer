import { motion } from "framer-motion";
import { Tab, Tabs } from "react-bootstrap";
import { CustomCard } from "./utils/CustomCard";
import BalanceSheet from "./sheets/BalanceSheet";
import IncomeSheet from "./sheets/IncomeSheet";
import CashSheet from "./sheets/CashSheet";
import React, { useEffect, useState } from "react";
import axios from "axios";
const FinancialesTable = () => {
  const [data, setData] = useState(null);
  console.log(data);
  console.log("data");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <motion.div whileHover={{ scale: 1.03 }}>
      <div>
        {data ? (
          <CustomCard>
            <Tabs defaultActiveKey={"Balance Sheet"}>
              <Tab eventKey={"Balance Sheet"} title="Balance Sheet">
                <BalanceSheet
                  annualData={data.balanceSheet}
                  quarterlyData={data.balanceSheetQuarterly}
                />
              </Tab>
              <Tab eventKey={"Statment of Income"} title="Statment of Income">
                <IncomeSheet
                  annualData={data.incomeSheet}
                  quarterlyData={data.incomeSheetQuarterly}
                />
              </Tab>
              <Tab eventKey={"Cash Flow"} title="Cash Flow">
                <CashSheet
                  annualData={data.cashFlow}
                  quarterlyData={data.cashFlowQuarterly}
                />
              </Tab>
            </Tabs>
          </CustomCard>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {/* <CustomCard>
        <Tabs defaultActiveKey={"Balance Sheet"}>
          <Tab eventKey={"Balance Sheet"} title="Balance Sheet">
            <BalanceSheet
              annualData={data.balanceSheet}
              quarterlyData={data.balanceSheetQuarterly}
            />
          </Tab>
          <Tab eventKey={"Statment of Income"} title="Statment of Income">
            <IncomeSheet
              annualData={data.incomeSheet}
              quarterlyData={data.incomeSheetQuarterly}
            />
          </Tab>
          <Tab eventKey={"Cash Flow"} title="Cash Flow">
            <CashSheet
              annualData={data.cashFlow}
              quarterlyData={data.cashFlowQuarterly}
            />
          </Tab>
        </Tabs>
      </CustomCard> */}
    </motion.div>
  );
};

export default FinancialesTable;
