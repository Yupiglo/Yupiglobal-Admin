"use client";

import React, { forwardRef } from "react";
import classNames from "classnames";
import { InputFieldProps } from "../../types/types";
import { AllowOnlyNumbers } from "@/libs/numberInputValidation";

const sharedInputClasses =
  "border-l border-l-customBorder pl-2 text-sm h-[2.6rem] title-text-color-1 focus:outline-none sm:w-10/12 w-10/12 lg:w-10/12";
const sharedLabelClasses = "h-[1.5rem] block text-sm font-medium";
const errorClass = "h-[0.9rem] text-red-500 text-xs mt-1";
const successClass = "h-[0.9rem] text-green-500 text-xs mt-1";

/** Common component to render input field for mobile view */
const MobileInputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      id,
      label,
      type = "text",
      required = false,
      className,
      maxLength,
      minLength,
      disabled,
      onClick,
      onChange,
      inputMode,
      error,
      success,
      ...props
    },
    ref
  ) => (
    <>
      <div className={`${(error || success)?"lg:h-[6rem] h-[6.5rem]":"h-[4.5rem]"} w-full`}>
        <label htmlFor={id} className={sharedLabelClasses}>
          {label}
          {required && <span className="text-customText pl-1">*</span>}
          {(label === "New Password" || label === "Password") && (
            <span onClick={onClick} className="info-icon">
              i
            </span>
          )}
        </label>
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full bg-white">
          <span className="sm:w-2/12 w-2/12 lg:w-2/12 py-1 px-1">+91</span>
          <input
            type={type}
            autoComplete="off"
            id={id}
            className={classNames(className, sharedInputClasses, {
              " ": !disabled,
              "bg-[#e2e5e4] hover: cursor-not-allowed": disabled,
            })}
            required={required}
            maxLength={maxLength}
            minLength={minLength}
            ref={ref}
            disabled={disabled}
            onChange={onChange}
            onKeyDown={(e) => {
              if (inputMode === "numeric") {
                AllowOnlyNumbers(e, id);
              }
            }}
            {...props} // Spread the rest of the props onto the input element
          />
        </div>
        {error && <p className={errorClass}>{error}</p>}
        {success && <p className={successClass}>{success}</p>}
      </div>
    </>
  )
);

MobileInputField.displayName = "InputField";
export default MobileInputField;
