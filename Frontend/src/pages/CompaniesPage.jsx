import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Card, Container, Table, Button, Col, Row } from "react-bootstrap";
import Select from "react-select";
import { useStocksData } from "../contexts/StocksDataContext";

const CompaniesPage = () => {
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
    <Container className="d-flex flex-column gap-4">
      <h1>الشركات</h1>
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col xs={8} xl={4}>
              <div className="d-flex">
                <p className="my-auto mx-2">الشركة</p>
                <Select
                  className="w-100"
                  placeholder="Search by Company Name or Symbol"
                  options={companyOptions} // Use the filtered company options here
                  onChange={handleFilterStock}
                  value={selectedStockOption}
                  isClearable={true}
                  isSearchable={true}
                />
              </div>
            </Col>
            <Col xs={8} xl={7}>
              <div className="d-flex w-100">
                <p className="my-auto mx-2">القطاع</p>
                {/* Sector filter select */}
                <Select
                  className="w-100"
                  defaultValue={{
                    value: "جميع القطاعات",
                    label: "جميع القطاعات",
                  }}
                  value={{ value: sectorName, label: sectorName }}
                  options={[
                    { value: "جميع القطاعات", label: "جميع القطاعات" },
                    ...sectorOptions,
                  ]}
                  isSearchable={true}
                  isClearable={true}
                  onChange={handleFilterChange}
                />
              </div>
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
          </Row>
        </Card.Header>
        <Card.Body>
          {filteredData && (
            <div
              className="custom-scrollbar"
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              {/* Make the table scrollable by wrapping it in a div */}
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
                  {filteredData.map((item, index) => (
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
                      <td className="fw-bold">{item.summary[0].open}</td>
                      <td>{item.summary[0].high}</td>
                      <td>{item.summary[0].low}</td>
                      <td>{item.summary[0].close}</td>
                      <td
                        className={
                          item.summary[0].change_value.includes("-")
                            ? "text-danger"
                            : "text-success"
                        }
                      >
                        {item.summary[0].change_value}
                      </td>
                      <td
                        className={
                          item.summary[0].change_ratio.includes("-")
                            ? "text-danger"
                            : "text-success"
                        }
                      >
                        {item.summary[0].change_ratio}
                      </td>
                      <td>{item.summary[0].trade_volume}</td>
                      <td>{item.summary[0].trade_value}</td>
                      <td>{item.summary[0].fifty_two_week_high}</td>
                      <td>{item.summary[0].fifty_two_week_low}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CompaniesPage;
