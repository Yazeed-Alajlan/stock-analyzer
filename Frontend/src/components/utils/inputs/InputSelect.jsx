import React from "react";
import CompnentLayout from "components/CompnentLayout";
import Select from "react-select";
import makeAnimated from "react-select/animated";

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
  const animatedComponents = makeAnimated();

  return (
    <CompnentLayout>
      <div className="d-flex gap-2 ">
        <p className="fs-5 my-auto text-nowrap">{label}</p>
        <Select
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          className={`w-100    ${className}`}
          placeholder={placeholder}
          options={options}
          value={selectedOption}
          onChange={onChange}
          isDisabled={isDisabled}
          isClearable
          isSearchable
          closeMenuOnSelect={isMulti ? false : true}
          isMulti={isMulti}
          defaultValue={
            defaultValue &&
            options.find((option) => option.value === defaultValue)
          }
          menuIsOpen={menuIsOpen}
        />
      </div>
    </CompnentLayout>
  );
};

export default InputSelect;
