import React from "react";

const UpdateTextfield = (props) => {
  const {
    type,
    placeholder,
    readOnly,
    name,
    label,
    defaultValue,
    onChange,
    className,
  } = props;
  return (
    <div className={className}>
      <label
        className="block text-gray-700 text-sm font-semibold mb-2"
        htmlFor="email"
      >
        {label}
      </label>
      <input
        required
        readOnly={readOnly}
        onChange={(event) => onChange(event)}
        type={type}
        placeholder={placeholder}
        name={name}
        defaultValue={defaultValue}
        id={name}
        className={`${
          readOnly && "bg-red-300"
        }text-sm appearance-none rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline h-10`}
      />
    </div>
  );
};

export default UpdateTextfield;
