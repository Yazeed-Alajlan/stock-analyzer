import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Card, Container, Table, Button, Col, Row } from "react-bootstrap";
import Select from "react-select";
import { useStocksData } from "../../contexts/StocksDataContext";
import PageLayout from "components/PageLayout";
import { CustomCard } from "components/utils/CustomCard";
import FilterCard from "components/utils/FilterCard";
import InputSelect from "components/utils/InputSelect";

const StocksPage = () => {
  let { sector } = useParams();
  if (sector == "all") sector = "جميع القطاعات";
  const { stocksData, selectedStock, setSelectedStock } = useStocksData();
  const [sectorName, setSectorName] = useState(sector);
  const [filteredData, setFilteredData] = useState(null);
  const [selectedStockOption, setSelectedStockOption] = useState(); // Initialize with an empty object
  const sectorOptions = stocksData
    ? [...new Set(stocksData.map((item) => item.sectorNameAr))].map(
        (sector) => ({
          value: sector,
          label: sector,
        })
      )
    : [];
  const [companyOptions, setCompanyOptions] = useState([]);

  useEffect(() => {
    // Filter data based on sector and search query
    if (stocksData) {
      const filtered = stocksData.filter((item) => {
        const sectorMatch =
          sectorName === "جميع القطاعات" ||
          item.sectorNameAr.toLowerCase() === sectorName.toLowerCase();

        return sectorMatch;
      });
      setFilteredData(filtered);

      // Update the company options based on the selected sector
      const filteredCompanies = stocksData
        .filter(
          (item) =>
            sectorName === "جميع القطاعات" ||
            item.sectorNameAr.toLowerCase() === sectorName.toLowerCase()
        )
        .map((stock) => ({
          value: stock.symbol,
          label: `${stock.tradingNameAr} (${stock.symbol})`,
        }));
      setCompanyOptions(filteredCompanies);
    }
  }, [stocksData, sectorName]);

  const handleFilterChange = (selectedOption) => {
    if (selectedOption != null) {
      setSectorName(selectedOption.value);
    } else {
      setSectorName("جميع القطاعات");
    }
  };

  const handleFilterStock = (selectedOption) => {
    if (selectedOption != null) {
      setSelectedStockOption(selectedOption);
      // Filter data to show only the selected stock
      const stockMatch = stocksData.filter(
        (item) => item.symbol === selectedOption.value
      );
      setFilteredData(stockMatch); // Update filteredData with the selected stock
    } else {
      setSelectedStockOption(); // Clear selected stock by setting it to an empty object
      // Reset filteredData to show all data
      setFilteredData(stocksData);
    }
  };

  const clearFilters = () => {
    setSectorName("جميع القطاعات");
    setSelectedStockOption(); // Clear selected stock by setting it to an empty object
    // Reset filteredData to show all data
    setFilteredData(stocksData);
  };

  return (
    <PageLayout title={"الشركات"} className="d-flex flex-column gap-4">
      <CustomCard>
        <FilterCard className={"bg-light"}>
          <Col xs={8} xl={4}>
            <InputSelect
              className="w-100"
              label={"الشركة"}
              options={companyOptions}
              value={selectedStockOption}
              onChange={handleFilterStock}
              placeholder="ابحث حسب اسم الشركة أو الرمز"
            />
          </Col>
          <Col xs={8} xl={7}>
            <InputSelect
              className="w-100"
              label={"القطاع"}
              value={{ value: sectorName, label: sectorName }}
              options={sectorOptions}
              onChange={handleFilterChange}
              placeholder="اختر القطاع"
            />
          </Col>
          <Col xs={8} xl={1}>
            <Button
              variant="danger"
              as="input"
              type="reset"
              value="حذف"
              onClick={clearFilters}
            />
          </Col>
        </FilterCard>
        <Card.Body>
          {filteredData && (
            <div
              className="custom-scrollbar"
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              <Table borderless striped hover>
                <thead className="position-sticky top-0">
                  <tr>
                    <th className="table-header">الشركة</th>
                    <th className="table-header">الإفتتاح</th>
                    <th className="table-header">الأعلى</th>
                    <th className="table-header">الأدنى</th>
                    <th className="table-header">الإغلاق</th>
                    <th className="table-header">التغيير</th>
                    <th className="table-header">نسبة التغيير</th>
                    <th className="table-header">الكمية المتداولة</th>
                    <th className="table-header">القيمة المتداولة</th>
                    <th className="table-header">الأعلى آخر 52 أسبوع</th>{" "}
                    <th className="table-header">الأدنى آخر 52 أسبوع</th>{" "}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => {
                    const lastElement = item.summary.length - 1;

                    return (
                      <tr key={index}>
                        <td>
                          <Link
                            className="text-decoration-none"
                            to={`/companies/${item.sectorNameAr}/${item.symbol}/information`}
                            onClick={() => {
                              setSelectedStock({
                                value: item.symbol,
                                label: `${item.tradingNameAr} (${item.symbol})`,
                                sector: item.sectorNameAr,
                              });
                            }}
                          >
                            <span className="ms-3">{item.symbol}</span>
                            <span>{item.tradingNameAr}</span>
                          </Link>
                        </td>
                        <td className="fw-bold">
                          {item.summary[lastElement].open}
                        </td>
                        <td>{item.summary[lastElement].high}</td>
                        <td>{item.summary[lastElement].low}</td>
                        <td>{item.summary[lastElement].close}</td>
                        <td
                          className={
                            item.summary[lastElement].change_value.includes("-")
                              ? "text-danger"
                              : "text-success"
                          }
                        >
                          {item.summary[lastElement].change_value}
                        </td>
                        <td
                          className={
                            item.summary[lastElement].change_ratio.includes("-")
                              ? "text-danger"
                              : "text-success"
                          }
                        >
                          {item.summary[lastElement].change_ratio}
                        </td>
                        <td>{item.summary[lastElement].trade_volume}</td>
                        <td>{item.summary[lastElement].trade_value}</td>
                        <td>{item.summary[lastElement].fifty_two_week_high}</td>
                        <td>{item.summary[lastElement].fifty_two_week_low}</td>
                        {/* Add other TDs using item.summary[lastElement] or item.summary[0] */}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </CustomCard>
    </PageLayout>
  );
};

export default StocksPage;
