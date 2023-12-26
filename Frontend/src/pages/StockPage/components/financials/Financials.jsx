import React, { useEffect, useState } from "react";
import { CustomCard } from "components/utils/cards/CustomCard";
import { useOutletContext } from "react-router-dom";
import { BsCalendar3 } from "react-icons/bs";
import { TbChartBar, TbTable } from "react-icons/tb";
import { Container } from "react-bootstrap";
import FinancialsTable from "./FinancialsTable";
import ButtonsGroup from "components/utils/buttons/ButtonsGroup";
import FinancialsChart from "./FinancialsChart";
import Tabs from "components/utils/Tabs";
import Tab from "components/utils/Tab";

const Financials = () => {
  const { stockFinancialData } = useOutletContext();
  const [displayAnnual, setDisplayAnnual] = useState(0);
  const [financialData, setFinancialData] = useState(null);

  useEffect(() => {
    if (stockFinancialData) {
      setFinancialData({
        balanceSheet:
          displayAnnual === 0
            ? stockFinancialData.balanceSheet
            : stockFinancialData.balanceSheetQuarterly,
        incomeSheet:
          displayAnnual === 0
            ? stockFinancialData.incomeSheet
            : stockFinancialData.incomeSheetQuarterly,
        cashFlow:
          displayAnnual === 0
            ? stockFinancialData.cashFlow
            : stockFinancialData.cashFlowQuarterly,
      });
      // setFinancialData({
      //   balanceSheet: {
      //     annual: stockFinancialData.balanceSheet,
      //     quarterly: stockFinancialData.balanceSheetQuarterly,
      //   },
      //   incomeSheet: {
      //     annual: stockFinancialData.incomeSheet,
      //     quarterly: stockFinancialData.incomeSheetQuarterly,
      //   },
      //   cashFlow: {
      //     annual: stockFinancialData.cashFlow,
      //     quarterly: stockFinancialData.cashFlowQuarterly,
      //   },
      // });
    }
  }, [stockFinancialData, displayAnnual]);

  const periodButtons = [
    { id: 1, text: "سنوي" },
    { id: 2, text: "ربع سنوي" },
  ];
  return (
    <div>
      {financialData ? (
        <CustomCard header={"القوائم المالية"}>
          <Container className="py-4">
            <Tabs>
              <Tab icon={TbChartBar}>
                <FinancialsChart stockFinancialData={financialData} />
              </Tab>
              <Tab icon={TbTable}>
                <Tabs activeTab={1}>
                  <Tab text={"المركز المالي"}>
                    <FinancialsTable
                      title={"المركز المالي"}
                      data={financialData.balanceSheet}
                    />
                  </Tab>
                  <Tab text={"قائمة الدخل"}>
                    <FinancialsTable
                      title={"قائمة الدخل"}
                      data={financialData.incomeSheet}
                    />
                  </Tab>
                  <Tab text={"التدفق النقدي"}>
                    <FinancialsTable
                      title={"التدفق النقدي"}
                      data={financialData.cashFlow}
                    />
                  </Tab>
                </Tabs>
              </Tab>
              <ButtonsGroup
                label={"المدة"}
                icon={<BsCalendar3 />}
                buttons={periodButtons}
                parentSetState={setDisplayAnnual}
              />
            </Tabs>
          </Container>
        </CustomCard>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Financials;
