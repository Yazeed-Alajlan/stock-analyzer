import React, { useState } from "react";
import { CustomCard } from "components/utils/CustomCard";
import { useOutletContext } from "react-router-dom";
import { BsCalendar3 } from "react-icons/bs";
import { Container } from "react-bootstrap";
import FinancialsTable from "./FinancialsTable";
import ButtonsGroup from "components/utils/ButtonsGroup";
import FinancialsChart from "./FinancialsChart";

const Financials = () => {
  const { stockFinancialData } = useOutletContext();
  const [selectedTab, setSelectedTab] = useState(1);
  const [displayAnnual, setDisplayAnnual] = useState(1);

  const financialsButtons = [
    { id: 1, title: "المركز المالي" },
    { id: 2, title: "قائمة الدخل" },
    { id: 3, title: "التدفق النقدي" },
    { id: 4, title: " CHART" },
  ];
  const periodButtons = [
    { id: 1, title: "سنوي" },
    { id: 2, title: "ربع سنوي" },
  ];
  return (
    <div>
      {stockFinancialData ? (
        <CustomCard header={"القوائم المالية"}>
          <Container className="py-4">
            <div className="d-flex justify-content-around align-items-center pb-5">
              <ButtonsGroup
                buttons={financialsButtons}
                parentSetState={setSelectedTab}
              />

              <ButtonsGroup
                label={"المدة"}
                icon={<BsCalendar3 />}
                buttons={periodButtons}
                parentSetState={setDisplayAnnual}
              />
            </div>

            <div>
              {selectedTab === 1 && (
                <FinancialsTable
                  title={"المركز المالي"}
                  data={
                    displayAnnual === 1
                      ? stockFinancialData.balanceSheet
                      : stockFinancialData.balanceSheetQuarterly
                  }
                />
              )}
              {selectedTab === 2 && (
                <FinancialsTable
                  title={"قائمة الدخل"}
                  data={
                    displayAnnual === 1
                      ? stockFinancialData.incomeSheet
                      : stockFinancialData.incomeSheetQuarterly
                  }
                />
              )}
              {selectedTab === 3 && (
                <FinancialsTable
                  title={"التدفق النقدي"}
                  data={
                    displayAnnual === 1
                      ? stockFinancialData.cashFlow
                      : stockFinancialData.cashFlowQuarterly
                  }
                />
              )}
              {selectedTab === 4 && <FinancialsChart />}
            </div>
          </Container>
        </CustomCard>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Financials;
