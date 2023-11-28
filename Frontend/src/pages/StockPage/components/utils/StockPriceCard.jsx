import { CustomCard } from "components/utils/cards/CustomCard";
import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { IconContext } from "react-icons";
import { FiChevronDown } from "react-icons/fi";

const StockPriceCard = ({ open, close, low, high }) => {
  const priceChange = close - open;
  const percentageChange = ((priceChange / open) * 100).toFixed(2);

  let textClass, borderClass;

  if (priceChange > 0) {
    textClass = "text-success";
    borderClass = "border-success";
  } else if (priceChange < 0) {
    textClass = "text-danger";
    borderClass = "border-danger";
  } else {
    textClass = "text-secondary";
    borderClass = "border-secondary";
  }

  return (
    <CustomCard className="">
      <Row>
        <Col className="text-center p-0" xs={"7"}>
          <Row>
            <Col className="d-flex flex-column p-0" xs={"6"}>
              <div>
                الأعلى : <span className="text-primary fw-bold">{high}</span>
              </div>
              <div>
                الأدنى :<span className="text-primary fw-bold">{low}</span>
              </div>
            </Col>
            <Col className="d-flex flex-column p-0" xs={"6"}>
              <div>
                الإفتتاح : <span className="text-primary fw-bold">{open}</span>
              </div>
              <div>
                الإغلاق : <span className="text-primary fw-bold">{close}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={"1"}>
          <div className={`border-start border-3 h-100 ${borderClass}`}></div>
        </Col>
        <Col className="p-0 text-center" xs={"4"}>
          <div>
            السعر : <span className="text-primary fs-5 fw-bold">{close}</span>
          </div>
          <div className={textClass}>
            {priceChange.toFixed(2)} ({percentageChange}%)
          </div>
        </Col>
      </Row>
    </CustomCard>
  );
};

export default StockPriceCard;
