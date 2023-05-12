import React from "react";

const Textfield = (props) => {
  const { type, readOnly, placeholder, name, label, value, onChange } = props;
  return (
    <form className="mb-1 sm:mb-4 mt-1 sm:mt-6">
      <label
        className="block text-gray-700 text-sm font-semibold mb-2"
        htmlFor="email"
      >
        {label}
      </label>
      <input
        required={true}
        readOnly={readOnly}
        onChange={(event) => onChange(event)}
        type={type}
        placeholder={placeholder}
        name={name}
        defaultValue={value}
        value={value}
        id={name}
        className={`${
          readOnly && "bg-gray-300"
        } text-sm appearance-none rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline h-10`}
      />
    </form>
  );
};

export default Textfield;
