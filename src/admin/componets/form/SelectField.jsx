import React from "react";

export default function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
}) {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-1 text-sm font-medium">{label}</label>}

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Option</option>

        {options.map((opt, index) => (
          <option key={index} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}