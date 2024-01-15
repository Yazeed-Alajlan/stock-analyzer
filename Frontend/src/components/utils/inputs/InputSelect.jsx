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
  labelDirection, // New prop for label direction (hr/vr)
}) => {
  const animatedComponents = makeAnimated();
  const isHorizontal = labelDirection === "hr" || labelDirection == null;

  return (
    <CompnentLayout>
      {isHorizontal ? (
        <div className="d-flex gap-2">
          <p className="fs-5 my-auto text-nowrap fw-bold">{label}</p>
          <Select
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            className={`w-100 ${className}`}
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
      ) : (
        <div className="d-flex flex-column gap-2">
          <p className="fs-5 my-auto text-nowrap fw-bold">{label}</p>
          <Select
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            className={`w-75 ${className}`}
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
      )}
    </CompnentLayout>
  );
};

export default InputSelect;
