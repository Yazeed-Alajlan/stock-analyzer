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
  defaultValue,
  menuIsOpen,
}) => {
  console.log(defaultValue);
  return (
    <CompnentLayout>
      <div className="d-flex gap-2 ">
        <p className="fs-5 my-auto">{label}</p>
        <Select
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          className={`w-75   ${className}`}
          placeholder={placeholder}
          options={options}
          value={selectedOption}
          onChange={onChange}
          isDisabled={isDisabled}
          isClearable
          isSearchable
          isMulti={isMulti}
          defaultValue={options.find((option) => option.value === defaultValue)}
          menuIsOpen={menuIsOpen}
        />
      </div>
    </CompnentLayout>
  );
};

export default InputSelect;
