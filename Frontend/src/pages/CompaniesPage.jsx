import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Card, Container, Table, Button, Col, Row } from "react-bootstrap";
import Select from "react-select";

const CompaniesPage = () => {
  let { sector } = useParams();
  if (sector === "all") {
    sector = "";
  }

  const [data, setData] = useState(null);
  const [sectorName, setSectorName] = useState(sector);
  const [filteredData, setFilteredData] = useState(null);
  const [selectedStock, setSelectedStock] = useState({}); // Initialize with an empty object

  const sectorOptions = data
    ? [...new Set(data.map((item) => item.sectorNameEn))].map((sector) => ({
        value: sector,
        label: sector,
      }))
    : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost:5000/companies";
        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter data based on sector and search query
    if (data) {
      const filtered = data.filter((item) => {
        const sectorMatch =
          sectorName === "" ||
          item.sectorNameEn.toLowerCase() === sectorName.toLowerCase();

        return sectorMatch;
      });

      setFilteredData(filtered);
    }
  }, [data, sectorName, selectedStock]);

  const handleFilterChange = (selectedOption) => {
    console.log(selectedOption);
    if (selectedOption != null) {
      setSectorName(selectedOption.value);
    } else {
      setSectorName("");
    }
  };

  const handleFilterStock = (selectedOption) => {
    if (selectedOption != null) {
      setSelectedStock(selectedOption);
      // Filter data to show only the selected stock
      if (data) {
        const stockMatch = data.filter(
          (item) => item.symbol === selectedOption.value
        );
        setFilteredData(stockMatch);
      }
    } else {
      setSelectedStock({}); // Clear selected stock by setting it to an empty object
    }
  };

  const clearFilters = () => {
    setSectorName("");
    setSelectedStock({}); // Clear selected stock by setting it to an empty object
  };

  return (
    <Container className="d-flex flex-column gap-4">
      <h1>الشركات</h1>
      <Card>
        <Card.Header>
          <Row className=" align-items-center">
            <Col xs={8} xl={4}>
              <div className="d-flex">
                <p className="my-auto mx-2">الشركة</p>
                <Select
                  className="w-100"
                  placeholder="Search by Company Name or Symbol"
                  options={
                    filteredData &&
                    filteredData.map((stock) => ({
                      value: stock.symbol,
                      label: `${stock.tradingNameEn} (${stock.symbol})`,
                    }))
                  }
                  onChange={handleFilterStock}
                  value={selectedStock}
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
                  value={{ value: sectorName, label: sectorName }}
                  options={[
                    { value: "", label: "All Sectors" },
                    ...sectorOptions,
                  ]}
                  isClearable={true}
                  isSearchable={true}
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
                    <th className="table-header">Name</th>
                    <th className="table-header">Symbol</th>
                    <th className="table-header">High Price</th>
                    <th className="table-header">Low Price</th>
                    <th className="table-header">Net Change</th>
                    <th className="table-header">Percent Change</th>
                    <th className="table-header">Previous Close Price</th>
                    <th className="table-header">Today Close Price</th>
                    <th className="table-header">Today Open</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Link
                          to={`/companies/${item.sectorNameEn}/${item.symbol}/information`}
                        >
                          {item.tradingNameEn}
                        </Link>
                      </td>
                      <td>{item.symbol}</td>
                      <td>{item.highPrice}</td>
                      <td>{item.lowPrice}</td>
                      <td>{item.netChange}</td>
                      <td>{item.precentChange}</td>
                      <td>{item.previousClosePrice}</td>
                      <td>{item.todayClosePrice}</td>
                      <td>{item.todayOpen}</td>
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
