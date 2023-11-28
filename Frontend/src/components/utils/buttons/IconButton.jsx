import React from "react";
import { motion } from "framer-motion";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

const IconButton = ({ icon: Icon, onClick, hoverText, size }) => {
  return (
    <OverlayTrigger
      trigger={["hover", "hover"]}
      placement="bottom"
      overlay={hoverText ? <Tooltip id="tooltip">{hoverText}</Tooltip> : <></>}
    >
      <Button
        className={`text-center text-grey fw-bolder m-2 p-2 border-0 `}
        onClick={onClick}
        size={size}
        variant="outline-dark-light"
      >
        {Icon && <Icon className="fs-4" />}
      </Button>
    </OverlayTrigger>
  );
};

export default IconButton;
