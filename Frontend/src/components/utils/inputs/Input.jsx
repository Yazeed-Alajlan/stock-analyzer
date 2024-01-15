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
  labelDirection, // New prop for label direction (horizontal/vertical)
}) => {
  return (
    <CompnentLayout>
      <div
        className={`d-flex ${
          labelDirection === "vr" ? "flex-column" : ""
        } gap-2`}
      >
        <label className="form-label fs-5 my-auto fw-bold">{label}</label>
        <input
          className="form-control w-100 z-2"
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

// Example usage:
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
//   labelDirection="vertical" // or "horizontal" (default)
// />;

export default Input;
