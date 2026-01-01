// src/components/ui/FloatingInput.jsx
import React from "react";

export default function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder = " ",
  autoFocus = false,
  required = false,
  rightElement = null,
  ...rest
}) {
  // Use placeholder=" " trick to let :placeholder-shown work
  return (
    <div className="input-float">
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        required={required}
        {...rest}
      />
      <label htmlFor={id}>{label}</label>
      {rightElement ? <div className="input-eye" aria-hidden>{rightElement}</div> : null}
    </div>
  );
}
