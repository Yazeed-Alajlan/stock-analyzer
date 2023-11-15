import React from "react";
import { Card } from "react-bootstrap";

const SmCardInformaiton = ({ text, title }) => {
  return (
    <Card className="bg-light   shadow-sm rounded-3">
      <Card.Body className="p-2  ">
        <span> {title}</span> :{" "}
        <span className="text-primary  fw-bold">{text}</span>
      </Card.Body>
    </Card>
  );
};

export default SmCardInformaiton;
