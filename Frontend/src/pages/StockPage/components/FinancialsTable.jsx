import React, { useState } from "react";
import { CustomCard } from "components/utils/CustomCard";
import { useOutletContext } from "react-router-dom";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import CustomButton from "components/utils/CustomButton";
import SelectionTitle from "components/utils/SelectionTitle";
import { BsCalendar3 } from "react-icons/bs";
import { Container } from "react-bootstrap";
import FinancialsTab from "./financials/FinancialsTab";

const FinancialsTable = () => {
  const { stockFinancialData } = useOutletContext();
  const [selectedTab, setSelectedTab] = useState("Balance Sheet");
  const [displayAnnual, setDisplayAnnual] = useState(true);

  const handleTabClick = (tabKey) => {
    setSelectedTab(tabKey);
  };

  const handleDisplayButtonClick = (isAnnual) => {
    setDisplayAnnual(isAnnual);
  };

  return (
    <div>
      {stockFinancialData ? (
        <CustomCard>
          <SelectionTitle title={"القوائم المالية"} />
          <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center pb-5">
              <ButtonGroup className="gap-2">
                <CustomButton
                  variant={
                    selectedTab === "Balance Sheet"
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() => handleTabClick("Balance Sheet")}
                  title={"المركز المالي"}
                />
                <CustomButton
                  variant={
                    selectedTab === "Statment of Income"
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() => handleTabClick("Statment of Income")}
                  title={"قائمة الدخل"}
                />
                <CustomButton
                  variant={
                    selectedTab === "Cash Flow" ? "primary" : "outline-primary"
                  }
                  onClick={() => handleTabClick("Cash Flow")}
                  title={"التدفق النقدي"}
                />
              </ButtonGroup>
              <ButtonGroup className="gap-2">
                <div className="fs-3">
                  <span className="mx-2">
                    <BsCalendar3 />
                  </span>
                  المدة:
                </div>
                <CustomButton
                  variant={displayAnnual ? "primary" : "outline-primary"}
                  onClick={() => handleDisplayButtonClick(true)}
                  title={"سنوي"}
                />
                <CustomButton
                  variant={displayAnnual ? "outline-primary" : "primary"}
                  onClick={() => handleDisplayButtonClick(false)}
                  title={"ربع سنوي"}
                />
              </ButtonGroup>
            </div>

            <div>
              {selectedTab === "Balance Sheet" && (
                <FinancialsTab
                  title={"المركز المالي"}
                  data={
                    displayAnnual
                      ? stockFinancialData.balanceSheet
                      : stockFinancialData.balanceSheetQuarterly
                  }
                />
              )}
              {selectedTab === "Statment of Income" && (
                <FinancialsTab
                  title={"قائمة الدخل"}
                  data={
                    displayAnnual
                      ? stockFinancialData.incomeSheet
                      : stockFinancialData.incomeSheetQuarterly
                  }
                />
              )}
              {selectedTab === "Cash Flow" && (
                <FinancialsTab
                  title={"التدفق النقدي"}
                  data={
                    displayAnnual
                      ? stockFinancialData.cashFlow
                      : stockFinancialData.cashFlowQuarterly
                  }
                />
              )}
            </div>
          </Container>
        </CustomCard>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FinancialsTable;
