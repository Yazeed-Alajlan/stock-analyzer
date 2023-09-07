import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { IconContext } from "react-icons";
import { FiChevronDown } from "react-icons/fi";
const StockPriceCard = ({
  price,
  change,
  changePercentage,
  open,
  close,
  lowest,
  highest,
}) => {
  return (
    <Card className="bg-white border-0 shadow-sm rounded-4 w-100  text-center">
      <Card.Body>
        <Row>
          <Col xs={"7"}>
            <Row>
              <Col className="d-flex flex-column" xs={"6"}>
                <div>الأعلى : {open}</div>
                <div>الأدنى : {open}</div>
              </Col>
              <Col className="d-flex flex-column" xs={"6"}>
                <div>الإفتتاح : {open}</div>
                <div>الإغلاق : {open}</div>
              </Col>
            </Row>
          </Col>
          <Col xs={"1"}>
            <div className="border-start border-danger border-3 h-100"></div>
          </Col>
          <Col xs={"4"}>
            <div>السعر : {open}</div>
            <div className="text-danger ">
              {change} ({changePercentage}%)
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default StockPriceCard;
