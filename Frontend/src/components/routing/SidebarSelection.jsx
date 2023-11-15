import { CustomCard } from "components/utils/CustomCard";
import { Nav } from "react-bootstrap";
import React from "react";
import { Link, useLocation } from "react-router-dom";

export const SidebarSelection = ({ routes }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <CustomCard>
      <Nav className="gap-2">
        {routes.map((route, index) => (
          <Nav.Item className="w-100" key={index}>
            <Nav.Link
              as={Link}
              to={route.to} // Using the 'to' property from the route object
              className={"p-2 " + (isActive(route.path) ? " bg-light" : "")}
            >
              <route.icon />
              {route.name}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </CustomCard>
  );
};
