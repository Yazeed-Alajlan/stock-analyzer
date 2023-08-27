import { CustomCard } from "./utils/CustomCard";
import { Card, Container, Nav } from "react-bootstrap";
import { FaInfoCircle, FaChartLine, FaCog } from "react-icons/fa";
import React from "react";
import { Link, useParams, useLocation } from "react-router-dom";
export const SidebarSelection = () => {
  const { symbol } = useParams();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <CustomCard>
      <Container className="p-0">
        <Nav className="flex-column">
          <Nav.Item>
            <Nav.Link
              as={Link}
              to={`/companies/symbol/${symbol}/information`}
              className={isActive("/information") ? "bg-light" : ""}
            >
              <FaInfoCircle className="mr-2" /> Information
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              as={Link}
              to={`/companies/symbol/${symbol}/financials`}
              className={isActive("financials") ? "bg-light" : ""}
            >
              <FaChartLine className="mr-2" /> Financials
            </Nav.Link>
          </Nav.Item>
          {/* <Nav.Item>
            <Nav.Link
              as={Link}
              to="/settings"
              className={isActive("settings") ? "active" : ""}
            >
              <FaCog className="mr-2" /> Settings
            </Nav.Link>
          </Nav.Item> */}
        </Nav>
      </Container>
    </CustomCard>
  );
};
