import React from "react";
import { motion } from "framer-motion";
import { Table } from "react-bootstrap";
import { BsArrowDown } from "react-icons/bs";
import { CustomCard } from "./utils/CustomCard";
import { useOutletContext } from "react-router-dom";

const StockInformation = () => {
  const [data, symbol] = useOutletContext();

  const getStockInformationById = () => {
    return {
      id: "4321",
      name: "Cenomy Centers",
      sector: "blabla",
      lastPrice: 30,
      changeInPrice: 10,
      changeInPercentagePrice: 33,
    };
  };

  const stockInformation = getStockInformationById();

  return (
    <motion.div whileHover={{ scale: 1.03 }}>
      <CustomCard>
        <div className="text-secondary">
          {symbol} - {stockInformation.sector}
        </div>
        <div className="d-flex">
          <div className="pe-3 fs-2 fw-bold">{stockInformation.name}</div>
          <div className="d-flex align-items-end fs-4 text-danger">
            {stockInformation.lastPrice}
            <BsArrowDown className="fs-3" />
            (-{stockInformation.changeInPrice})(
            {stockInformation.changeInPercentagePrice}%)
          </div>
        </div>

        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>أدنى سنوي</th>
              <th>أعلى سنوي </th>
              <th>القيمه الدفتريه </th>
              <th>العائد على السهم </th>
            </tr>
            <tr>
              <th> 10</th>
              <th> 10 </th>
              <th> 10</th>
              <th> 10 </th>
            </tr>
          </thead>
        </Table>
      </CustomCard>
    </motion.div>
  );
};

export default StockInformation;
