import React, { useEffect, useState } from "react";
import { CustomCard } from "components/utils/CustomCard";
import { useOutletContext } from "react-router-dom";
import { BsCalendar3 } from "react-icons/bs";
import { TbChartBar, TbTable } from "react-icons/tb";
import { Container } from "react-bootstrap";
import FinancialsTable from "./FinancialsTable";
import ButtonsGroup from "components/utils/ButtonsGroup";
import FinancialsChart from "./FinancialsChart";

const Financials = () => {
  const { stockFinancialData } = useOutletContext();
  const [selectedTab, setSelectedTab] = useState(1);
  const [displayAnnual, setDisplayAnnual] = useState(1);
  const [type, setType] = useState(1);
  const [financialData, setFinancialData] = useState(null);

  useEffect(() => {
    // Assuming stockFinancialData has all necessary properties for annual and quarterly data
    if (stockFinancialData) {
      setFinancialData({
        balanceSheet:
          displayAnnual === 1
            ? stockFinancialData.balanceSheet
            : stockFinancialData.balanceSheetQuarterly,
        incomeSheet:
          displayAnnual === 1
            ? stockFinancialData.incomeSheet
            : stockFinancialData.incomeSheetQuarterly,
        cashFlow:
          displayAnnual === 1
            ? stockFinancialData.cashFlow
            : stockFinancialData.cashFlowQuarterly,
      });
    }
  }, [stockFinancialData, displayAnnual]);

  const financialsButtons = [
    { id: 1, title: "المركز المالي" },
    { id: 2, title: "قائمة الدخل" },
    { id: 3, title: "التدفق النقدي" },
  ];
  const periodButtons = [
    { id: 1, title: "سنوي" },
    { id: 2, title: "ربع سنوي" },
  ];
  const typeButtons = [
    { id: 1, icon: TbChartBar },
    { id: 2, icon: TbTable },
  ];
  return (
    <div>
      {financialData ? (
        <CustomCard header={"القوائم المالية"}>
          <Container className="py-4">
            <div className="d-flex justify-content-around align-items-center pb-5">
              <ButtonsGroup buttons={typeButtons} parentSetState={setType} />
              <ButtonsGroup
                label={"المدة"}
                icon={<BsCalendar3 />}
                buttons={periodButtons}
                parentSetState={setDisplayAnnual}
              />
            </div>
            {type === 1 ? (
              <>
                <FinancialsChart stockFinancialData={financialData} />
              </>
            ) : (
              <>
                <div className="d-flex justify-content-around align-items-center pb-5">
                  <ButtonsGroup
                    buttons={financialsButtons}
                    parentSetState={setSelectedTab}
                  />
                </div>
                <div>
                  {selectedTab === 1 && (
                    <FinancialsTable
                      title={"المركز المالي"}
                      data={financialData.balanceSheet}
                    />
                  )}
                  {selectedTab === 2 && (
                    <FinancialsTable
                      title={"قائمة الدخل"}
                      data={financialData.incomeSheet}
                    />
                  )}
                  {selectedTab === 3 && (
                    <FinancialsTable
                      title={"التدفق النقدي"}
                      data={financialData.cashFlow}
                    />
                  )}
                </div>
              </>
            )}
          </Container>
        </CustomCard>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Financials;
