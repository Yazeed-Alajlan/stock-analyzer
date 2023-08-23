import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
            <div key={sector}>
              <h3>{sector}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Acronym Name</th>
                    <th>Company Reference</th>
                    <th>High Price</th>
                    <th>Low Price</th>
                    <th>Net Change</th>
                    <th>Percent Change</th>
                    <th>Previous Close Price</th>
                    <th>Today Close Price</th>
                    <th>Today Open</th>
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
              </table>
            </div>
          ))}
        </div>
      )}

      {/* <Outlet /> */}
    </div>
  );
};

export default CompaniesPage;
