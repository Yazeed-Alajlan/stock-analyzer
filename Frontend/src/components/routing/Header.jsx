import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import Select from "react-select";
import { useStocksData } from "../../contexts/StocksDataContext";
import logo from "../../assets/logo.png";

export const Header = ({ sideBar, setSideBar }) => {
  const navigate = useNavigate();
  const { stocksData, selectedStock, setSelectedStock } = useStocksData();
  const location = useLocation(); // Get the current location

  const [selectedLink, setSelectedLink] = useState("");

  // Function to set the selected link based on the current location
  const setSelectedLinkFromLocation = () => {
    const currentPath = location.pathname;
    setSelectedLink(currentPath);
  };

  useEffect(() => {
    setSelectedLinkFromLocation();
  }, [location]);

  const handleStockSelect = (selectedOption) => {
    if (selectedOption.value != null) {
      setSelectedStock(selectedOption);
      navigate(
        `/companies/${selectedOption.sector}/${selectedOption.value}/information`
      );
    } else {
      setSelectedStock("");
    }
  };

  return (
    <Container fluid className="bg-light p-4 shadow">
      <Navbar expand="lg">
        <Container>
          <div className="d-flex justify-content-center align-items-center fs-2">
            <Navbar.Brand as={Link} to="/">
              <img
                src={logo}
                width="120"
                height="100"
                className="d-inline-block align-top"
                alt="React Bootstrap logo"
              />
            </Navbar.Brand>
            <Nav>
              <Nav.Link
                as={Link}
                to="/home"
                onClick={handleStockSelect}
                className={selectedLink === "/home" ? "selected-link" : ""}
              >
                الرئيسية
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/companies/all"
                onClick={handleStockSelect}
                className={
                  selectedLink === "/companies/all" ? "selected-link" : ""
                }
              >
                السوق
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/comparison"
                onClick={handleStockSelect}
                className={
                  selectedLink === "/comparison" ? "selected-link" : ""
                }
              >
                قارن
              </Nav.Link>
            </Nav>
          </div>

          {/* 
          <button
            onClick={() => {
              setSideBar(!sideBar);
            }}
          >
            SideBar
          </button> */}

          <Select
            className="w-25"
            placeholder="البحث عن شركة"
            value={selectedStock}
            options={
              stocksData &&
              stocksData.map((stock) => ({
                value: stock.symbol,
                label: `${stock.tradingNameAr} (${stock.symbol})`,
                sector: stock.sectorNameAr,
              }))
            }
            isSearchable
            onChange={handleStockSelect}
          />
        </Container>
      </Navbar>
    </Container>
  );
};
