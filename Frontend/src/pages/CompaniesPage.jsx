import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, Table } from "react-bootstrap";

const CompaniesPage = () => {
  const [data, setData] = useState(null);
  const [sectorName, setSectorName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = sectorName
          ? `http://localhost:5000/companies/${sectorName}`
          : "http://localhost:5000/companies";
        const response = await axios.get(url);
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [sectorName]); // Run useEffect whenever sectorFilter changes
  const handleFilterChange = (event) => {
    setSectorName(event.target.value);
  };
  let groupedData = null;

  if (data) {
    groupedData = data.reduce((acc, item) => {
      const { sectorNameEn } = item;
      if (acc[sectorNameEn]) {
        acc[sectorNameEn].push(item);
      } else {
        acc[sectorNameEn] = [item];
      }
      return acc;
    }, {});
  }

  return (
    <div>
      <h2>Companies Page</h2>
      <div>
        {/* Sector filter select */}
        <select value={sectorName} onChange={handleFilterChange}>
          <option value="">All Sectors</option>
          {data &&
            [...new Set(data.map((item) => item.sectorNameEn))].map(
              (sector, index) => (
                <option key={index} value={sector}>
                  {sector}
                </option>
              )
            )}
        </select>
      </div>

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
                        <Link
                          to={`/companies/symbol/${item.symbol}/information`}
                        >
                          {item.tradingNameEn}
                        </Link>
                      </td>
                      <td>{item.symbol}</td>
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
    </div>
  );
};

export default CompaniesPage;
