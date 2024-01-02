import React from "react";
import { motion } from "framer-motion";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

const IconButton = ({ icon: Icon, onClick, hoverText, size, text }) => {
  const smClass = size === "sm" ? "fs-6 p-0" : "fs-4";

  return (
    <OverlayTrigger
      trigger={["hover", "hover"]}
      placement="bottom"
      overlay={hoverText ? <Tooltip id="tooltip">{hoverText}</Tooltip> : <></>}
    >
      <Button
        className={`d-inline-flex align-items-center text-grey fw-bolder p-2 border-0`}
        onClick={onClick}
        size={size}
        variant="outline-dark-light"
      >
        {Icon && <Icon className={`${smClass} ${text ? "me-2" : ""}`} />}
        {text}
      </Button>
    </OverlayTrigger>
  );
};

export default IconButton;
