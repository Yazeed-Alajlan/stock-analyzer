import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { CustomCard } from "../utils/CustomCard";
import { useOutletContext } from "react-router-dom";
import FinancialsTab from "../Financials/FinancialsTab";

const FinancialsTable = () => {
  const [stockInformationData, stockFinancialData, symbol] = useOutletContext();

  return (
    <div>
      {stockFinancialData ? (
        <CustomCard>
          <Tabs className="p-0" defaultActiveKey={"Balance Sheet"}>
            <Tab eventKey={"Balance Sheet"} title={"المركز المالي"}>
              <FinancialsTab
                title={"المركز المالي"}
                annualData={stockFinancialData.balanceSheet}
                quarterlyData={stockFinancialData.balanceSheetQuarterly}
              />
            </Tab>
            <Tab eventKey={"Statment of Income"} title={"قائمة الدخل"}>
              <FinancialsTab
                title={"قائمة الدخل"}
                annualData={stockFinancialData.incomeSheet}
                quarterlyData={stockFinancialData.incomeSheetQuarterly}
              />
            </Tab>
            <Tab eventKey={"Cash Flow"} title={"التدفق النقدي"}>
              <FinancialsTab
                title={"التدفق النقدي"}
                annualData={stockFinancialData.cashFlow}
                quarterlyData={stockFinancialData.cashFlowQuarterly}
              />
            </Tab>
          </Tabs>
        </CustomCard>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FinancialsTable;
