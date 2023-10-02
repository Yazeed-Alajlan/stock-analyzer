import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import Select from "react-select";
import { useStocksData } from "../../contexts/StocksDataContext";
import logo from "../../assets/logo.png";

export const Header = ({ sideBar, setSideBar }) => {
  const navigate = useNavigate();
  const { stocksData, selectedStock, setSelectedStock } = useStocksData();
  console.log(selectedStock);

  const handleStockSelect = (selectedOption) => {
    console.log("MEEEEEEEEEEEEEEEETHODDDDDDDDDDDDDD");
    console.log(selectedStock);
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
    <Container fluid className="bg-light p-4   shadow ">
      <Navbar expand="lg" className="">
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
              <Nav.Link as={Link} to="/comparison" onClick={handleStockSelect}>
                قارن
              </Nav.Link>
              {/* <Nav.Link as={Link} to="/market-summary">
                Market Summary
              </Nav.Link> */}

              {/* <NavDropdown title="Link" id="navbarScrollingDropdown">
                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action4">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5">
                  Something else here
                </NavDropdown.Item>
              </NavDropdown> */}
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
  );
};
