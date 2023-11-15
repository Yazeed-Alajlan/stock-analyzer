import React, { useState } from "react";
import { CustomCard } from "components/utils/CustomCard";
import { useOutletContext } from "react-router-dom";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import CustomButton from "components/utils/CustomButton";
import SelectionTitle from "components/utils/SelectionTitle";
import { BsCalendar3 } from "react-icons/bs";
import { Container } from "react-bootstrap";
import FinancialsTab from "./FinancialsTab";
import ButtonsGroup from "components/utils/ButtonsGroup";

const FinancialsTable = () => {
  const { stockFinancialData } = useOutletContext();
  const [selectedTab, setSelectedTab] = useState(1);
  const [displayAnnual, setDisplayAnnual] = useState(1);

  const handleDisplayButtonClick = (isAnnual) => {
    setDisplayAnnual(isAnnual);
  };
  const financialsButtons = [
    { id: 1, title: "المركز المالي" },
    { id: 2, title: "قائمة الدخل" },
    { id: 3, title: "التدفق النقدي" },
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
            <div className="d-flex justify-content-between align-items-center pb-5">
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
                <FinancialsTab
                  title={"المركز المالي"}
                  data={
                    displayAnnual === 1
                      ? stockFinancialData.balanceSheet
                      : stockFinancialData.balanceSheetQuarterly
                  }
                />
              )}
              {selectedTab === 2 && (
                <FinancialsTab
                  title={"قائمة الدخل"}
                  data={
                    displayAnnual === 1
                      ? stockFinancialData.incomeSheet
                      : stockFinancialData.incomeSheetQuarterly
                  }
                />
              )}
              {selectedTab === 3 && (
                <FinancialsTab
                  title={"التدفق النقدي"}
                  data={
                    displayAnnual === 1
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
