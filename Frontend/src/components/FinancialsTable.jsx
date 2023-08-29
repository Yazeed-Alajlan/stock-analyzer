import { motion } from "framer-motion";
import { Tab, Tabs } from "react-bootstrap";
import { CustomCard } from "./utils/CustomCard";
import BalanceSheet from "./Financials/BalanceSheet";
import IncomeStatement from "./Financials/IncomeStatement";
import CashFlow from "./Financials/CashFlow";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

const FinancialsTable = () => {
  const [data, symbol] = useOutletContext();

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
                <IncomeStatement
                  annualData={data.incomeSheet}
                  quarterlyData={data.incomeSheetQuarterly}
                />
              </Tab>
              <Tab eventKey={"Cash Flow"} title="Cash Flow">
                <CashFlow
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
    </motion.div>
  );
};

export default FinancialsTable;
