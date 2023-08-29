import React from "react";
import { Card } from "react-bootstrap";

const SmCardInformaiton = ({ text }) => {
  return (
    <Card className="bg-light border-0 shadow-sm rounded-3">
      <Card.Body className="p-2 fs-6 fw-lighter">{text} </Card.Body>
    </Card>
  );
};

export default SmCardInformaiton;
