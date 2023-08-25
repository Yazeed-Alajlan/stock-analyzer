import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, Table } from "react-bootstrap";

const CompaniesPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/companies");
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  let groupedData = null;

  if (data) {
    groupedData = data.reduce((acc, item) => {
      const { sectorName } = item;
      if (acc[sectorName]) {
        acc[sectorName].push(item);
      } else {
        acc[sectorName] = [item];
      }
      return acc;
    }, {});
  }

  return (
    <div>
      <h2>Companies Page</h2>
      {groupedData && (
        <div>
          {Object.entries(groupedData).map(([sector, sectorData]) => (
            <Container key={sector}>
              <h2>{sector}</h2>
              <Table hover>
                <thead>
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
                  {sectorData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Link to={`/companies/symbol/${item.companyRef}`}>
                          {item.acrynomName}
                        </Link>
                      </td>
                      <td>{item.companyRef}</td>
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
            </Container>
          ))}
        </div>
      )}

      {/* <Outlet /> */}
    </div>
  );
};

export default CompaniesPage;
