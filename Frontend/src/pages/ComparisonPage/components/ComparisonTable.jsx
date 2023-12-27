import React, { useEffect, useState } from "react";
import { CustomCard } from "components/utils/cards/CustomCard";
import FinancialsTab from "pages/StockPage/components/financials/FinancialsTable";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import CustomButton from "components/utils/buttons/CustomButton";
import { BsCalendar3 } from "react-icons/bs";
import { Container } from "react-bootstrap";
import { useStocksData } from "contexts/StocksDataContext";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Tabs from "components/utils/Tabs";
import Tab from "components/utils/Tab";
import FinancialsTable from "pages/StockPage/components/financials/FinancialsTable";
import ButtonsGroup from "components/utils/buttons/ButtonsGroup";

const ComparisonTable = () => {
  const { getStockFinancialData, getStockInformationData, stocksData } =
    useStocksData();

  const [stockInformationData, setStockInformationData] = useState();
  const [stockFinancialData, setStockFinancialData] = useState();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const maxSelected = 2; // Change this to your desired maximum limit
  const animatedComponents = makeAnimated();

  const [selectedTab, setSelectedTab] = useState("Balance Sheet");
  const [displayAnnual, setDisplayAnnual] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedDataPromises = selectedOptions.map(async (option) => {
          const symbol = option.value;
          const financialData = await getStockFinancialData(symbol);
          // You can also fetch stock information data here if needed
          // const informationData = await getStockInformationData(symbol);
          return financialData;
        });

        const fetchedData = await Promise.all(fetchedDataPromises);
        console.log(fetchedData);
        // Combine the first elements of each specified array from the fetchedData array
        const combinedObject = {
          balanceSheet: [
            fetchedData[0].balanceSheet[0],
            fetchedData[0].balanceSheet[1],
            fetchedData[1].balanceSheet[0],
            fetchedData[1].balanceSheet[1],
          ],
          balanceSheetQuarterly: [
            fetchedData[0].balanceSheetQuarterly[0],
            fetchedData[0].balanceSheetQuarterly[1],
            fetchedData[1].balanceSheetQuarterly[0],
            fetchedData[1].balanceSheetQuarterly[1],
          ],
          cashFlow: [
            fetchedData[0].cashFlow[0],
            fetchedData[0].cashFlow[1],
            fetchedData[1].cashFlow[0],
            fetchedData[1].cashFlow[1],
          ],
          cashFlowQuarterly: [
            fetchedData[0].cashFlowQuarterly[0],
            fetchedData[0].cashFlowQuarterly[1],
            fetchedData[1].cashFlowQuarterly[0],
            fetchedData[1].cashFlowQuarterly[1],
          ],
          incomeSheet: [
            fetchedData[0].incomeSheet[0],
            fetchedData[0].incomeSheet[1],
            fetchedData[1].incomeSheet[0],
            fetchedData[1].incomeSheet[1],
          ],
          incomeSheetQuarterly: [
            fetchedData[0].incomeSheetQuarterly[0],
            fetchedData[0].incomeSheetQuarterly[1],
            fetchedData[1].incomeSheetQuarterly[0],
            fetchedData[1].incomeSheetQuarterly[1],
          ],
          tradingNameAr: [
            fetchedData[0].tradingNameAr,
            fetchedData[1].tradingNameAr,
          ],
        };
        console.log(combinedObject);
        // Set stock financial data
        setStockFinancialData(combinedObject);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (selectedOptions.length > 0) {
      fetchData();
    }
  }, [selectedOptions]);

  const handleTabClick = (tabKey) => {
    setSelectedTab(tabKey);
  };

  const handleDisplayButtonClick = (isAnnual) => {
    setDisplayAnnual(isAnnual);
  };

  return (
    <div>
      <CustomCard>
        <p className="fs-4 fw-bold">اختر شركتين للمقارنة من نفس القطاع :</p>
        <div className="w-50">
          <Select
            isMulti
            options={
              stocksData &&
              stocksData
                .filter((stock) => {
                  // Filter out stocks that do not match the sector of selectedOptions
                  if (
                    selectedOptions.length === 0 ||
                    selectedOptions.every(
                      (selectedOption) =>
                        selectedOption.sector === stock.sectorNameEn
                    )
                  ) {
                    return true;
                  }
                  return false;
                })
                .map((stock) => ({
                  value: stock.symbol,
                  label: `${stock.tradingNameAr} (${stock.symbol})`,
                  sector: stock.sectorNameEn,
                }))
            }
            className="basic-multi-select"
            classNamePrefix="select"
            components={animatedComponents}
            maxMenuHeight={200}
            value={selectedOptions}
            onChange={(selected) => {
              if (selected.length <= maxSelected) {
                setSelectedOptions(selected);
              }
            }}
          />
        </div>

        {stockFinancialData && selectedOptions.length == 2 ? (
          <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center pb-5">
              <Tabs activeTab={1}>
                <Tab text={"المركز المالي"}>
                  <FinancialsTable
                    header={
                      (stockFinancialData.tradingNameAr,
                      stockFinancialData.tradingNameAr)
                    }
                    title={"المركز المالي"}
                    data={stockFinancialData.balanceSheet}
                  />
                </Tab>
                <Tab text={"قائمة الدخل"}>
                  <FinancialsTable
                    header={
                      (stockFinancialData.tradingNameAr,
                      stockFinancialData.tradingNameAr)
                    }
                    title={"قائمة الدخل"}
                    data={stockFinancialData.incomeSheet}
                  />
                </Tab>
                <Tab text={"التدفق النقدي"}>
                  <FinancialsTable
                    header={
                      (stockFinancialData.tradingNameAr,
                      stockFinancialData.tradingNameAr)
                    }
                    title={"التدفق النقدي"}
                    data={stockFinancialData.cashFlow}
                  />
                </Tab>
              </Tabs>

              <ButtonsGroup
                label={"المدة"}
                icon={<BsCalendar3 />}
                buttons={[
                  { id: 1, text: "سنوي" },
                  { id: 2, text: "ربع سنوي" },
                ]}
                parentSetState={setDisplayAnnual}
              />
            </div>

            <div>
              {selectedTab === "Balance Sheet" && (
                <FinancialsTab
                  title={"المركز المالي"}
                  header={
                    (stockFinancialData.tradingNameAr,
                    stockFinancialData.tradingNameAr)
                  }
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
                  header={
                    (stockFinancialData.tradingNameAr,
                    stockFinancialData.tradingNameAr)
                  }
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
                  header={
                    (stockFinancialData.tradingNameAr,
                    stockFinancialData.tradingNameAr)
                  }
                  data={
                    displayAnnual
                      ? stockFinancialData.cashFlow
                      : stockFinancialData.cashFlowQuarterly
                  }
                />
              )}
            </div>
          </Container>
        ) : selectedOptions.length != 2 ? (
          <></>
        ) : (
          <p>loading</p>
        )}
      </CustomCard>
    </div>
  );
};

export default ComparisonTable;
