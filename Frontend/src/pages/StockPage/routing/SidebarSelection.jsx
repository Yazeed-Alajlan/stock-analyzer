import { CustomCard } from "components/utils/CustomCard";
import { Container, Nav } from "react-bootstrap";
import React from "react";
import { Link, useLocation } from "react-router-dom";

export const SidebarSelection = ({ routes }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <CustomCard>
      <Nav className="flex-column">
        {routes.map((route, index) => (
          <Nav.Item key={index}>
            <Nav.Link
              as={Link}
              to={route.to} // Using the 'to' property from the route object
              className={isActive(route.path) ? "bg-light" : ""}
            >
              {React.createElement(route.icon, { className: "mr-2" })}
              {route.name}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </CustomCard>
  );
};
