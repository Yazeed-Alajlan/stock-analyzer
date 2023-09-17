import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { CustomCard } from "../utils/CustomCard";
import { useOutletContext } from "react-router-dom";
import FinancialsTab from "../Financials/FinancialsTab";

const FinancialsTable = () => {
  const [data, symbol] = useOutletContext();

  return (
    <div>
      {data ? (
        <CustomCard>
          <Tabs className="p-0" defaultActiveKey={"Balance Sheet"}>
            <Tab eventKey={"Balance Sheet"} title={"المركز المالي"}>
              <FinancialsTab
                title={"المركز المالي"}
                annualData={data.balanceSheet}
                quarterlyData={data.balanceSheetQuarterly}
              />
            </Tab>
            <Tab eventKey={"Statment of Income"} title={"قائمة الدخل"}>
              <FinancialsTab
                title={"قائمة الدخل"}
                annualData={data.incomeSheet}
                quarterlyData={data.incomeSheetQuarterly}
              />
            </Tab>
            <Tab eventKey={"Cash Flow"} title={"التدفق النقدي"}>
              <FinancialsTab
                title={"التدفق النقدي"}
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
  );
};

export default FinancialsTable;
