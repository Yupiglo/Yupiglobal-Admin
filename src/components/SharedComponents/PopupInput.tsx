"use client";

import React, { forwardRef, useState } from "react";
import InputField from "./InputField";

interface PopupInputProps {
  label: string;
  type?: string;
  maxLength?: number;
  minLength?: number;
}

/**  Component to render a single password/email/OTP field in popup*/
const PopupInput = forwardRef<HTMLInputElement, PopupInputProps>(
  ({ label, type = "text", maxLength, minLength }, ref) => {
    const [formValues, setFormValues] = useState({
      mobileNumber: "",
      email: "",
      otp: "",
    });
    const [error, setError] = useState({
        mobileNumber: "",
        email: "",
        otp: "",
      });

    const handleBlur = (
        e: React.FocusEvent<HTMLInputElement>,
        inputField: string
      ) => {
        const value = e.target.value;
        let errorMessage = "";
    
        switch (inputField) {
          case "mobileNumber":
            if (value.length < 10) {
              errorMessage = "Mobile Number must be 10 characters long.";
            }
            break;
          case "otp":
            if (value.length < 1) {
                errorMessage = "Please enter your six digit OTP.";
              }
            break;
          default:
            break;
        }
    
        setError((prevErrors) => ({
          ...prevErrors,
          [inputField]: errorMessage,
        }));
      };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLInputElement>) => {
      event.preventDefault();
    };

    let inputField;

    if (label.toUpperCase().includes("MOBILE")) {
      inputField = (
        <>
        <input
          type={type}
          id={label}
          required={true}
          maxLength={maxLength}
          minLength={minLength}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
          ref={ref}
          value={formValues.mobileNumber}
          onChange={(e) =>
            setFormValues({ ...formValues, mobileNumber: e.target.value })
          }
          onBlur={(e) => handleBlur(e, "mobileNumber")}
          onPaste={handlePaste}
          onDrop={handleDrop}
        />
        {error.mobileNumber && (
            <span className="text-red-500 text-xs">{error.mobileNumber}</span>
          )}
          </>
      );
    } else if (label.toUpperCase().includes("EMAIL")) {
      inputField = (
        <>
        <input
          type={type}
          id={label}
          required={true}
          maxLength={maxLength}
          minLength={minLength}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
          ref={ref}
          value={formValues.email}
          onChange={(e) =>
            setFormValues({ ...formValues, email: e.target.value })
          }
          onBlur={(e) => handleBlur(e, "email")}
          onPaste={handlePaste}
          onDrop={handleDrop}
        />
        {error.email && (
            <span className="text-red-500 text-xs">{error.email}</span>
          )}
          </>
      );
    } else if (label.toUpperCase().includes("OTP")) {
      inputField = (
        <>
        <input
          type={type}
          id={label}
          required={true}
          maxLength={maxLength}
          minLength={minLength}
          placeholder="Enter OTP"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
          ref={ref}
          value={formValues.otp}
          onChange={(e) =>
            setFormValues({ ...formValues, otp: e.target.value })
          }
          onBlur={(e) => handleBlur(e, "otp")}
          onPaste={handlePaste}
          onDrop={handleDrop}
          pattern="^[0-9]$"
        />
        {error.otp && (
            <span className="text-red-500 text-xs">{error.otp}</span>
          )}
          </>
      );
    } else {
      inputField = (
        <InputField
          label={label}
          type={type}
          id={label}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
          ref={ref}
        />
      );
    }

    return (
      <div>
        {/* <label className="block text-sm font-medium text-gray-700">
          {label}
          <span className="text-red-500 text-sm">*</span>
        </label> */}
        {inputField}
        {/* {error && <span className="text-red-500 text-xs">{error}</span>} */}
      </div>
    );
  }
);
PopupInput.displayName = "PopupInput";

export default PopupInput;
