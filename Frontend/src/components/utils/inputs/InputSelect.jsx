import React from "react";
import CompnentLayout from "components/CompnentLayout";
import Select from "react-select";

const InputSelect = ({
  label,
  options,
  selectedOption,
  placeholder,
  onChange,
  isDisabled,
  isSearchable,
  isMulti,
  className,
}) => {
  return (
    <CompnentLayout>
      <div className="d-flex gap-2 z-1900">
        <p className="fs-5 my-auto">{label}</p>
        <Select
          className={`w-75   ${className}`}
          placeholder={placeholder}
          options={options}
          value={selectedOption}
          onChange={onChange}
          isDisabled={isDisabled}
          isClearable
          isSearchable
          isMulti={isMulti}
        />
      </div>
    </CompnentLayout>
  );
};

export default InputSelect;
