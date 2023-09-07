import React from "react";
import { Card } from "react-bootstrap";

const SmCardInformaiton = ({ text, title }) => {
  return (
    <Card className="bg-light border-0 shadow-sm rounded-3">
      <Card.Body className="p-2 fs-6 fw-lighter">
        <span> {title}</span> : <span>{text}</span>
      </Card.Body>
    </Card>
  );
};

export default SmCardInformaiton;
