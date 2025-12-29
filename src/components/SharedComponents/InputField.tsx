/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { forwardRef, useState } from "react";
import classNames from "classnames";
import { InputFieldProps } from "../../types/types";
import { AllowOnlyNumbers } from "@/libs/numberInputValidation";
import Image from "next/image";

import { usePathname } from "next/navigation";
import PasswordPolicyTooltip from "./PasswordPolicyTooltip";

/**  Common component to render the form fields in QRC views
 */
const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
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
      disableShowIcon,
      inputMode,
      error,
      success,
      readOnly = false,
      onClick,
      onChange,
      onBlur,
      ...props
    },
    ref
  ) => {
    const pathname = usePathname() ?? ""; // Get the current pathname
    const [showTooltip, setShowTooltip] = useState(false);
    const [inputError, setInputError] = useState<string | null>(null);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const value = e.target.value.trim();

      // Check for required field
      if (required && !value) {
        setInputError(`${label} is required`);
      } else {
        setInputError(null);
      }

      if (onBlur) {
        onBlur(e);
      }
    };

    return (
      <div className={`w-full flex flex-col gap-1`}>
        <label
          htmlFor={id}
          className={`block text-customGrey text-sm font-medium items-centre px-1`}
        >
          <span className="flex items-center">
            {label}
            {required && <span className="text-customRed pl-1">*</span>}
            {(label === "New Password" || label === "Password") &&
              !disableShowIcon && (
                <button
                  className="pl-1 relative cursor-pointer bg-transparent border-none"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={
                    onClick as React.MouseEventHandler<HTMLButtonElement>
                  }
                  tabIndex={0}
                  aria-label="Show password requirements"
                >
                  <span className="cursor-pointer" onClick={onClick}>
                    <Image
                      src="/iDetail.svg"
                      alt="iDetail"
                      width={16}
                      height={16}
                    />
                  </span>
                  {showTooltip && (
                    <PasswordPolicyTooltip
                      pathname={pathname}
                      setShowTooltip={setShowTooltip}
                    />
                  )}
                </button>
              )}
          </span>
        </label>
        <input
          type={type}
          autoComplete="off"
          id={id}
          className={classNames(
            className,
            `w-full rounded-lg min-h-[2.75rem] border border-gray-200 bg-white px-3 text-gray-900 
             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
             transition-all duration-200 text-sm shadow-sm`
          )}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          ref={ref}
          readOnly={readOnly}
          disabled={disabled}
          onChange={readOnly || disabled ? undefined : onChange ?? (() => { })}
          onBlur={handleBlur} // Custom validation logic
          onKeyDown={(e) => {
            if (inputMode === "numeric") {
              AllowOnlyNumbers(e, id);
            }
          }}
          {...props} // Spread the rest of the props onto the input element
        />
        {(error || inputError) && (
          <p className="h-[2rem] lg:h-[0.9rem] text-red-500 text-xs mt-1">
            {error ?? inputError}
          </p>
        )}

        {success && (
          <p className="h-[0.9rem] text-green-500 text-xs mt-1">{success}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;
