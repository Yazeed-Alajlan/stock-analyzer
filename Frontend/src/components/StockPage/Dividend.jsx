import React from "react";
import { useOutletContext } from "react-router-dom";
import SelectionTitle from "./utils/SelectionTitle";
import { CustomCard } from "../utils/CustomCard";
import { Container, Table } from "react-bootstrap";

const Dividend = () => {
  const { stockFinancialData } = useOutletContext();
  console.log(stockFinancialData);
  return (
    <div>
      {stockFinancialData ? (
        <CustomCard>
          <SelectionTitle title={"الأرباح و التوزيعات"} />
          <Container className="pt-3">
            <Table className="fs-5 table-light" responsive hover>
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
          </Container>
        </CustomCard>
      ) : (
        <p>loading</p>
      )}
    </div>
  );
};

export default Dividend;
