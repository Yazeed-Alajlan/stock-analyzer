import React from "react";
import { motion } from "framer-motion";

import { Card } from "react-bootstrap";

import { BsCaretDownFill } from "react-icons/bs";
import { BsCaretUpFill } from "react-icons/bs";

import { FaMoneyBillWave } from "react-icons/fa";

const InformationCard = ({ title, value, percentage, icon }) => {
  return (
    <motion.div whileHover={{ scale: 1.03 }}>
      <Card
        className="bg-white border-0 shadow-sm rounded-4 w-100"
        // style={{ minHeight: "150px", maxWidth: "250px" }}
      >
        <Card.Body className="d-flex flex-column gap-2">
          <div className="d-flex align-items-center gap-2">
            <div className="icon">
              <FaMoneyBillWave className="display-5 text-white" />
            </div>
            <div className="text-muted fs-4">{title}</div>
          </div>
          <div className="text-center fs-3">
            {value < 0 ? (
              <div className="text-danger">
                <BsCaretDownFill />
                {value}
              </div>
            ) : (
              <div className="text-white">
                <BsCaretUpFill />
                {value}
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default InformationCard;
