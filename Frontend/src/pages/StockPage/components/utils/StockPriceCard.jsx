import { CustomCard } from "components/utils/CustomCard";
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
    <CustomCard className={""}>
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
        <Col className="text-center" xs={"4"}>
          <div>السعر : {open}</div>
          <div className="text-danger ">
            {change} ({changePercentage}%)
          </div>
        </Col>
      </Row>
    </CustomCard>
  );
};

export default StockPriceCard;
