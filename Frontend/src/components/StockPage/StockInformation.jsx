import React from "react";
import { motion } from "framer-motion";
import { Col, Row, Table } from "react-bootstrap";
import { BsArrowDown } from "react-icons/bs";
import { CustomCard } from "../utils/CustomCard";
import { useOutletContext, useParams } from "react-router-dom";
import StockChart from "../StockChart";

const StockInformation = () => {
  const [stockInformationData, symbol] = useOutletContext();
  const { sector } = useParams();

  return (
    <div>
      {stockInformationData ? (
        <CustomCard>
          <Row>
            <Col xs={6}>
              <Table responsive>
                <tbody>
                  <tr>
                    <th>القيمة السوقية</th>
                    <th>
                      {stockInformationData.summary[0].daily_price_to_earnings}
                    </th>
                  </tr>
                  <tr>
                    <th>ربحية السهم EPS</th>
                    <th>
                      {
                        stockInformationData.summary[0]
                          .basic_earnings_per_share_ttm
                      }
                    </th>
                  </tr>
                  <tr>
                    <th>مكرر الربحية</th>
                    <th>
                      {stockInformationData.summary[0].daily_price_to_earnings}
                    </th>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col xs={6}>
              <Table className="" responsive>
                <tbody>
                  <tr>
                    <th>مضاعف القيمة الدفترية</th>
                    <th>
                      {
                        stockInformationData.summary[0]
                          .basic_earnings_per_share_ttm
                      }
                    </th>
                  </tr>{" "}
                  <tr>
                    <th>القيمة الدفترية</th>
                    <th>
                      {stockInformationData.summary[0].book_value_per_share_ttm}
                    </th>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row>{/* <StockChart symbol={symbol} /> */}</Row>
        </CustomCard>
      ) : (
        <p>loading</p>
      )}
    </div>
  );
};

export default StockInformation;
