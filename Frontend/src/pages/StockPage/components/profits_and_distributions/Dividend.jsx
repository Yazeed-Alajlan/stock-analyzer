import React from "react";
import { useOutletContext } from "react-router-dom";
import SelectionTitle from "components/utils/SelectionTitle";
import { CustomCard } from "components/utils/CustomCard";
import { Container, Table } from "react-bootstrap";

const Dividend = () => {
  const { stockFinancialData } = useOutletContext();
  return (
    <>
      {stockFinancialData ? (
        <CustomCard header={"الأرباح و التوزيعات"}>
          <Table className="fs-5" responsive hover>
            <thead>
              <tr>
                <th>تاريخ الإعلان </th>
                <th>تاريخ الإستحقاق </th>
                <th>تاريخ التوزيع </th>
                <th>طريقة التوزيع </th>
                <th>الربح الموزع</th>
              </tr>
            </thead>
            <tbody>
              {stockFinancialData.dividends.map((dividend, index) => (
                <tr key={index}>
                  <td>{dividend.announced_date}</td>
                  <td>{dividend.eligibility_date}</td>
                  <td>{dividend.distribution_date}</td>
                  <td>{dividend.distribution_way}</td>
                  <td>{dividend.dividend_per_share}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CustomCard>
      ) : (
        <p>loading</p>
      )}
    </>
  );
};

export default Dividend;
