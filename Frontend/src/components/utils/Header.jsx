import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

export const Header = ({ sideBar, setSideBar }) => {
  const navigate = useNavigate(); // Use the useNavigate hook

  const [data, setData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

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

  const handleStockSelect = (selectedOption) => {
    console.log(selectedOption);
    navigate(
      `/companies/${selectedOption.sector}/${selectedOption.value}/information`
    );
    setSelectedOption(null); // Replace setSelectedOption with your state setter
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
                <Nav.Link as={Link} to="/home">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/companies/all">
                  Companies
                </Nav.Link>
                <Nav.Link as={Link} to="/market-summary">
                  Market Summary
                </Nav.Link>
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
              value={selectedOption} // Set the value of the Select component
              options={
                data &&
                data.map((stock) => ({
                  value: stock.symbol,
                  label: `${stock.tradingNameEn} (${stock.symbol})`,
                  sector: stock.sectorNameEn,
                }))
              }
              isSearchable={true}
              onChange={handleStockSelect}
            />
          </Container>
        </Navbar>
      </Container>
    </div>
  );
};
