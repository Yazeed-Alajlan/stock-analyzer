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
}) => {
  return (
    <CompnentLayout>
      <div className="d-flex gap-2">
        <p className="fs-5 my-auto">{label}</p>
        <Select
          className="w-75 z-2"
          placeholder={placeholder}
          options={options}
          value={selectedOption}
          onChange={onChange}
          isDisabled={isDisabled}
          isClearable
          isSearchable
        />
      </div>
    </CompnentLayout>
  );
};

export default InputSelect;
