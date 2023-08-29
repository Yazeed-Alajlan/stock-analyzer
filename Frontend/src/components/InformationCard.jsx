import React from "react";
import { motion } from "framer-motion";
import { BsCaretDownFill } from "react-icons/bs";
import { BsCaretUpFill } from "react-icons/bs";
import { FaMoneyBillWave } from "react-icons/fa";
import { CustomCard } from "./utils/CustomCard";
import { useOutletContext } from "react-router-dom";

const InformationCard = ({ title, value, percentage, icon }) => {
  const [data, symbol] = useOutletContext();

  return (
    <motion.div whileHover={{ scale: 1.03 }}>
      <CustomCard>
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
      </CustomCard>
    </motion.div>
  );
};

export default InformationCard;
