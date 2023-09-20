import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import Select from "react-select";
import { useStocksData } from "../../contexts/StocksDataContext";

export const Header = ({ sideBar, setSideBar }) => {
  const navigate = useNavigate();
  const { stocksData, selectedStock, setSelectedStock } = useStocksData();

  const handleStockSelect = (selectedOption) => {
    if (selectedOption != null) {
      setSelectedStock(selectedOption);
      navigate(
        `/companies/${selectedOption.sector}/${selectedOption.value}/information`
      );
    }
  };

  return (
    <div className="bg-white p-4 w-100">
      <Container>
        <Navbar expand="lg" className="">
          <Container>
            <div>
              <Navbar.Brand as={Link} to="/">
                LOGO
                {/* <img
                src=""
                width="60"
                height="60"
                className="d-inline-block align-top"
                alt="React Bootstrap logo"
              /> */}
              </Navbar.Brand>
              <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: "100px" }}
              >
                <Nav.Link as={Link} to="/home" onClick={handleStockSelect}>
                  الرئيسية
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/companies/all"
                  onClick={handleStockSelect}
                >
                  السوق
                </Nav.Link>
                {/* <Nav.Link as={Link} to="/market-summary">
                  Market Summary
                </Nav.Link> */}
                {/* 
              <NavDropdown title="Link" id="navbarScrollingDropdown">
                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action4">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5">
                  Something else here
                </NavDropdown.Item>
              </NavDropdown> 
              */}
              </Nav>
            </div>
            <button
              onClick={() => {
                setSideBar(!sideBar);
              }}
            >
              SideBar
            </button>

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
    </div>
  );
};
