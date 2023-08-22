import React from "react";
import { Link, Outlet } from "react-router-dom";

const CompaniesPage = () => {
  return (
    <div>
      <h2>Companies Page</h2>
      <ul>
        <li>
          <Link to="/companies/symbol/4321">4321</Link>
        </li>
        <li>
          <Link to="/companies/symbol/2222">2222</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
};

export default CompaniesPage;
