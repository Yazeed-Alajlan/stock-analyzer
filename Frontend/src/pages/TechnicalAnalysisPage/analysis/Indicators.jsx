import React from "react";
import { Button, ListGroup } from "react-bootstrap";

const Indicators = ({ indicators, onDelete }) => {
  console.log(indicators);
  return (
    <div className="d-flex gap-4">
      {indicators.map((indicator, index) => (
        <ListGroup.Item
          key={index}
          className="d-flex justify-content-between align-items-center"
        >
          <span>{indicator.name}</span>
          <Button
            variant="danger"
            onClick={() => onDelete(indicator.name, indicator.pane, index)}
          >
            Delete
          </Button>
        </ListGroup.Item>
      ))}
    </div>
  );
};

export default Indicators;
