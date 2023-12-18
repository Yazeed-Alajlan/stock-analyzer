import React from "react";
import CompnentLayout from "components/CompnentLayout";

const Input = ({
  label,
  type,
  value,
  placeholder,
  onChange,
  isDisabled,
  name,
  min,
  max,
  ref,
}) => {
  return (
    <CompnentLayout>
      <div className="d-flex gap-2">
        <p className="fs-5 my-auto">{label}</p>
        <input
          className="w-100 z-2"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={isDisabled}
          min={min}
          max={max}
          ref={ref}
          name={name}
        />
      </div>
    </CompnentLayout>
  );
};

// <Input
//   label="النمط:"
//   type="number"
//   inputContent={selectedPattern2}
//   onChange={(event) => {
//     setSelectedPattern2(event.target.value);
//   }}
//   placeholder="حدد النمط"
//   max={100}
//   min={0}
// />;

export default Input;
