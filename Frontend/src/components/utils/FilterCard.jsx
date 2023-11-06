import React from "react";
import CustomButton from "./CustomButton";
import { Col, Row } from "react-bootstrap";

const FilterCard = ({
  label,
  options,
  selectedValue,
  onChange,
  placeholder,
  isSelect,
}) => {
  return (
    <div>
      {/* <Row className="d-flex border-1 border-bottom pb-4">
        <Col xs={8} xl={5} className="d-flex">
          <p className="my-auto ms-3">{label}:</p>
          {isSelect ? (
            <Select
              options={options}
              value={selectedValue}
              onChange={onChange}
              placeholder={placeholder}
              className="w-75 z-2"
            />
          ) : (
            <input
              type="number"
              value={selectedValue}
              onChange={onChange}
              placeholder={placeholder}
              className="w-75 z-2"
            />
          )}
        </Col>
        <Col xs={8} xl={2} className="d-flex justify-content-center">
          <CustomButton title={"ابحث"} onClick={sendSelectedPattern} />
        </Col>
      </Row> */}
    </div>
  );
};

export default FilterCard;
