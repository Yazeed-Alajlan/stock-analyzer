import React, { useEffect, useState } from "react";
import { CustomCard } from "components/utils/CustomCard";
import FinancialsTab from "pages/StockPage/components/financials/FinancialsTab";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import CustomButton from "components/utils/CustomButton";
import { BsCalendar3 } from "react-icons/bs";
import { Container } from "react-bootstrap";
import { useStocksData } from "contexts/StocksDataContext";
import Select from "react-select";
import makeAnimated from "react-select/animated";

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
