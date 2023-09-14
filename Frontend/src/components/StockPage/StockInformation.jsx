import React from "react";
import { motion } from "framer-motion";
import { Col, Row, Table } from "react-bootstrap";
import { BsArrowDown } from "react-icons/bs";
import { CustomCard } from "../utils/CustomCard";
import { useOutletContext, useParams } from "react-router-dom";
import StockChart from "../StockChart";

const StockInformation = () => {
  const [data, symbol] = useOutletContext();
  const { sector } = useParams();

  return (
    <div>
      {data ? (
        <CustomCard>
          <div className="text-secondary">
            {symbol} - {sector}
          </div>
          <div className="d-flex">
            <div className="pe-3 fs-2 fw-bold">{data.companyNameAR}</div>
            {/* <div className="d-flex align-items-end fs-4 text-danger">
            {stockInformation.lastPrice}
            <BsArrowDown className="fs-3" />
            (-{stockInformation.changeInPrice})(
            {stockInformation.changeInPercentagePrice}%)
          </div> */}
          </div>
          <Row>
            <Col xs={6}>
              <Table className="" responsive>
                <tbody>
                  <tr>
                    <th> مكرر الربحية</th>
                    <th> 32</th>
                  </tr>
                  <tr>
                    <th> مكرر الربحية</th>
                    <th> 32</th>
                  </tr>
                  <tr>
                    <th> مكرر الربحية</th>
                    <th> 32</th>
                  </tr>
                  <tr>
                    <th> مكرر الربحية</th>
                    <th> 32</th>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col xs={6}>
              <Table className="" responsive>
                <tbody>
                  <tr>
                    <th> مكرر الربحية</th>
                    <th> 32</th>
                  </tr>
                  <tr>
                    <th> مكرر الربحية</th>
                    <th> 32</th>
                  </tr>
                  <tr>
                    <th> مكرر الربحية</th>
                    <th> 32</th>
                  </tr>
                  <tr>
                    <th> مكرر الربحية</th>
                    <th> 32</th>
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
