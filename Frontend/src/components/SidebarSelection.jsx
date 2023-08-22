import { CustomCard } from "./utils/CustomCard";
import { Card, Container } from "react-bootstrap";
import React from "react";
import { Link, Outlet, useParams } from "react-router-dom";
export const SidebarSelection = () => {
  const { symbol } = useParams();

  return (
    <CustomCard className="bg-white border-0 shadow-lg rounded-4 w-100 ">
      <Container>
        <div>
          <h2>Companies Page</h2>
          <ul>
            <li>
              <Link to={`/companies/symbol/${symbol}/information`}>
                information
              </Link>
            </li>

            <li>
              <Link to={`/companies/symbol/${symbol}/financials`}>
                financials
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </CustomCard>
  );
};
